import React, { useState } from 'react';
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from '../../hooks/useCourses';
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

const Courses = () => {
  const { data: courses, isLoading, error } = useCourses();
  const { data: semesters } = useSemesters();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    instructor: '',
    creditHours: '',
    semesterId: '',
  });

  const handleOpenModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        name: course.name || '',
        instructor: course.instructor || '',
        creditHours: course.creditHours?.toString() || '',
        semesterId: course.semesterId || '',
      });
    } else {
      setEditingCourse(null);
      setFormData({
        name: '',
        instructor: '',
        creditHours: '',
        semesterId: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
    setFormData({
      name: '',
      instructor: '',
      creditHours: '',
      semesterId: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        creditHours: parseInt(formData.creditHours),
      };

      if (editingCourse) {
        await updateCourse.mutateAsync({ id: editingCourse.id, data });
        toast.success('Course updated successfully!');
      } else {
        await createCourse.mutateAsync(data);
        toast.success('Course created successfully!');
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error('Error saving course. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse.mutateAsync(id);
        toast.success('Course deleted successfully!');
      } catch (error) {
        console.error('Error deleting course:', error);
        toast.error('Error deleting course. Please try again.');
      }
    }
  };

  if (isLoading) return <div className="p-10 text-center text-lg">Loading courses...</div>;
  if (error) return <div className="p-10 text-center text-lg text-red-500">Error loading courses: {error.message}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Courses Management</h1>
        <Button onClick={() => handleOpenModal()}>+ Add Course</Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Instructor</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Credit Hours</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Semester</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses && courses.length > 0 ? (
                courses.map((course) => {
                  const semester = semesters?.find(s => s.id === course.semesterId);
                  return (
                    <tr key={course.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-gray-700">{course.name}</td>
                      <td className="px-4 py-4 text-gray-700">{course.instructor}</td>
                      <td className="px-4 py-4 text-gray-700">{course.creditHours}</td>
                      <td className="px-4 py-4 text-gray-700">{semester?.semester || 'N/A'}</td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleOpenModal(course)}>
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(course.id)}>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-10 text-center text-gray-500 italic">No courses found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Course Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Instructor *</label>
              <input
                type="text"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Credit Hours *</label>
              <input
                type="number"
                min="1"
                value={formData.creditHours}
                onChange={(e) => setFormData({ ...formData, creditHours: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
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
                {editingCourse ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Courses;
