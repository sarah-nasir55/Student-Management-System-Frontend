import React, { useState } from 'react';
import { useSemesters, useCreateSemester, useUpdateSemester, useDeleteSemester } from '../../hooks/useSemesters';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { toast } from 'sonner';

const Semesters = () => {
  const { data: semesters, isLoading, error } = useSemesters();
  const createSemester = useCreateSemester();
  const updateSemester = useUpdateSemester();
  const deleteSemester = useDeleteSemester();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);
  const [formData, setFormData] = useState({ semester: '' });

  const handleOpenModal = (semester = null) => {
    if (semester) {
      setEditingSemester(semester);
      setFormData({ semester: semester.semester || '' });
    } else {
      setEditingSemester(null);
      setFormData({ semester: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSemester(null);
    setFormData({ semester: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSemester) {
        await updateSemester.mutateAsync({ id: editingSemester.id, data: formData });
        toast.success('Semester updated successfully!');
      } else {
        await createSemester.mutateAsync(formData);
        toast.success('Semester created successfully!');
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving semester:', error);
      toast.error('Error saving semester. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this semester? This may affect students and courses.')) {
      try {
        await deleteSemester.mutateAsync(id);
        toast.success('Semester deleted successfully!');
      } catch (error) {
        console.error('Error deleting semester:', error);
        alert('Error deleting semester. Please try again.');
      }
    }
  };

  if (isLoading) return <div className="p-10 text-center text-lg">Loading semesters...</div>;
  if (error) return <div className="p-10 text-center text-lg text-red-500">Error loading semesters: {error.message}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Semesters Management</h1>
        <Button onClick={() => handleOpenModal()}>+ Add Semester</Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Semester</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {semesters && semesters.length > 0 ? (
                semesters.map((semester) => (
                  <tr key={semester.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 text-gray-700">{semester.semester}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenModal(semester)}>
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(semester.id)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="px-4 py-10 text-center text-gray-500 italic">No semesters found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingSemester ? 'Edit Semester' : 'Add New Semester'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Semester Name *</label>
              <input
                type="text"
                value={formData.semester}
                onChange={(e) => setFormData({ semester: e.target.value })}
                placeholder="e.g., First, Second, Third"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit">
                {editingSemester ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Semesters;
