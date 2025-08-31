import React from 'react';
import { Course } from '../../types';
import { format } from 'date-fns';
// Fix: Corrected the import path for the 'ko' locale.
import { ko } from 'date-fns/locale/ko';
import { User, Calendar, MapPin } from 'lucide-react';

interface CourseCardProps {
    course: Course;
    onClick?: () => void;
    children?: React.ReactNode;
    isGrayscale?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick, children, isGrayscale = false }) => {
    return (
        <div
            className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:transform hover:-translate-y-1 ${onClick ? 'cursor-pointer' : ''} ${isGrayscale ? 'filter grayscale' : ''}`}
            onClick={onClick}
        >
            <img className="w-full h-40 object-cover" src={course.imageUrl} alt={course.name} />
            <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 truncate">{course.name}</h3>
                <div className="mt-3 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-indigo-500" />
                        <span>{course.instructor}</span>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                        <span>{format(course.date, 'yyyy년 M월 d일 (eee)', { locale: ko })}</span>
                    </div>
                    <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                        <span>{course.location}</span>
                    </div>
                </div>
                 {children && <div className="mt-4 pt-4 border-t border-gray-200">{children}</div>}
            </div>
        </div>
    );
};

export default CourseCard;