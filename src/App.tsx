import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
// Fix: Switch from react-router-dom v6 components to v5 compatible ones.
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { User, Role, Course, Student, SchoolInfo, AppState } from './types';
import TeacherPage from './pages/TeacherPage';
import StudentPage from './pages/StudentPage';
import LoginPage from './pages/LoginPage';
import { AppContext } from './contexts/AppContext';
import { useAppContext } from './hooks/useAppContext';
import { listenToStateChanges, saveState } from './firebase/databaseService';
// Fix: The 'Unsubscribe' type is not exported in this manner in Firebase v8.
// import { Unsubscribe } from 'firebase/database';
import { MOCK_COURSES, MOCK_STUDENTS } from './constants';

const AppRouter: React.FC = () => {
    const { user, isLoading, schoolInfo } = useAppContext();

    if (isLoading && !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <p className="text-lg font-semibold text-gray-700">데이터를 불러오는 중...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            // Fix: Replaced v6 <Routes> with v5 <Switch> and adapted Route syntax.
            <Switch>
                <Route path="/login" component={LoginPage} />
                <Redirect to="/login" />
            </Switch>
        );
    }

    const homePath = user.role === Role.Teacher ? '/teacher' : '/student';

    return (
        // Fix: Replaced v6 <Routes> with v5 <Switch> and adapted Route syntax.
        <Switch>
            <Route path="/login">
                <Redirect to={homePath} />
            </Route>

            {user.role === Role.Teacher && (
                <Route path="/teacher" component={TeacherPage} />
            )}

            {user.role === Role.Student && (
                <Route path="/student" component={StudentPage} />
            )}
            
            <Redirect to={homePath} />
        </Switch>
    );
};

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [courses, setCoursesState] = useState<Course[]>([]);
    const [students, setStudentsState] = useState<Student[]>([]);
    const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const stateRef = useRef({ students, courses });
    useEffect(() => {
        stateRef.current = { students, courses };
    }, [students, courses]);


    useEffect(() => {
        // Fix: Replaced Firebase v9 'Unsubscribe' type with a v8 compatible function type.
        let unsubscribe: (() => void) | null = null;

        if (schoolInfo) {
            setIsLoading(true);
            unsubscribe = listenToStateChanges(schoolInfo.school, schoolInfo.grade, (state) => {
                if (state) {
                    setStudentsState(state.students || []);
                    setCoursesState(state.courses || []);
                } else {
                    // If no data exists in firebase for this school/grade, initialize with mocks
                    const initialState: AppState = {
                        students: MOCK_STUDENTS,
                        courses: MOCK_COURSES,
                        schoolInfo: schoolInfo,
                    }
                    saveState(schoolInfo.school, schoolInfo.grade, initialState);
                    setStudentsState(initialState.students);
                    setCoursesState(initialState.courses);
                }
                setIsLoading(false);
            });
        } else {
            // Reset state when logged out
            setStudentsState([]);
            setCoursesState([]);
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [schoolInfo]);
    
    const setStudents = useCallback((newStudents: Student[]) => {
        if (schoolInfo) {
            const currentState: AppState = { students: newStudents, courses: stateRef.current.courses, schoolInfo };
            saveState(schoolInfo.school, schoolInfo.grade, currentState);
        }
    }, [schoolInfo]);

    const setCourses = useCallback((newCourses: Course[]) => {
        if (schoolInfo) {
            const currentState: AppState = { students: stateRef.current.students, courses: newCourses, schoolInfo };
            saveState(schoolInfo.school, schoolInfo.grade, currentState);
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
        setSchoolInfo,
        isLoading
    }), [user, courses, students, schoolInfo, isLoading, setCourses, setStudents]);

    return (
        <AppContext.Provider value={contextValue}>
            <HashRouter>
                <AppRouter />
            </HashRouter>
        </AppContext.Provider>
    );
};

export default App;
