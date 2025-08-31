
import React, { createContext } from 'react';
import { User, Course, Student } from '../types';

interface AppContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    courses: Course[];
    setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
    students: Student[];
    setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
    schoolInfo: { school: string; grade: string } | null;
    setSchoolInfo: React.Dispatch<React.SetStateAction<{ school: string; grade: string } | null>>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
