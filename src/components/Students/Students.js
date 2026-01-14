import React, { useState } from "react";
import {
  useStudents,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
} from "../../hooks/useStudents";
import { useSemesters } from "../../hooks/useSemesters";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import {
  Modal,
  Button,
  Table,
  Space,
  message,
  Select,
  Input,
  Popconfirm,
  Tag,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  semesterId: Yup.string().required("Semester is required"),
  phoneNumbers: Yup.array().of(
    Yup.object({
      phone: Yup.string()
        .matches(/^[0-9\-\+\s\(\)]*$/, "Invalid phone number format")
        .required("Phone number is required"),
    })
  ),
  addresses: Yup.array().of(
    Yup.object({
      address: Yup.string().required("Address is required"),
    })
  ),
});

const Students = () => {
  const { data: students, isLoading, error } = useStudents();
  const { data: semesters } = useSemesters();
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const handleOpenModal = (student = null) => {
    setEditingStudent(student || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const data = {
        name: values.name,
        semesterId: values.semesterId,
        phoneNumbers: values.phoneNumbers.filter((p) => p.phone.trim() !== ""),
        addresses: values.addresses.filter((a) => a.address.trim() !== ""),
      };

      if (editingStudent) {
        await updateStudent.mutateAsync({ id: editingStudent.id, data });
        message.success("Student updated successfully!");
      } else {
        await createStudent.mutateAsync(data);
        message.success("Student created successfully!");
      }
      handleCloseModal();
    } catch (error) {
      message.error("Error saving student. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStudent.mutateAsync(id);
      message.success("Student deleted successfully!");
    } catch (error) {
      message.error("Error deleting student. Please try again.");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Semester",
      dataIndex: "semesterId",
      key: "semester",
      render: (semesterId) => {
        const semester = semesters?.find((s) => s.id === semesterId);
        return semester?.semester || "N/A";
      },
    },
    {
      title: "Phone Numbers",
      dataIndex: "phoneNumbers",
      key: "phoneNumbers",
      render: (phoneNumbers) => (
        <>
          {phoneNumbers?.map((p, i) => (
            <Tag key={i} color="blue">
              {p.phone}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Addresses",
      dataIndex: "addresses",
      key: "addresses",
      render: (addresses) => (
        <>
          {addresses?.map((a, i) => (
            <Tag key={i} color="green">
              {a.address}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Student"
            description="Are you sure you want to delete this student?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isLoading)
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Loading students...
      </div>
    );
  if (error)
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "red" }}>
        Error loading students: {error.message}
      </div>
    );

  const initialValues = editingStudent || {
    name: "",
    semesterId: "",
    phoneNumbers: [{ phone: "" }],
    addresses: [{ address: "" }],
  };

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
          Students Management
        </h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleOpenModal()}
        >
          Add Student
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={students}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title={editingStudent ? "Edit Student" : "Add New Student"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ values, errors, touched, isSubmitting, isValid, setFieldValue  }) => (
            <Form style={{ marginTop: "20px" }}>
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: 500,
                  }}
                >
                  Name *
                </label>
                <Field
                  as={Input}
                  name="name"
                  placeholder="Enter student name"
                  status={errors.name && touched.name ? "error" : ""}
                />
                {errors.name && touched.name && (
                  <div
                    style={{
                      color: "#ff4d4f",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    {errors.name}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: 500,
                  }}
                >
                  Semester *
                </label>

                <Select
                  style={{ width: "100%" }}
                  placeholder="Select Semester"
                  value={values.semesterId || undefined}
                  onChange={(value) => {
                    setFieldValue("semesterId", value);
                  }}
                  options={
                    semesters?.map((s) => ({
                      value: String(s.id),
                      label: s.semester,
                    })) || []
                  }
                  status={
                    errors.semesterId && touched.semesterId ? "error" : ""
                  }
                />

                {errors.semesterId && touched.semesterId && (
                  <div
                    style={{
                      color: "#ff4d4f",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    {errors.semesterId}
                  </div>
                )}
              </div>

              <FieldArray name="phoneNumbers">
                {({ push, remove }) => (
                  <div style={{ marginBottom: "16px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: 500,
                      }}
                    >
                      Phone Numbers *
                    </label>
                    {values.phoneNumbers.map((phone, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          gap: "8px",
                          marginBottom: "8px",
                        }}
                      >
                        <Field
                          as={Input}
                          name={`phoneNumbers.${index}.phone`}
                          placeholder="Phone number"
                          status={
                            errors.phoneNumbers?.[index]?.phone &&
                            touched.phoneNumbers?.[index]?.phone
                              ? "error"
                              : ""
                          }
                        />
                        {values.phoneNumbers.length > 1 && (
                          <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => remove(index)}
                          />
                        )}
                      </div>
                    ))}
                    <Button
                      type="dashed"
                      onClick={() => push({ phone: "" })}
                      style={{ width: "100%" }}
                    >
                      + Add Phone Number
                    </Button>
                  </div>
                )}
              </FieldArray>

              <FieldArray name="addresses">
                {({ push, remove }) => (
                  <div style={{ marginBottom: "16px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: 500,
                      }}
                    >
                      Addresses *
                    </label>
                    {values.addresses.map((address, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          gap: "8px",
                          marginBottom: "8px",
                        }}
                      >
                        <Field
                          as={Input}
                          name={`addresses.${index}.address`}
                          placeholder="Address"
                          status={
                            errors.addresses?.[index]?.address &&
                            touched.addresses?.[index]?.address
                              ? "error"
                              : ""
                          }
                        />
                        {values.addresses.length > 1 && (
                          <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => remove(index)}
                          />
                        )}
                      </div>
                    ))}
                    <Button
                      type="dashed"
                      onClick={() => push({ address: "" })}
                      style={{ width: "100%" }}
                    >
                      + Add Address
                    </Button>
                  </div>
                )}
              </FieldArray>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                }}
              >
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                  disabled={!isValid || isSubmitting}
                >
                  {editingStudent ? "Update" : "Create"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default Students;
