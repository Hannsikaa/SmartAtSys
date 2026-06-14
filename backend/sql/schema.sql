-- Schema from DB team (syntax fixed; recommended keys/indexes added for backend use)

CREATE TABLE Students (
    StudentID INT PRIMARY KEY,
    StudentName VARCHAR(50) NOT NULL,
    RollNo VARCHAR(20) NOT NULL,
    Department VARCHAR(30) NOT NULL,
    YearOfStudy INT NOT NULL
);

CREATE TABLE Faculty (
    FacultyID INT PRIMARY KEY,
    FacultyName VARCHAR(50) NOT NULL,
    Department VARCHAR(30) NOT NULL
);

CREATE TABLE Classes (
    ClassID INT PRIMARY KEY,
    FacultyID INT NOT NULL,
    SubjectName VARCHAR(50) NOT NULL,
    CONSTRAINT FK_Classes_Faculty FOREIGN KEY (FacultyID) REFERENCES Faculty(FacultyID)
);

CREATE TABLE Attendance (
    AttendanceID INT PRIMARY KEY,
    AttendanceDate DATE NOT NULL,
    ClassID INT NOT NULL,
    Status VARCHAR(10) NOT NULL,
    StudentID INT NOT NULL,
    CONSTRAINT FK_Attendance_Students FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
    CONSTRAINT FK_Attendance_Classes FOREIGN KEY (ClassID) REFERENCES Classes(ClassID)
);

CREATE TABLE Notifications (
    NotificationID INT PRIMARY KEY,
    StudentID INT NOT NULL,
    Message VARCHAR(255) NOT NULL,
    CONSTRAINT FK_Notifications_Students FOREIGN KEY (StudentID) REFERENCES Students(StudentID)
);

CREATE INDEX IX_Attendance_Student_Date ON Attendance (StudentID, AttendanceDate);
CREATE INDEX IX_Notifications_Student ON Notifications (StudentID, NotificationID DESC);
