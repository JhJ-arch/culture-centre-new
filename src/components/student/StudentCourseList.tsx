import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { CourseStatus } from '../../types';
import CourseCard from '../common/CourseCard';
import { differenceInDays, isPast, isToday } from 'date-fns';
import Modal from '../common/Modal';

const StudentCourseList: React.FC = () => {
    const { user, courses, setCourses } = useAppContext();
    const [showPopup, setShowPopup] = useState(false);

    if (!user) return null;

    const handleApply = (courseId: string) => {
        setCourses(prevCourses => 
            prevCourses.map(course => {
                if (course.id === courseId && !course.applicants.includes(user.id)) {
                    return { ...course, applicants: [...course.applicants, user.id] };
                }
                return course;
            })
        );
        setShowPopup(true);
    };

    const availableCourses = courses
        .filter(c => c.status === CourseStatus.APPROVED && differenceInDays(new Date(), c.date) < 5)
        .sort((a, b) => a.date.getTime() - b.date.getTime());

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">개설된 강의 목록</h1>
            <p className="text-gray-500 mb-8">관심 있는 강의에 수강을 신청해보세요. 종료된 지 5일이 지난 강의는 보이지 않습니다.</p>

            {availableCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {availableCourses.map(course => {
                        const isApplied = course.applicants.includes(user.id);
                        const isEnrolled = course.enrolledStudentIds.includes(user.id);
                        const isCompleted = isPast(course.date) && !isToday(course.date);
                        const isInProgress = isToday(course.date);

                        return (
                            <CourseCard key={course.id} course={course} isGrayscale={isCompleted}>
                                <div className="mt-4">
                                    {isEnrolled ? (
                                        <button disabled className="w-full px-4 py-2 bg-green-200 text-green-800 font-semibold rounded-lg cursor-not-allowed">
                                            {isInProgress ? '진행 중인 강의' : '수강 중'}
                                        </button>
                                    ) : isApplied ? (
                                        <button disabled className="w-full px-4 py-2 bg-yellow-200 text-yellow-800 font-semibold rounded-lg cursor-not-allowed">신청 완료 (승인 대기)</button>
                                    ) : isCompleted ? (
                                        <button disabled className="w-full px-4 py-2 bg-gray-200 text-gray-500 font-semibold rounded-lg cursor-not-allowed">강의 종료</button>
                                    ) : (
                                        <button onClick={() => handleApply(course.id)} className="w-full px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors">수강 신청</button>
                                    )}
                                </div>
                            </CourseCard>
                        );
                    })}
                </div>
            ) : (
                 <div className="text-center py-20 bg-white rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-gray-700">신청 가능한 강의가 없습니다.</h2>
                </div>
            )}
            
            <Modal isOpen={showPopup} onClose={() => setShowPopup(false)} title="신청 완료">
                <div className="text-center">
                    <p className="text-lg text-gray-700">수강 신청이 완료되었습니다.</p>
                    <p className="text-gray-500 mt-2">선생님의 승인을 기다려주세요.</p>
                    <button onClick={() => setShowPopup(false)} className="mt-6 px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600">확인</button>
                </div>
            </Modal>
        </div>
    );
};

export default StudentCourseList;
