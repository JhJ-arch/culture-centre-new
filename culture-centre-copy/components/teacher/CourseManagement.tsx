
import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Course, CourseStatus } from '../../types';
import CourseCard from '../common/CourseCard';
import Modal from '../common/Modal';
import { format } from 'date-fns';
// Fix: Corrected the import path for the 'ko' locale.
import { ko } from 'date-fns/locale/ko';
import { Users, X, Check } from 'lucide-react';
import ApplicantManagementModal from './ApplicantManagementModal';

const CourseRequestDetails: React.FC<{ course: Course, onApprove: () => void, onReject: () => void }> = ({ course, onApprove, onReject }) => {
    return (
        <div>
            <h3 className="text-lg font-bold mb-4">{course.name}</h3>
            <p className="mb-2"><strong>강사:</strong> {course.instructor}</p>
            <p className="mb-2"><strong>날짜:</strong> {format(course.date, 'yyyy-MM-dd', { locale: ko })}</p>
            <p className="mb-2"><strong>장소:</strong> {course.location}</p>
            <p className="mb-4"><strong>준비물:</strong> {course.supplies}</p>

            <div className="mt-6 flex justify-end space-x-3">
                <button onClick={onReject} className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                    <X className="w-4 h-4 mr-2"/> 반려
                </button>
                <button onClick={onApprove} className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    <Check className="w-4 h-4 mr-2"/> 개설 허가
                </button>
            </div>
        </div>
    );
}

const CourseManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState('requests');
    const { courses, setCourses, students } = useAppContext();
    const [selectedRequest, setSelectedRequest] = useState<Course | null>(null);
    const [managingCourse, setManagingCourse] = useState<Course | null>(null);

    const handleApprove = (courseId: string) => {
        setCourses(prev => prev.map(c => {
            if (c.id === courseId && c.creatorId) {
                return { ...c, status: CourseStatus.APPROVED, enrolledStudentIds: [c.creatorId] };
            }
            return c;
        }));
        setSelectedRequest(null);
    };

    const handleReject = (courseId: string) => {
        setCourses(prev => prev.filter(c => c.id !== courseId));
        setSelectedRequest(null);
    };
    
    const handleCancel = (courseId: string) => {
         if(window.confirm("정말로 이 강의를 취소하시겠습니까? 학생들에게서도 강의가 사라집니다.")) {
            setCourses(prev => prev.map(c => c.id === courseId ? { ...c, status: CourseStatus.CANCELLED } : c));
         }
    }

    const handleUpdateCourse = (updatedCourse: Course) => {
        setCourses(prevCourses => prevCourses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
        setManagingCourse(updatedCourse);
    };

    const courseRequests = courses.filter(c => c.status === CourseStatus.REQUESTED);
    const currentCourses = courses.filter(c => c.status === CourseStatus.APPROVED);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">강의 관리</h1>
            <p className="text-gray-500 mb-8">강의 개설 신청을 관리하고 현재 진행중인 강의를 확인할 수 있습니다.</p>
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    onClick={() => setActiveTab('requests')}
                    className={`px-6 py-3 text-sm font-semibold -mb-px border-b-2 transition-colors ${activeTab === 'requests' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    강의 신청 정보 ({courseRequests.length})
                </button>
                <button
                    onClick={() => setActiveTab('current')}
                    className={`px-6 py-3 text-sm font-semibold -mb-px border-b-2 transition-colors ${activeTab === 'current' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    현재 진행 강의 ({currentCourses.length})
                </button>
            </div>

            {activeTab === 'requests' && (
                <div>
                    {courseRequests.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courseRequests.map(course => {
                           const creator = students.find(s => s.id === course.creatorId);
                           return (
                            <CourseCard key={course.id} course={course}>
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-500">
                                        <p>신청자: {creator?.name || '알 수 없음'}</p>
                                        <p>희망 인원: {course.applicants.length}명</p>
                                    </div>
                                    <button onClick={() => setSelectedRequest(course)} className="px-4 py-2 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors">
                                        상세보기
                                    </button>
                                </div>
                            </CourseCard>
                        )})}
                    </div>
                     ) : (
                        <div className="text-center py-20 bg-white rounded-lg shadow">
                            <h2 className="text-xl font-semibold text-gray-700">새로운 강의 신청이 없습니다.</h2>
                        </div>
                    )}
                </div>
            )}
            
            {activeTab === 'current' && (
                 <div>
                    {currentCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {currentCourses.map(course => (
                            <CourseCard key={course.id} course={course} onClick={() => setManagingCourse(course)}>
                                 <div className="flex justify-between items-center">
                                    <div className="flex items-center text-sm font-medium text-gray-700">
                                        <Users className="w-4 h-4 mr-2 text-indigo-500"/>
                                        <span>수강: {course.enrolledStudentIds.length}명 / 신청: {course.applicants.filter(id => !course.enrolledStudentIds.includes(id)).length}명</span>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); handleCancel(course.id); }} className="px-4 py-2 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200 transition-colors">
                                        개설 취소
                                    </button>
                                </div>
                            </CourseCard>
                        ))}
                    </div>
                     ) : (
                        <div className="text-center py-20 bg-white rounded-lg shadow">
                            <h2 className="text-xl font-semibold text-gray-700">진행중인 강의가 없습니다.</h2>
                            <p className="text-gray-500 mt-2">'강의 신청 정보' 탭에서 강의를 승인해주세요.</p>
                        </div>
                    )}
                </div>
            )}

            {selectedRequest && (
                <Modal isOpen={!!selectedRequest} onClose={() => setSelectedRequest(null)} title="강의 개설 신청 정보">
                    <CourseRequestDetails 
                        course={selectedRequest} 
                        onApprove={() => handleApprove(selectedRequest.id)}
                        onReject={() => handleReject(selectedRequest.id)}
                    />
                </Modal>
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

export default CourseManagement;