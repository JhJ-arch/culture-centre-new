import React from 'react';
// Fix: Switch from react-router-dom v6 to v5 compatible imports.
import { Switch, Route, Link, useLocation, useHistory, useRouteMatch } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import StudentHome from '../components/student/StudentHome';
import StudentEnrollment from '../components/student/StudentEnrollment';
import StudentCourseList from '../components/student/StudentCourseList';
import StudentCreateCourse from '../components/student/StudentCreateCourse';
import { Home, BookMarked, LayoutList, PlusCircle, LogOut, UserCircle } from 'lucide-react';

const StudentPage: React.FC = () => {
    const { user, setUser } = useAppContext();
    const location = useLocation();
    // Fix: Use useHistory() for v5 compatibility.
    const history = useHistory();
    // Fix: Use useRouteMatch() to get the base path for nested routes in v5.
    const { path } = useRouteMatch();


    const handleLogout = () => {
        setUser(null);
        // Fix: Use history.push for navigation.
        history.push('/login');
    };

    const navItems = [
        { path: '/student/home', icon: Home, label: '홈' },
        { path: '/student/enrollment', icon: BookMarked, label: '수강 현황' },
        { path: '/student/list', icon: LayoutList, label: '개설된 강의' },
        { path: '/student/create', icon: PlusCircle, label: '강의 개설 신청' },
    ];

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <aside className="w-64 bg-white shadow-xl flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                         <div className="bg-teal-500 rounded-full p-2 text-white">
                           <UserCircle size={24}/>
                       </div>
                       <div>
                            <h1 className="text-lg font-bold text-gray-800">{user?.name}님 환영합니다!</h1>
                            <p className="text-sm text-gray-500">오늘도 즐거운 하루!</p>
                       </div>
                    </div>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                                location.pathname.startsWith(item.path)
                                    ? 'bg-teal-100 text-teal-700 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-200">
                     <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg text-gray-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200">
                        <LogOut className="w-5 h-5 mr-3" />
                        로그아웃
                    </button>
                </div>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">
                {/* Fix: Replaced v6 <Routes> with v5 <Switch> and adapted Route syntax. */}
                <Switch>
                    <Route exact path={path} component={StudentHome} />
                    <Route path={`${path}/home`} component={StudentHome} />
                    <Route path={`${path}/enrollment`} component={StudentEnrollment} />
                    <Route path={`${path}/list`} component={StudentCourseList} />
                    <Route path={`${path}/create`} component={StudentCreateCourse} />
                </Switch>
            </main>
        </div>
    );
};

export default StudentPage;
