export type AttendanceStatus = 'Present' | 'Absent';

export interface AuthUser {
  userId: number;
  role: 'student' | 'faculty' | 'admin';
  name: string;
  email: string;
  department?: string;
  rollNo?: string;
}

export interface Student {
  StudentID: number;
  StudentName: string;
  RollNo: string;
  Department: string;
  YearOfStudy: number;
  Email: string;
}

export interface Faculty {
  FacultyID: number;
  FacultyName: string;
  Department: string;
  Email: string;
}

export interface ClassRecord {
  ClassID: number;
  FacultyID: number;
  SubjectName: string;
}

export interface AttendanceRecord {
  AttendanceID: number;
  AttendanceDate: Date;
  ClassID: number;
  Status: AttendanceStatus;
  StudentID: number;
}

export interface NotificationRecord {
  NotificationID: number;
  StudentID: number;
  Message: string;
}

export interface MonthlyAttendance {
  month: string;
  attendance: number;
}

export interface PredictionResult {
  studentId: number;
  currentAttendance: number;
  predictedAttendance: number;
  riskScore: number;
  status: 'At Risk' | 'Safe';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
