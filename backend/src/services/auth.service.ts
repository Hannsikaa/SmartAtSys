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

  if (input.role === 'student') {
    const result = await pool
      .request()
      .input('rollNo', sql.VarChar(20), input.rollNo)
      .query(`
        SELECT StudentID, StudentName, RollNo, Department
        FROM Students WHERE RollNo = @rollNo
      `);

    if (result.recordset.length === 0) {
      throw new UnauthorizedError('Invalid roll number');
    }

    const row = result.recordset[0];
    const user: AuthUser = {
      userId: row.StudentID,
      role: 'student',
      name: row.StudentName,
      department: row.Department,
      rollNo: row.RollNo,
    };

    return {
      token: signToken({ userId: user.userId, role: user.role, sub: row.RollNo }),
      user,
    };
  }

  const result = await pool
    .request()
    .input('facultyId', sql.Int, input.facultyId)
    .query(`
      SELECT FacultyID, FacultyName, Department
      FROM Faculty WHERE FacultyID = @facultyId
    `);

  if (result.recordset.length === 0) {
    throw new UnauthorizedError('Invalid faculty ID');
  }

  const row = result.recordset[0];
  const adminIds = getAdminFacultyIds();
  const role = input.role === 'admin' || adminIds.includes(row.FacultyID) ? 'admin' : 'faculty';

  if (input.role === 'admin' && role !== 'admin') {
    throw new UnauthorizedError('Not authorized as admin');
  }

  const user: AuthUser = {
    userId: row.FacultyID,
    role,
    name: row.FacultyName,
    department: row.Department,
  };

  return {
    token: signToken({
      userId: user.userId,
      role: user.role,
      sub: String(row.FacultyID),
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
        SELECT StudentID, StudentName, RollNo, Department
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
      department: row.Department,
      rollNo: row.RollNo,
    };
  }

  const result = await pool
    .request()
    .input('userId', sql.Int, userId)
    .query(`
      SELECT FacultyID, FacultyName, Department
      FROM Faculty WHERE FacultyID = @userId
    `);

  if (result.recordset.length === 0) {
    throw new UnauthorizedError('User not found');
  }

  const row = result.recordset[0];
  const adminIds = getAdminFacultyIds();
  const resolvedRole = role === 'admin' || adminIds.includes(row.FacultyID) ? 'admin' : 'faculty';

  return {
    userId: row.FacultyID,
    role: resolvedRole,
    name: row.FacultyName,
    department: row.Department,
  };
}
