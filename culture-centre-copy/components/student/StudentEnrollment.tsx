
import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import CourseCard from '../common/CourseCard';
import { Course, CourseStatus } from '../../types';
import { isPast, isToday } from 'date-fns';
import Modal from '../common/Modal';
import CourseDetailsModal from '../common/CourseDetailsModal';


const StudentEnrollment: React.FC = () => {
    const { user, courses, students } = useAppContext();
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);


    if (!user) return null;

    const enrolledCourses = courses.filter(c => 
        c.enrolledStudentIds.includes(user.id) &&
        (c.status === CourseStatus.APPROVED || c.status === CourseStatus.COMPLETED)
    ).sort((a,b) => b.date.getTime() - a.date.getTime());

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">수강 현황</h1>
            <p className="text-gray-500 mb-8">내가 수강 중이거나 완료한 강의 목록입니다.</p>

            {enrolledCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {enrolledCourses.map(course => {
                        const isCompleted = isPast(course.date) && !isToday(course.date);
                        return <CourseCard key={course.id} course={course} isGrayscale={isCompleted} onClick={() => setSelectedCourse(course)} />;
                    })}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-gray-700">수강 중인 강의가 없습니다.</h2>
                    <p className="text-gray-500 mt-2">'개설된 강의' 탭에서 듣고 싶은 강의를 신청해보세요.</p>
                </div>
            )}

            {selectedCourse && (
                <Modal isOpen={!!selectedCourse} onClose={() => setSelectedCourse(null)} title={selectedCourse.name}>
                    <CourseDetailsModal course={selectedCourse} students={students} onClose={() => setSelectedCourse(null)} />
                </Modal>
            )}
        </div>
    );
};

export default StudentEnrollment;