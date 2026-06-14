-- Demo seed data for SmartAtSys (run AFTER schema.sql on empty tables)
-- Re-run safe: delete existing demo rows first if re-seeding

DELETE FROM Notifications;
DELETE FROM Attendance;
DELETE FROM Classes;
DELETE FROM Students;
DELETE FROM Faculty;

INSERT INTO Faculty (FacultyID, FacultyName, Department) VALUES
(1, 'Dr. Smith', 'Computer Science');

INSERT INTO Students (StudentID, StudentName, RollNo, Department, YearOfStudy) VALUES
(101, 'John Doe', 'CS2024001', 'Computer Science', 2),
(102, 'Jane Smith', 'CS2024002', 'Computer Science', 2);

INSERT INTO Classes (ClassID, FacultyID, SubjectName) VALUES
(1, 1, 'Data Structures');

-- Student 101: declining attendance pattern (good for AI risk demo)
INSERT INTO Attendance (AttendanceID, AttendanceDate, ClassID, Status, StudentID) VALUES
(1,  '2026-01-06', 1, 'Present', 101),
(2,  '2026-01-07', 1, 'Present', 101),
(3,  '2026-01-08', 1, 'Present', 101),
(4,  '2026-01-09', 1, 'Absent',  101),
(5,  '2026-01-10', 1, 'Present', 101),
(6,  '2026-02-03', 1, 'Present', 101),
(7,  '2026-02-04', 1, 'Absent',  101),
(8,  '2026-02-05', 1, 'Absent',  101),
(9,  '2026-02-06', 1, 'Present', 101),
(10, '2026-03-03', 1, 'Absent',  101),
(11, '2026-03-04', 1, 'Absent',  101),
(12, '2026-03-05', 1, 'Absent',  101);

-- Student 102: healthy attendance
INSERT INTO Attendance (AttendanceID, AttendanceDate, ClassID, Status, StudentID) VALUES
(13, '2026-01-06', 1, 'Present', 102),
(14, '2026-01-07', 1, 'Present', 102),
(15, '2026-01-08', 1, 'Present', 102),
(16, '2026-01-09', 1, 'Present', 102),
(17, '2026-02-03', 1, 'Present', 102),
(18, '2026-02-04', 1, 'Present', 102);

INSERT INTO Notifications (NotificationID, StudentID, Message) VALUES
(1, 101, 'Warning: Attendance likely below 75%'),
(2, 102, 'Safe: Attendance healthy');

-- Demo login credentials for frontend / Postman:
-- Student:  { "role": "student", "rollNo": "CS2024001" }  -> StudentID 101
-- Student:  { "role": "student", "rollNo": "CS2024002" }  -> StudentID 102
-- Faculty:  { "role": "faculty", "facultyId": 1 }
-- Admin:    { "role": "admin", "facultyId": 1 }  (requires ADMIN_FACULTY_IDS=1 in .env)
