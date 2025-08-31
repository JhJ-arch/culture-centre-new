import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Student, Role } from '../../types';
import { PlusCircle, Download, Upload, Pencil, Trash2 } from 'lucide-react';
import Modal from '../common/Modal';
import * as XLSX from 'xlsx';

const StudentManagement: React.FC = () => {
    const { students, setStudents } = useAppContext();
    const [newStudent, setNewStudent] = useState({ name: '', username: '', password: '' });

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [editedStudentData, setEditedStudentData] = useState({ name: '', username: '', password: '' });


    const handleAddStudent = (e: React.FormEvent) => {
        e.preventDefault();
        if (newStudent.name && newStudent.username && newStudent.password) {
            const newStudentData: Student = {
                id: `s${Date.now()}`,
                ...newStudent,
                role: Role.Student,
            };
            setStudents([...students, newStudentData]);
            alert(`학생 계정이 생성되었습니다.\n\n이름: ${newStudent.name}\n아이디: ${newStudent.username}\n비밀번호: ${newStudent.password}\n\n이 정보를 학생에게 전달해주세요.`);
            setNewStudent({ name: '', username: '', password: '' });
        }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewStudent(prev => ({ ...prev, [name]: value }));
    };

    const handleDownloadSample = () => {
        const sampleData = [
            ['이름', '아이디', '비밀번호'],
            ['홍길동', 'student5', 'pass123'],
            ['김철수', 'student6', 'pass456']
        ];
        const worksheet = XLSX.utils.aoa_to_sheet(sampleData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, '학생 목록');
        
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "학생_등록_샘플.xlsx");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = event.target?.result;
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json: (string | number)[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                
                const newStudents: Student[] = [];
                // Start from 1 to skip header row
                for (let i = 1; i < json.length; i++) {
                    const row = json[i];
                    if (!row || row.length < 3) continue; // Skip empty/malformed rows

                    const [name, username, password] = row.map(String); // Ensure all are strings
                    if (name && username && password) {
                        newStudents.push({
                            id: `s${Date.now()}${i}`,
                            name: name.trim(),
                            username: username.trim(),
                            password: password.trim(),
                            role: Role.Student,
                        });
                    } else if (row.some(cell => cell)) { // Only throw error for non-empty but malformed lines
                         throw new Error(`잘못된 형식의 데이터가 있습니다 (행 ${i + 1}). 각 행은 이름, 아이디, 비밀번호로 구성되어야 합니다.`);
                    }
                }
                
                if (newStudents.length > 0) {
                    setStudents([...students, ...newStudents]);
                    alert(`${newStudents.length}명의 학생이 성공적으로 추가되었습니다.`);
                } else {
                    alert("엑셀 파일에서 추가할 학생 데이터를 찾을 수 없습니다.");
                }

            } catch (error) {
                if (error instanceof Error) {
                    alert(`파일 처리 중 오류가 발생했습니다: ${error.message}`);
                } else {
                    alert("알 수 없는 오류가 발생했습니다. 파일 형식이 올바른지 확인해주세요.");
                }
            } finally {
                e.target.value = '';
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleDeleteStudent = (studentId: string) => {
        if (window.confirm('정말로 이 학생을 삭제하시겠습니까?')) {
            setStudents(students.filter(s => s.id !== studentId));
        }
    };

    const openEditModal = (student: Student) => {
        setEditingStudent(student);
        setEditedStudentData({ name: student.name, username: student.username, password: '' });
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingStudent(null);
        setEditedStudentData({ name: '', username: '', password: '' });
    };

    const handleUpdateStudent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStudent) return;
        
        const updatedStudents = students.map(s => {
            if (s.id === editingStudent.id) {
                const updatedStudent: Student = {
                    ...s,
                    name: editedStudentData.name,
                    username: editedStudentData.username,
                };
                if (editedStudentData.password) {
                    updatedStudent.password = editedStudentData.password;
                }
                return updatedStudent;
            }
            return s;
        });
        setStudents(updatedStudents);
        closeEditModal();
    };

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedStudentData(prev => ({ ...prev, [name]: value }));
    };


    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">학생 관리</h1>
            <p className="text-gray-500 mb-8">학생 계정을 생성하고 로그인 정보를 공유할 수 있습니다.</p>

            <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">신규 학생 추가</h2>
                <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700">이름</label>
                        <input type="text" name="name" value={newStudent.name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
                    </div>
                     <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700">아이디</label>
                        <input type="text" name="username" value={newStudent.username} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
                    </div>
                     <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700">비밀번호</label>
                        <input type="password" name="password" value={newStudent.password} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
                    </div>
                    <button type="submit" className="md:col-span-1 w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105">
                        <PlusCircle className="w-5 h-5 mr-2" />
                        생성
                    </button>
                </form>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">학생 일괄 등록</h2>
                <div className="bg-indigo-50 border-l-4 border-indigo-500 text-indigo-800 p-4 mb-4 rounded-r-lg" role="alert">
                    <p className="font-bold">업로드 절차 안내</p>
                    <ol className="list-decimal list-inside mt-2 text-sm space-y-1">
                        <li>'샘플 양식 다운로드'를 클릭하여 <strong className="font-semibold">.xlsx</strong> 파일을 받으세요.</li>
                        <li>다운로드한 엑셀 파일에 학생 정보를 입력하고 저장하세요.</li>
                        <li>아래 '엑셀 파일 업로드' 버튼을 눌러 저장한 <strong className="font-semibold">.xls 또는 .xlsx</strong> 파일을 선택하세요.</li>
                    </ol>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <button 
                        onClick={handleDownloadSample} 
                        className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-800 text-sm font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        샘플 양식 다운로드
                    </button>
                    <label 
                        htmlFor="excel-upload" 
                        className="flex items-center justify-center px-4 py-2 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-lg hover:bg-indigo-200 transition-colors cursor-pointer"
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        엑셀 파일 업로드
                        <input id="excel-upload" type="file" accept=".xls, .xlsx" onChange={handleFileUpload} className="hidden" />
                    </label>
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">번호</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">아이디</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">비밀번호</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {students.length > 0 ? (
                            students.map((student, index) => (
                                <tr key={student.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.password}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => openEditModal(student)} className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" title="수정">
                                            <Pencil size={16} />
                                        </button>
                                        <button onClick={() => handleDeleteStudent(student.id)} className="p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ml-2" title="삭제">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-10 px-6 text-gray-500">
                                    생성된 학생이 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {editingStudent && (
                <Modal isOpen={isEditModalOpen} onClose={closeEditModal} title="학생 정보 수정">
                    <form onSubmit={handleUpdateStudent} className="space-y-4">
                        <div>
                            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">이름</label>
                            <input id="edit-name" type="text" name="name" value={editedStudentData.name} onChange={handleEditInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
                        </div>
                        <div>
                            <label htmlFor="edit-username" className="block text-sm font-medium text-gray-700">아이디</label>
                            <input id="edit-username" type="text" name="username" value={editedStudentData.username} onChange={handleEditInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
                        </div>
                        <div>
                            <label htmlFor="edit-password"  className="block text-sm font-medium text-gray-700">새 비밀번호</label>
                            <input id="edit-password" type="password" name="password" value={editedStudentData.password} onChange={handleEditInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="변경할 경우에만 입력" />
                            <p className="text-xs text-gray-500 mt-1">비밀번호를 변경하지 않으려면 이 칸을 비워두세요.</p>
                        </div>
                        <div className="pt-5 flex justify-end space-x-3">
                            <button type="button" onClick={closeEditModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">취소</button>
                            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">저장</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default StudentManagement;