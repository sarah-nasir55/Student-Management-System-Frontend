import React, { useState } from "react";
import { useEnrollment, useEnrollments } from "../../hooks/useEnrollments";
import { useStudents } from "../../hooks/useStudents";
import { useCourses } from "../../hooks/useCourses";
import { useSemesters } from "../../hooks/useSemesters";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Modal, Button, Table, message, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const validationSchema = Yup.object({
  studentId: Yup.string().required("Student is required"),
  courseId: Yup.string().required("Course is required"),
  semesterId: Yup.string().required("Semester is required"),
});

const Enrollments = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const {
    data: enrollments,
    isLoading: enrollmentsLoading,
    error: enrollmentsError,
  } = useEnrollments();
  const { data: students, isLoading: studentsLoading } = useStudents();
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { data: semesters, isLoading: semestersLoading } = useSemesters();
  const createEnrollment = useEnrollment();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await createEnrollment.mutateAsync(values);
      handleCloseModal();
      messageApi.success("Enrollment created successfully!");
    } catch (error) {
      console.error("Error creating enrollment:", error);
      messageApi.error("Error creating enrollment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const isLoading =
    studentsLoading || coursesLoading || semestersLoading || enrollmentsLoading;

  if (isLoading)
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Loading data...
      </div>
    );
  if (enrollmentsError)
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "red" }}>
        Error loading enrollments: {enrollmentsError.messageApi}
      </div>
    );

  const columns = [
    {
      title: "Student",
      dataIndex: "studentName",
      key: "student",
    },
    {
      title: "Course",
      dataIndex: "courseName",
      key: "course",
    },
    {
      title: "Semester",
      dataIndex: "semesterName",
      key: "semester",
    },
  ];

  const initialValues = {
    studentId: "",
    courseId: "",
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
          Student Enrollments
        </h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenModal}
        >
          Create Enrollment
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={enrollments?.map((e) => ({ ...e, key: e.enrollmentId }))}
        rowKey="enrollmentId"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
      />

      <Modal
        title="Create New Enrollment"
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={500}
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
                  Student *
                </label>
                <Field
                  className="w-full"
                  as={Select}
                  name="studentId"
                  placeholder="Select Student"
                  value={values.studentId || undefined}
                  onChange={(value) => setFieldValue("studentId", value)}
                  status={errors.studentId && touched.studentId ? "error" : ""}
                  options={
                    students?.map((s) => ({
                      value: s.id,
                      label: s.name,
                    })) || []
                  }
                />
                {errors.studentId && touched.studentId && (
                  <div
                    style={{
                      color: "#ff4d4f",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    {errors.studentId}
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
                  Course *
                </label>
                <Field
                  className="w-full"
                  as={Select}
                  name="courseId"
                  placeholder="Select Course"
                  value={values.courseId || undefined}
                  onChange={(value) => setFieldValue("courseId", value)}
                  status={errors.courseId && touched.courseId ? "error" : ""}
                  options={
                    courses?.map((c) => ({
                      value: c.id,
                      label: `${c.name} - ${c.instructor}`,
                    })) || []
                  }
                />
                {errors.courseId && touched.courseId && (
                  <div
                    style={{
                      color: "#ff4d4f",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    {errors.courseId}
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
                  placeholder="Select Semester"
                  value={values.semesterId || undefined}
                  onChange={(value) => setFieldValue("semesterId", value)}
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
                  Create Enrollment
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default Enrollments;
