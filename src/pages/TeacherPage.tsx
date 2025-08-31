import React from 'react';
// Cleaned up imports for react-router-dom v6
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import CourseStatusDashboard from '../components/teacher/CourseStatusDashboard';
import CourseManagement from '../components/teacher/CourseManagement';
import StudentManagement from '../components/teacher/StudentManagement';
import { Home, ListChecks, Users, BookOpenCheck, LogOut } from 'lucide-react';

const TeacherPage: React.FC = () => {
    const { schoolInfo, setUser, setSchoolInfo } = useAppContext();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        setUser(null);
        setSchoolInfo(null);
        navigate('/login');
    };

    const navItems = [
        { path: '/teacher/status', icon: Home, label: '강의 현황' },
        { path: '/teacher/management', icon: ListChecks, label: '강의 관리' },
        { path: '/teacher/students', icon: Users, label: '학생 관리' },
    ];

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <aside className="w-64 bg-white shadow-xl flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                       <div className="bg-indigo-600 rounded-full p-2 text-white">
                           <BookOpenCheck size={24}/>
                       </div>
                       <div>
                            <h1 className="text-lg font-bold text-gray-800">{schoolInfo?.school}</h1>
                            <p className="text-sm text-gray-500">{schoolInfo?.grade}</p>
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
                                    ? 'bg-indigo-100 text-indigo-700 shadow-sm'
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
                    <Route exact path={path} component={CourseStatusDashboard} />
                    <Route path={`${path}/status`} component={CourseStatusDashboard} />
                    <Route path={`${path}/management`} component={CourseManagement} />
                    <Route path={`${path}/students`} component={StudentManagement} />
                </Switch>
            </main>
        </div>
    );
};

export default TeacherPage;
