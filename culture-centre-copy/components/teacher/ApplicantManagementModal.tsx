

import React, { useMemo } from 'react';
// Fix: Corrected import path to point to types file in 'src' directory.
import { Course, Student } from '../../src/types';
import { Users, X, Check, UserPlus } from 'lucide-react';

const ApplicantManagementModal: React.FC<{
    course: Course;
    students: Student[];
    onClose: () => void;
    onUpdateCourse: (updatedCourse: Course) => void;
}> = ({ course, students, onClose, onUpdateCourse }) => {
    const enrolledStudents = useMemo(() => students.filter(s => course.enrolledStudentIds.includes(s.id)), [students, course.enrolledStudentIds]);
    const applicantStudents = useMemo(() => students.filter(s => course.applicants.includes(s.id) && !course.enrolledStudentIds.includes(s.id)), [students, course.applicants, course.enrolledStudentIds]);

    const handleApproveApplicant = (studentId: string) => {
        const updatedCourse = {
            ...course,
            enrolledStudentIds: [...course.enrolledStudentIds, studentId],
        };
        onUpdateCourse(updatedCourse);
    };

    const handleRejectApplicant = (studentId: string) => {
        const updatedCourse = {
            ...course,
            applicants: course.applicants.filter(id => id !== studentId),
        };
        onUpdateCourse(updatedCourse);
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><UserPlus className="mr-2 text-indigo-500"/>수강 희망 학생 ({applicantStudents.length}명)</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto bg-gray-50 p-3 rounded-lg">
                        {applicantStudents.length > 0 ? applicantStudents.map(student => (
                            <div key={student.id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                                <span>{student.name}</span>
                                <div className="space-x-2">
                                    <button onClick={() => handleApproveApplicant(student.id)} className="p-1 text-green-600 hover:bg-green-100 rounded-full"><Check size={18}/></button>
                                    <button onClick={() => handleRejectApplicant(student.id)} className="p-1 text-red-600 hover:bg-red-100 rounded-full"><X size={18}/></button>
                                </div>
                            </div>
                        )) : <p className="text-gray-500 text-sm">수강 희망 학생이 없습니다.</p>}
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><Users className="mr-2 text-indigo-500"/>현재 수강 학생 ({enrolledStudents.length}명)</h3>
                     <div className="space-y-2 max-h-60 overflow-y-auto bg-gray-50 p-3 rounded-lg">
                        {enrolledStudents.length > 0 ? enrolledStudents.map(student => (
                             <div key={student.id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                                <span>{student.name}</span>
                            </div>
                        )): <p className="text-gray-500 text-sm">수강 중인 학생이 없습니다.</p>}
                    </div>
                </div>
            </div>
            <div className="mt-8 flex justify-end">
                <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">닫기</button>
            </div>
        </div>
    );
};

export default ApplicantManagementModal;