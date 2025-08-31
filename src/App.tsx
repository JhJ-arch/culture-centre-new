import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User, Role, Course, Student } from './types';
import TeacherPage from './pages/TeacherPage';
import StudentPage from './pages/StudentPage';
import LoginPage from './pages/LoginPage';
import { AppContext } from './contexts/AppContext';
import { MOCK_COURSES, MOCK_STUDENTS } from './constants';
import { useAppContext } from './hooks/useAppContext';

const getInitialState = <T,>(key: string, defaultValue: T): T => {
    try {
        const saved = localStorage.getItem(key);
        if (!saved) return defaultValue;

        const parsed = JSON.parse(saved);

        if (key === 'courses' && Array.isArray(parsed)) {
            return (parsed as any[]).map(course => ({
                ...course,
                date: new Date(course.date), // Rehydrate date string to Date object
            })) as T;
        }

        return parsed;
    } catch (error) {
        console.error(`Error reading from localStorage for key "${key}":`, error);
        return defaultValue;
    }
};

const AppRouter: React.FC = () => {
    const { user } = useAppContext();

    if (!user) {
        return (
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        );
    }

    const homePath = user.role === Role.Teacher ? '/teacher' : '/student';

    return (
        <Routes>
            <Route path="/login" element={<Navigate to={homePath} replace />} />

            {user.role === Role.Teacher && (
                <Route path="/teacher/*" element={<TeacherPage />} />
            )}

            {user.role === Role.Student && (
                <Route path="/student/*" element={<StudentPage />} />
            )}
            
            <Route path="*" element={<Navigate to={homePath} replace />} />
        </Routes>
    );
};

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [courses, setCourses] = useState<Course[]>(() => getInitialState('courses', MOCK_COURSES));
    const [students, setStudents] = useState<Student[]>(() => getInitialState('students', MOCK_STUDENTS));
    const [schoolInfo, setSchoolInfo] = useState<{ school: string, grade: string } | null>(() => getInitialState('schoolInfo', null));

    useEffect(() => {
        try {
            localStorage.setItem('students', JSON.stringify(students));
        } catch (error) {
            console.error('Error saving students to localStorage:', error);
        }
    }, [students]);

    useEffect(() => {
        try {
            localStorage.setItem('courses', JSON.stringify(courses));
        } catch (error) {
            console.error('Error saving courses to localStorage:', error);
        }
    }, [courses]);

    useEffect(() => {
        try {
            if (schoolInfo) {
                localStorage.setItem('schoolInfo', JSON.stringify(schoolInfo));
            } else {
                localStorage.removeItem('schoolInfo');
            }
        } catch (error) {
            console.error('Error handling schoolInfo in localStorage:', error);
        }
    }, [schoolInfo]);


    const contextValue = useMemo(() => ({
        user,
        setUser,
        courses,
        setCourses,
        students,
        setStudents,
        schoolInfo,
        setSchoolInfo
    }), [user, courses, students, schoolInfo]);

    return (
        <AppContext.Provider value={contextValue}>
            <HashRouter>
                <AppRouter />
            </HashRouter>
        </AppContext.Provider>
    );
};

export default App;