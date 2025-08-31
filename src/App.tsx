import React, { useState, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User, Role, Course, Student } from './types';
import TeacherPage from './pages/TeacherPage';
import StudentPage from './pages/StudentPage';
import LoginPage from './pages/LoginPage';
import { AppContext } from './contexts/AppContext';
import { MOCK_COURSES, MOCK_STUDENTS } from './constants';
import { useAppContext } from './hooks/useAppContext';

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
    const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
    const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
    const [schoolInfo, setSchoolInfo] = useState<{ school: string, grade: string } | null>(null);

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