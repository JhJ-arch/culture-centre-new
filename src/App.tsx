import React, { useState, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User, Role, Course, Student } from './types';
import TeacherPage from './pages/TeacherPage';
import StudentPage from './pages/StudentPage';
import LoginPage from './pages/LoginPage';
import { AppContext } from './contexts/AppContext';
import { MOCK_COURSES, MOCK_STUDENTS } from './constants';

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
                <Routes>
                    <Route path="/login" element={
                        user ? (user.role === Role.Teacher ? <Navigate to="/teacher" /> : <Navigate to="/student" />) : <LoginPage />
                    } />
                    <Route path="/teacher/*" element={user?.role === Role.Teacher ? <TeacherPage /> : <Navigate to="/login" />} />
                    <Route path="/student/*" element={user?.role === Role.Student ? <StudentPage /> : <Navigate to="/login" />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </HashRouter>
        </AppContext.Provider>
    );
};

export default App;