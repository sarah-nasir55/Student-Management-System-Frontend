import React, { useState } from "react";
import { Modal, Button, Table, Space, Input, Popconfirm, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import {
  useSemesters,
  useCreateSemester,
  useUpdateSemester,
  useDeleteSemester,
} from "../../hooks/useSemesters";

const validationSchema = Yup.object({
  semester: Yup.string()
    .required("Semester is required")
    .min(2, "Semester must be at least 2 characters"),
});

const Semesters = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const { data: semesters, isLoading, error } = useSemesters();
  const createSemester = useCreateSemester();
  const updateSemester = useUpdateSemester();
  const deleteSemester = useDeleteSemester();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);

  const handleOpenModal = (semester = null) => {
    setEditingSemester(semester);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSemester(null);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (editingSemester) {
        await updateSemester.mutateAsync({
          id: editingSemester.id,
          data: values,
        });
        messageApi.success("Semester updated successfully!");
      } else {
        await createSemester.mutateAsync(values);
        messageApi.success("Semester created successfully!");
      }
      handleCloseModal();
    } catch (err) {
      console.error("Error saving semester:", err);
      messageApi.error("Error saving semester. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSemester.mutateAsync(id);
      messageApi.success("Semester deleted successfully!");
    } catch (err) {
      console.error("Error deleting semester:", err);
      messageApi.error("Error deleting semester. Please try again.");
    }
  };

  const columns = [
    {
      title: "Semester",
      dataIndex: "semester",
      key: "semester",
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
            title="Delete Semester"
            description="Are you sure you want to delete this semester? This may affect students and courses."
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

  if (isLoading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Loading semesters...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "red" }}>
        Error loading semesters: {error.message}
      </div>
    );
  }

  const initialValues = editingSemester || { semester: "" };

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
          Semesters Management
        </h1>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleOpenModal()}
        >
          Add Semester
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={semesters}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingSemester ? "Edit Semester" : "Add New Semester"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={500}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, isSubmitting, isValid }) => (
            <Form style={{ marginTop: "20px" }}>
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: 500,
                  }}
                >
                  Semester Name *
                </label>

                <Field
                  as={Input}
                  name="semester"
                  placeholder="e.g., First, Second, Third"
                  status={errors.semester && touched.semester ? "error" : ""}
                />

                {errors.semester && touched.semester && (
                  <div
                    style={{
                      color: "#ff4d4f",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    {errors.semester}
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
                  {editingSemester ? "Update" : "Create"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default Semesters;
