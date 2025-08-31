export enum Role {
    Teacher,
    Student
}

export interface User {
    id: string;
    name: string;
    role: Role;
}

export interface Student extends User {
    username: string;
    password?: string; // Password should not be stored in frontend state long-term
    role: Role.Student;
}

export interface Teacher extends User {
    role: Role.Teacher;
}

export enum CourseStatus {
    REQUESTED = 'requested',
    APPROVED = 'approved',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

export interface Course {
    id: string;
    name: string;
    instructor: string;
    date: Date;
    location: string;
    supplies: string;
    imageUrl: string;
    status: CourseStatus;
    creatorId?: string; // Student ID who requested it
    enrolledStudentIds: string[];
    applicants: string[];
}
