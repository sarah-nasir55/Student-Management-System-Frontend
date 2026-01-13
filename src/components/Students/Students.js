import React, { useState } from 'react';
import { useStudents, useCreateStudent, useUpdateStudent, useDeleteStudent } from '../../hooks/useStudents';
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

const Students = () => {
  const { data: students, isLoading, error } = useStudents();
  const { data: semesters } = useSemesters();
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    semesterId: '',
    phoneNumbers: [{ phone: '' }],
    addresses: [{ address: '' }],
  });

  const handleOpenModal = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        name: student.name || '',
        semesterId: student.semesterId || '',
        phoneNumbers: student.phoneNumbers?.length > 0 
          ? student.phoneNumbers 
          : [{ phone: '' }],
        addresses: student.addresses?.length > 0 
          ? student.addresses 
          : [{ address: '' }],
      });
    } else {
      setEditingStudent(null);
      setFormData({
        name: '',
        semesterId: '',
        phoneNumbers: [{ phone: '' }],
        addresses: [{ address: '' }],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
    setFormData({
      name: '',
      semesterId: '',
      phoneNumbers: [{ phone: '' }],
      addresses: [{ address: '' }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name: formData.name,
        semesterId: formData.semesterId,
        phoneNumbers: formData.phoneNumbers.filter(p => p.phone.trim() !== ''),
        addresses: formData.addresses.filter(a => a.address.trim() !== ''),
      };

      if (editingStudent) {
        await updateStudent.mutateAsync({ id: editingStudent.id, data });
        toast.success('Student updated successfully!');
      } else {
        await createStudent.mutateAsync(data);
        toast.success('Student created successfully!');
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving student:', error);
      toast.error('Error saving student. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent.mutateAsync(id);
        toast.success('Student deleted successfully!');
      } catch (error) {
        console.error('Error deleting student:', error);
        toast.error('Error deleting student. Please try again.');
      }
    }
  };

  const addPhoneNumber = () => {
    setFormData({
      ...formData,
      phoneNumbers: [...formData.phoneNumbers, { phone: '' }],
    });
  };

  const removePhoneNumber = (index) => {
    setFormData({
      ...formData,
      phoneNumbers: formData.phoneNumbers.filter((_, i) => i !== index),
    });
  };

  const updatePhoneNumber = (index, value) => {
    const newPhoneNumbers = [...formData.phoneNumbers];
    newPhoneNumbers[index].phone = value;
    setFormData({ ...formData, phoneNumbers: newPhoneNumbers });
  };

  const addAddress = () => {
    setFormData({
      ...formData,
      addresses: [...formData.addresses, { address: '' }],
    });
  };

  const removeAddress = (index) => {
    setFormData({
      ...formData,
      addresses: formData.addresses.filter((_, i) => i !== index),
    });
  };

  const updateAddress = (index, value) => {
    const newAddresses = [...formData.addresses];
    newAddresses[index].address = value;
    setFormData({ ...formData, addresses: newAddresses });
  };

  if (isLoading) return <div className="p-10 text-center text-lg">Loading students...</div>;
  if (error) return <div className="p-10 text-center text-lg text-red-500">Error loading students: {error.message}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Students Management</h1>
        <Button onClick={() => handleOpenModal()}>+ Add Student</Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Semester</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Phone Numbers</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Addresses</th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students && students.length > 0 ? (
                students.map((student) => {
                  const semester = semesters?.find(s => s.id === student.semesterId);
                  return (
                    <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-gray-700">{student.name}</td>
                      <td className="px-4 py-4 text-gray-700">{semester?.semester || 'N/A'}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          {student.phoneNumbers?.map((p, i) => (
                            <span key={i} className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-medium">
                              {p.phone}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          {student.addresses?.map((a, i) => (
                            <span key={i} className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-medium">
                              {a.address}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleOpenModal(student)}>
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(student.id)}>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-10 text-center text-gray-500 italic">No students found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingStudent ? 'Edit Student' : 'Add New Student'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone Numbers *</label>
              {formData.phoneNumbers.map((phone, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={phone.phone}
                    onChange={(e) => updatePhoneNumber(index, e.target.value)}
                    placeholder="Phone number"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {formData.phoneNumbers.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removePhoneNumber(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addPhoneNumber}>
                + Add Phone Number
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Addresses *</label>
              {formData.addresses.map((address, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={address.address}
                    onChange={(e) => updateAddress(index, e.target.value)}
                    placeholder="Address"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {formData.addresses.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeAddress(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addAddress}>
                + Add Address
              </Button>
            </div>

            <DialogFooter>
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit">
                {editingStudent ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
