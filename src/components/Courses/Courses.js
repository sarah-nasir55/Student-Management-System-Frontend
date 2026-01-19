import React, { useState } from "react";
import {
  useCourses,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
} from "../../hooks/useCourses";
import { useSemesters } from "../../hooks/useSemesters";
import { Formik, Form, Field } from "formik";
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
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Course name is required")
    .min(2, "Name must be at least 2 characters"),
  instructor: Yup.string()
    .required("Instructor is required")
    .min(2, "Instructor name must be at least 2 characters"),
  creditHours: Yup.number()
    .required("Credit hours is required")
    .min(1, "Credit hours must be at least 1")
    .max(10, "Credit hours must be less than 10"),
  semesterId: Yup.string().required("Semester is required"),
});

const Courses = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { data: courses, isLoading, error } = useCourses();
  const { data: semesters } = useSemesters();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const handleOpenModal = (course = null) => {
    setEditingCourse(course || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const data = {
        ...values,
        creditHours: parseInt(values.creditHours),
      };

      if (editingCourse) {
        await updateCourse.mutateAsync({ id: editingCourse.id, data });
        messageApi.success("Course updated successfully!");
      } else {
        await createCourse.mutateAsync(data);
        messageApi.success("Course created successfully!");
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving course:", error);
      messageApi.error("Error saving course. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCourse.mutateAsync(id);
      messageApi.success("Course deleted successfully!");
    } catch (error) {
      console.error("Error deleting course:", error);
      messageApi.error("Error deleting course. Please try again.");
    }
  };

  if (isLoading)
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Loading courses...
      </div>
    );
  if (error)
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "red" }}>
        Error loading courses: {error.messageApi}
      </div>
    );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Instructor",
      dataIndex: "instructor",
      key: "instructor",
    },
    {
      title: "Credit Hours",
      dataIndex: "creditHours",
      key: "creditHours",
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
            title="Delete Course"
            description="Are you sure you want to delete this course?"
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

  const initialValues = editingCourse || {
    name: "",
    instructor: "",
    creditHours: "",
    semesterId: "",
  };

  return (
    <div style={{ padding: "24px" }}>
      {contextHolder}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
          Courses Management
        </h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleOpenModal()}
        >
          Add Course
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={courses}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title={editingCourse ? "Edit Course" : "Add New Course"}
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
          {({
            values,
            errors,
            touched,
            isSubmitting,
            isValid,
            setFieldValue,
          }) => (
            <Form style={{ marginTop: "20px" }}>
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: 500,
                  }}
                >
                  Course Name *
                </label>
                <Field
                  as={Input}
                  name="name"
                  placeholder="Enter course name"
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
                  Instructor *
                </label>
                <Field
                  as={Input}
                  name="instructor"
                  placeholder="Enter instructor name"
                  status={
                    errors.instructor && touched.instructor ? "error" : ""
                  }
                />
                {errors.instructor && touched.instructor && (
                  <div
                    style={{
                      color: "#ff4d4f",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    {errors.instructor}
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
                  Credit Hours *
                </label>
                <Field
                  as={Input}
                  name="creditHours"
                  type="number"
                  min="1"
                  max="10"
                  placeholder="Enter credit hours"
                  status={
                    errors.creditHours && touched.creditHours ? "error" : ""
                  }
                />
                {errors.creditHours && touched.creditHours && (
                  <div
                    style={{
                      color: "#ff4d4f",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    {errors.creditHours}
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
                <Field
                  className="w-full"
                  as={Select}
                  name="semesterId"
                  value={values.semesterId || undefined}
                  onChange={(value) => {
                    setFieldValue("semesterId", value);
                  }}
                  placeholder="Select Semester"
                  status={
                    errors.semesterId && touched.semesterId ? "error" : ""
                  }
                  options={
                    semesters?.map((s) => ({
                      value: s.id,
                      label: s.semester,
                    })) || []
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
                  {editingCourse ? "Update" : "Create"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default Courses;
