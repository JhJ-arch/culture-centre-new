import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Course, CourseStatus } from '../../types';
import CourseCard from '../common/CourseCard';
import Modal from '../common/Modal';
import ApplicantManagementModal from './ApplicantManagementModal';
import { Users } from 'lucide-react';

const CourseStatusDashboard: React.FC = () => {
    const { courses, setCourses, students } = useAppContext();
    const [managingCourse, setManagingCourse] = useState<Course | null>(null);

    const approvedCourses = courses.filter(c => c.status === CourseStatus.APPROVED);

    const handleUpdateCourse = (updatedCourse: Course) => {
        // Fix: The `setCourses` function expects a `Course[]` array, not a function.
        // We now correctly map over the existing `courses` array to create the updated list.
        setCourses(courses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
        setManagingCourse(updatedCourse);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">강의 현황</h1>
            <p className="text-gray-500 mb-8">현재 개설된 강의 목록입니다. 카드를 클릭하여 수강생을 관리하세요.</p>
            
            {approvedCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {approvedCourses.map(course => (
                        <CourseCard key={course.id} course={course} onClick={() => setManagingCourse(course)}>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center text-sm font-medium text-gray-700">
                                    <Users className="w-4 h-4 mr-2 text-indigo-500"/>
                                    <span>수강: {course.enrolledStudentIds.length}명 / 신청: {course.applicants.filter(id => !course.enrolledStudentIds.includes(id)).length}명</span>
                                </div>
                            </div>
                        </CourseCard>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-gray-700">개설된 강의가 없습니다.</h2>
                    <p className="text-gray-500 mt-2">'강의 관리' 탭에서 학생들의 신청을 승인해주세요.</p>
                </div>
            )}

            {managingCourse && (
                 <Modal isOpen={!!managingCourse} onClose={() => setManagingCourse(null)} title={`'${managingCourse.name}' 수강생 관리`}>
                    <ApplicantManagementModal
                        course={managingCourse}
                        students={students}
                        onClose={() => setManagingCourse(null)}
                        onUpdateCourse={handleUpdateCourse}
                    />
                </Modal>
            )}
        </div>
    );
};

export default CourseStatusDashboard;