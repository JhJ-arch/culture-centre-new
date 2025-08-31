import React, { createContext } from 'react';
import { User, Course, Student, SchoolInfo } from '../types';

interface AppContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    courses: Course[];
    setCourses: (courses: Course[]) => void;
    students: Student[];
    setStudents: (students: Student[]) => void;
    schoolInfo: SchoolInfo | null;
    setSchoolInfo: React.Dispatch<React.SetStateAction<SchoolInfo | null>>;
    isLoading: boolean;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);