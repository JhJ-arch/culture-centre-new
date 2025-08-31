
import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
// Fix: Removed unused 'parseISO' import to resolve error.
import { isToday, isFuture, differenceInDays } from 'date-fns';
import { CourseStatus } from '../../types';
import CourseCard from '../common/CourseCard';
// Fix: Replaced non-existent 'ClipboardUser' icon with 'Clipboard'.
import { Info, Calendar, Clock, Star, Clipboard } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentHome: React.FC = () => {
    const { user, courses } = useAppContext();

    if (!user) return null;

    const myEnrolledCourses = courses.filter(c => c.enrolledStudentIds.includes(user.id) && c.status === CourseStatus.APPROVED);
    const myAppliedCourses = courses.filter(c => c.applicants.includes(user.id) && c.status === CourseStatus.APPROVED && !c.enrolledStudentIds.includes(user.id));
    
    const todaysCourse = myEnrolledCourses.find(c => isToday(c.date));
    const upcomingCourses = myEnrolledCourses
        .filter(c => isFuture(c.date) && differenceInDays(c.date, new Date()) <= 7)
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .slice(0, 3);
    
    const availableCourses = courses.filter(c => c.status === CourseStatus.APPROVED && !c.enrolledStudentIds.includes(user.id));
    const recommendedCourse = availableCourses.length > 0 ? availableCourses[Math.floor(Math.random() * availableCourses.length)] : null;

    const coursesToLead = myEnrolledCourses.filter(c => 
        c.creatorId === user.id && 
        (isFuture(c.date) || isToday(c.date))
    );

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">안녕하세요, {user.name}님!</h1>
                <p className="text-gray-500">오늘도 문화센터에서 즐거운 시간을 보내세요.</p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4"><Info className="mr-2 text-teal-500"/> 나의 정보</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-teal-50 rounded-lg">
                        <h3 className="font-semibold text-teal-800">수강 중인 강의</h3>
                        <p className="text-2xl font-bold text-teal-600">{myEnrolledCourses.length}개</p>
                    </div>
                     <div className="p-4 bg-orange-50 rounded-lg">
                        <h3 className="font-semibold text-orange-800">신청한 강의 (승인 대기)</h3>
                        <p className="text-2xl font-bold text-orange-600">{myAppliedCourses.length}개</p>
                    </div>
                </div>
            </div>

            <section>
                {/* Fix: Replaced non-existent 'ClipboardUser' icon with 'Clipboard'. */}
                <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4"><Clipboard className="mr-2 text-teal-500"/> 내가 진행할 강의</h2>
                 {coursesToLead.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {coursesToLead.map(course => <CourseCard key={course.id} course={course} />)}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-white rounded-lg shadow">
                         <h3 className="text-lg font-semibold text-gray-700">직접 개설하여 진행할 강의가 없습니다.</h3>
                    </div>
                )}
            </section>

            <section>
                <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4"><Calendar className="mr-2 text-teal-500"/> 오늘 수강할 강의</h2>
                {todaysCourse ? (
                     <CourseCard course={todaysCourse} />
                ) : (
                    <div className="text-center py-10 bg-white rounded-lg shadow">
                         <h3 className="text-lg font-semibold text-gray-700">오늘은 예정된 강의가 없습니다.</h3>
                    </div>
                )}
            </section>
            
            <section>
                <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4"><Clock className="mr-2 text-teal-500"/> 예정된 강의 (7일 이내)</h2>
                {upcomingCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {upcomingCourses.map(course => <CourseCard key={course.id} course={course} />)}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-white rounded-lg shadow">
                         <h3 className="text-lg font-semibold text-gray-700">예정된 강의가 없습니다.</h3>
                         <p className="text-gray-500 mt-2">새로운 강의를 신청해보세요!</p>
                    </div>
                )}
            </section>

             <section>
                <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4"><Star className="mr-2 text-teal-500"/> 추천 강의</h2>
                {recommendedCourse ? (
                    <CourseCard course={recommendedCourse}>
                         <Link to="/student/list" className="block w-full text-center mt-2 px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors">
                            강의 목록 보러가기
                        </Link>
                    </CourseCard>
                ) : (
                     <div className="text-center py-10 bg-white rounded-lg shadow">
                         <h3 className="text-lg font-semibold text-gray-700">추천할만한 강의가 없습니다.</h3>
                    </div>
                )}
            </section>

        </div>
    );
};

export default StudentHome;