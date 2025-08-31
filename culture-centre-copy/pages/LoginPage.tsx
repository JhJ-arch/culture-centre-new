
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { Role } from '../types';

const LoginPage: React.FC = () => {
    const [isTeacherLogin, setIsTeacherLogin] = useState(false);
    const { setUser, students, setSchoolInfo } = useAppContext();
    const navigate = useNavigate();

    const [school, setSchool] = useState('');
    const [grade, setGrade] = useState('');
    const [teacherPassword, setTeacherPassword] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const handleTeacherLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (school && grade && teacherPassword === 'ansghktpsxjekd') {
            setUser({ id: 'teacher1', name: '선생님', role: Role.Teacher });
            setSchoolInfo({ school, grade });
            navigate('/teacher');
        } else {
            setError('학교, 반, 비밀번호를 정확히 입력해주세요.');
        }
    };

    const handleStudentLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const student = students.find(s => s.username === username && s.password === password);
        if (student) {
            setUser(student);
            navigate('/student');
        } else {
            setError('아이디 또는 비밀번호가 일치하지 않습니다.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white shadow-2xl rounded-2xl p-8">
                    <div className="flex justify-center mb-6">
                        <button
                            onClick={() => setIsTeacherLogin(true)}
                            className={`px-6 py-2 rounded-l-full text-sm font-semibold transition-colors duration-300 ${isTeacherLogin ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            교사 로그인
                        </button>
                        <button
                            onClick={() => setIsTeacherLogin(false)}
                            className={`px-6 py-2 rounded-r-full text-sm font-semibold transition-colors duration-300 ${!isTeacherLogin ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            학생 로그인
                        </button>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">반가워요!</h1>
                        <p className="text-gray-500">문화센터에 오신 것을 환영합니다.</p>
                    </div>

                    {isTeacherLogin ? (
                        <form onSubmit={handleTeacherLogin} className="space-y-6">
                            <div>
                                <label htmlFor="school" className="block text-sm font-medium text-gray-700">학교</label>
                                <input
                                    id="school"
                                    type="text"
                                    value={school}
                                    onChange={(e) => setSchool(e.target.value)}
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="예: 행복초등학교"
                                />
                            </div>
                            <div>
                                <label htmlFor="grade" className="block text-sm font-medium text-gray-700">반</label>
                                <input
                                    id="grade"
                                    type="text"
                                    value={grade}
                                    onChange={(e) => setGrade(e.target.value)}
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="예: 3학년 1반"
                                />
                            </div>
                            <div>
                                <label htmlFor="teacher-password"  className="block text-sm font-medium text-gray-700">비밀번호</label>
                                <input
                                    id="teacher-password"
                                    type="password"
                                    value={teacherPassword}
                                    onChange={(e) => setTeacherPassword(e.target.value)}
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="비밀번호를 입력하세요"
                                />
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105">
                                페이지 생성
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleStudentLogin} className="space-y-6">
                             <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">아이디</label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="아이디를 입력하세요"
                                />
                            </div>
                            <div>
                                <label htmlFor="password"  className="block text-sm font-medium text-gray-700">비밀번호</label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="비밀번호를 입력하세요"
                                />
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105">
                                로그인
                            </button>
                        </form>
                    )}
                    {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;