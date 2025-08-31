
import React from 'react';
import { Course, Student } from '../../types';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale/ko';
import { Users, Calendar, MapPin, Package, List } from 'lucide-react';

const CourseDetailsModal: React.FC<{ course: Course, students: Student[], onClose: () => void }> = ({ course, students, onClose }) => {
    const enrolledStudents = students.filter(s => course.enrolledStudentIds.includes(s.id));
    
    return (
        <div>
            <img src={course.imageUrl} alt={course.name} className="w-full h-64 object-cover rounded-lg mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 mt-1 text-indigo-500"/>
                    <div>
                        <p className="font-semibold">강사</p>
                        <p>{course.instructor}</p>
                    </div>
                </div>
                <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 mt-1 text-indigo-500"/>
                    <div>
                        <p className="font-semibold">수강 날짜</p>
                        <p>{format(course.date, 'yyyy년 M월 d일 (eee)', { locale: ko })}</p>
                    </div>
                </div>
                <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 mt-1 text-indigo-500"/>
                    <div>
                        <p className="font-semibold">장소</p>
                        <p>{course.location}</p>
                    </div>
                </div>
                 <div className="flex items-start space-x-3">
                    <Package className="w-5 h-5 mt-1 text-indigo-500"/>
                    <div>
                        <p className="font-semibold">준비물</p>
                        <p>{course.supplies}</p>
                    </div>
                </div>
            </div>
            <div className="mt-8">
                <div className="flex items-center space-x-3 mb-4">
                    <List className="w-5 h-5 text-indigo-500"/>
                    <h4 className="text-lg font-bold text-gray-800">수강 학생 목록 ({enrolledStudents.length}명)</h4>
                </div>
                {enrolledStudents.length > 0 ? (
                    <ul className="space-y-2 bg-gray-50 p-4 rounded-lg">
                        {enrolledStudents.map(student => (
                            <li key={student.id} className="text-gray-700">{student.name}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 bg-gray-50 p-4 rounded-lg">수강 신청한 학생이 없습니다.</p>
                )}
            </div>
             <div className="mt-8 flex justify-end">
                <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">닫기</button>
            </div>
        </div>
    );
};

export default CourseDetailsModal;
