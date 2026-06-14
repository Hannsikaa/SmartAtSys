-- Demo seed data for SmartAtSys (run AFTER schema.sql on empty tables)
-- Re-run safe: delete existing demo rows first if re-seeding
-- Demo password for all accounts: password123

DELETE FROM Notifications;
DELETE FROM Attendance;
DELETE FROM Classes;
DELETE FROM Students;
DELETE FROM Faculty;

INSERT INTO Faculty (FacultyID, FacultyName, Department, Email, PasswordHash) VALUES
(1, 'Dr. Smith', 'Computer Science', 'faculty@university.edu', '$2b$10$RpN5dudqlA5eJXDVL3kGYeIIbCMa8GF0xbRBte0kp/PNgckp242Nm'),
(2, 'System Admin', 'Computer Science', 'admin@university.edu', '$2b$10$RpN5dudqlA5eJXDVL3kGYeIIbCMa8GF0xbRBte0kp/PNgckp242Nm');

INSERT INTO Students (StudentID, StudentName, RollNo, Department, YearOfStudy, Email, PasswordHash) VALUES
(101, 'John Doe', 'CS2024001', 'Computer Science', 2, 'student@university.edu', '$2b$10$RpN5dudqlA5eJXDVL3kGYeIIbCMa8GF0xbRBte0kp/PNgckp242Nm'),
(102, 'Jane Smith', 'CS2024002', 'Computer Science', 2, 'student2@university.edu', '$2b$10$RpN5dudqlA5eJXDVL3kGYeIIbCMa8GF0xbRBte0kp/PNgckp242Nm');

INSERT INTO Classes (ClassID, FacultyID, SubjectName) VALUES
(1, 1, 'Data Structures');

-- Student 101: 18 Present, 7 Absent = 72% (matches UI demo)
INSERT INTO Attendance (AttendanceID, AttendanceDate, ClassID, Status, StudentID) VALUES
(1,  '2026-01-06', 1, 'Present', 101),
(2,  '2026-01-07', 1, 'Present', 101),
(3,  '2026-01-08', 1, 'Present', 101),
(4,  '2026-01-09', 1, 'Absent',  101),
(5,  '2026-01-10', 1, 'Present', 101),
(6,  '2026-01-13', 1, 'Present', 101),
(7,  '2026-01-14', 1, 'Present', 101),
(8,  '2026-01-15', 1, 'Present', 101),
(9,  '2026-01-16', 1, 'Absent',  101),
(10, '2026-01-17', 1, 'Present', 101),
(11, '2026-02-03', 1, 'Present', 101),
(12, '2026-02-04', 1, 'Absent',  101),
(13, '2026-02-05', 1, 'Absent',  101),
(14, '2026-02-06', 1, 'Present', 101),
(15, '2026-02-07', 1, 'Present', 101),
(16, '2026-02-10', 1, 'Present', 101),
(17, '2026-02-11', 1, 'Absent',  101),
(18, '2026-02-12', 1, 'Present', 101),
(19, '2026-03-03', 1, 'Absent',  101),
(20, '2026-03-04', 1, 'Absent',  101),
(21, '2026-03-05', 1, 'Present', 101),
(22, '2026-03-06', 1, 'Present', 101),
(23, '2026-03-09', 1, 'Present', 101),
(24, '2026-03-10', 1, 'Present', 101),
(25, '2026-03-11', 1, 'Present', 101);

-- Student 102: healthy attendance
INSERT INTO Attendance (AttendanceID, AttendanceDate, ClassID, Status, StudentID) VALUES
(26, '2026-01-06', 1, 'Present', 102),
(27, '2026-01-07', 1, 'Present', 102),
(28, '2026-01-08', 1, 'Present', 102),
(29, '2026-01-09', 1, 'Present', 102),
(30, '2026-02-03', 1, 'Present', 102),
(31, '2026-02-04', 1, 'Present', 102);

INSERT INTO Notifications (NotificationID, StudentID, Message) VALUES
(1, 101, 'Warning: Attendance likely below 75%'),
(2, 102, 'Safe: Attendance healthy');

-- Demo login credentials (password: password123):
-- Student: student@university.edu
-- Faculty: faculty@university.edu
-- Admin:   admin@university.edu  (set ADMIN_FACULTY_IDS=2 in .env)
