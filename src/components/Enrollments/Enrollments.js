import React, { useState } from 'react';
import { useEnrollment, useEnrollments } from '../../hooks/useEnrollments';
import { useStudents } from '../../hooks/useStudents';
import { useCourses } from '../../hooks/useCourses';
import { useSemesters } from '../../hooks/useSemesters';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { toast } from 'sonner';

const Enrollments = () => {
  const { data: enrollments, isLoading: enrollmentsLoading, error: enrollmentsError } = useEnrollments();
  const { data: students, isLoading: studentsLoading } = useStudents();
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { data: semesters, isLoading: semestersLoading } = useSemesters();
  const createEnrollment = useEnrollment();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    courseId: '',
    semesterId: '',
  });

  const handleOpenModal = () => {
    setFormData({
      studentId: '',
      courseId: '',
      semesterId: '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      studentId: '',
      courseId: '',
      semesterId: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEnrollment.mutateAsync(formData);
      handleCloseModal();
      toast.success('Enrollment created successfully!');
    } catch (error) {
      console.error('Error creating enrollment:', error);
      toast.error('Error creating enrollment. Please try again.');
    }
  };

  const isLoading = studentsLoading || coursesLoading || semestersLoading || enrollmentsLoading;

  if (isLoading) return <div className="p-10 text-center text-lg">Loading data...</div>;
  if (enrollmentsError) return <div className="p-10 text-center text-lg text-red-500">Error loading enrollments: {enrollmentsError.message}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Student Enrollments</h1>
        <Button onClick={handleOpenModal}>+ Create Enrollment</Button>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-8 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-semibold mb-3">Enrollment Information</h2>
       <p className="opacity-95">Select a student, course, and semester to create a new enrollment.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Student</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Course</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Semester</th>
              </tr>
            </thead>
            <tbody>
              {enrollments && enrollments.length > 0 ? (
                enrollments.map((enrollment) => (
                  <tr
                    key={enrollment.enrollmentId}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4 text-gray-700 font-medium">{enrollment.studentName}</td>
                    <td className="px-4 py-4 text-gray-700">{enrollment.courseName}</td>
                    <td className="px-4 py-4 text-gray-700">{enrollment.semesterName}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-4 py-10 text-center text-gray-500 italic">
                    No enrollments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Enrollment</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Student *</label>
              <select
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select Student</option>
                {students?.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Course *</label>
              <select
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select Course</option>
                {courses?.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} - {course.instructor}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Semester *</label>
              <select
                value={formData.semesterId}
                onChange={(e) => setFormData({ ...formData, semesterId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select Semester</option>
                {semesters?.map((semester) => (
                  <option key={semester.id} value={semester.id}>
                    {semester.semester}
                  </option>
                ))}
              </select>
            </div>

            <DialogFooter>
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit">
                Create Enrollment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Enrollments;
