import bcrypt from 'bcrypt';
import { getPool, sql } from '../config/db';
import { signToken } from '../utils/jwt';
import { UnauthorizedError } from '../utils/errors';
import { AuthUser } from '../types';
import { LoginInput } from '../validators/auth.validator';
import { env } from '../config/env';

interface LoginResult {
  token: string;
  user: AuthUser;
}

function getAdminFacultyIds(): number[] {
  const raw = env.ADMIN_FACULTY_IDS ?? '';
  return raw
    .split(',')
    .map((id) => Number(id.trim()))
    .filter((id) => !Number.isNaN(id) && id > 0);
}

export async function login(input: LoginInput): Promise<LoginResult> {
  const pool = await getPool();
  const email = input.email.trim().toLowerCase();

  const studentResult = await pool
    .request()
    .input('email', sql.VarChar(100), email)
    .query(`
      SELECT StudentID, StudentName, RollNo, Department, Email, PasswordHash
      FROM Students WHERE LOWER(Email) = @email
    `);

  if (studentResult.recordset.length > 0) {
    const row = studentResult.recordset[0];
    const valid = await bcrypt.compare(input.password, row.PasswordHash);
    if (!valid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const user: AuthUser = {
      userId: row.StudentID,
      role: 'student',
      name: row.StudentName,
      email: row.Email,
      department: row.Department,
      rollNo: row.RollNo,
    };

    return {
      token: signToken({ userId: user.userId, role: user.role, sub: row.Email }),
      user,
    };
  }

  const facultyResult = await pool
    .request()
    .input('email', sql.VarChar(100), email)
    .query(`
      SELECT FacultyID, FacultyName, Department, Email, PasswordHash
      FROM Faculty WHERE LOWER(Email) = @email
    `);

  if (facultyResult.recordset.length === 0) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const row = facultyResult.recordset[0];
  const valid = await bcrypt.compare(input.password, row.PasswordHash);
  if (!valid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const adminIds = getAdminFacultyIds();
  const role = adminIds.includes(row.FacultyID) ? 'admin' : 'faculty';

  const user: AuthUser = {
    userId: row.FacultyID,
    role,
    name: row.FacultyName,
    email: row.Email,
    department: row.Department,
  };

  return {
    token: signToken({
      userId: user.userId,
      role: user.role,
      sub: row.Email,
    }),
    user,
  };
}

export async function getMe(userId: number, role: string): Promise<AuthUser> {
  const pool = await getPool();

  if (role === 'student') {
    const result = await pool
      .request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT StudentID, StudentName, RollNo, Department, Email
        FROM Students WHERE StudentID = @userId
      `);

    if (result.recordset.length === 0) {
      throw new UnauthorizedError('User not found');
    }

    const row = result.recordset[0];
    return {
      userId: row.StudentID,
      role: 'student',
      name: row.StudentName,
      email: row.Email,
      department: row.Department,
      rollNo: row.RollNo,
    };
  }

  const result = await pool
    .request()
    .input('userId', sql.Int, userId)
    .query(`
      SELECT FacultyID, FacultyName, Department, Email
      FROM Faculty WHERE FacultyID = @userId
    `);

  if (result.recordset.length === 0) {
    throw new UnauthorizedError('User not found');
  }

  const row = result.recordset[0];
  const adminIds = getAdminFacultyIds();
  const resolvedRole = adminIds.includes(row.FacultyID) ? 'admin' : 'faculty';

  return {
    userId: row.FacultyID,
    role: resolvedRole,
    name: row.FacultyName,
    email: row.Email,
    department: row.Department,
  };
}
