import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { CourseStatus } from '../../types';

const StudentCreateCourse: React.FC = () => {
    const { user, setCourses } = useAppContext();
    const [courseName, setCourseName] = useState('');
    const [instructor, setInstructor] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [supplies, setSupplies] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (user) {
            setInstructor(user.name);
        }
    }, [user]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        
        const newCourse = {
            id: `c${Date.now()}`,
            name: courseName,
            instructor,
            date: new Date(date + 'T00:00:00'), // Use T00:00:00 to set time to midnight in local timezone
            location,
            supplies,
            imageUrl: preview || 'https://picsum.photos/400/300',
            status: CourseStatus.REQUESTED,
            creatorId: user.id,
            enrolledStudentIds: [],
            applicants: [user.id],
        };
        setCourses(prev => [...prev, newCourse]);
        setIsSubmitted(true);
        // Reset form
        setCourseName('');
        setDate('');
        setLocation('');
        setSupplies('');
        setImage(null);
        setPreview(null);
    };

    if (isSubmitted) {
        return (
            <div className="text-center py-20 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-teal-600">강의 개설 신청 완료!</h2>
                <p className="text-gray-600 mt-4">선생님께서 확인 후 승인해주실 거예요.</p>
                <button onClick={() => setIsSubmitted(false)} className="mt-8 px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
                    다른 강의 또 신청하기
                </button>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">강의 개설 신청</h1>
            <p className="text-gray-500 mb-8">듣고 싶은 강의가 있다면 직접 개설을 신청해보세요!</p>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">강의명</label>
                        <input type="text" value={courseName} onChange={e => setCourseName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">강사</label>
                        <input type="text" value={instructor} readOnly className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 bg-gray-100" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">수강 날짜</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">장소</label>
                        <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">강의 준비물</label>
                        <input type="text" value={supplies} onChange={e => setSupplies(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">강의 이미지</label>
                        <div className="mt-1 flex items-center space-x-6">
                           <div className="shrink-0">
                                {preview ? <img className="h-16 w-16 object-cover rounded-md" src={preview} alt="Current profile photo" /> : <div className="h-16 w-16 bg-gray-200 rounded-md"></div>}
                           </div>
                           <label className="block">
                                <span className="sr-only">Choose profile photo</span>
                                <input type="file" onChange={handleImageChange} accept="image/*" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100" />
                           </label>
                        </div>
                    </div>
                </div>
                <div className="pt-5">
                    <div className="flex justify-end">
                        <button type="submit" className="w-full md:w-auto bg-teal-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-transform transform hover:scale-105">
                           신청하기
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default StudentCreateCourse;
