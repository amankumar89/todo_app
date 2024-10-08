import { FC, useEffect } from "react";
import {
  Form,
  Modal,
  Input,
  DatePicker,
  Button,
  Flex,
  Divider,
  Select,
  message,
} from "antd";
import dayjs from "dayjs";
import { DataProps, TodoModalProps } from "../types";

const CATEGORY_LISTS = [
  { value: "Work", label: "Work" },
  { value: "Personal", label: "Personal" },
  { value: "Fitness", label: "Fitness" },
  { value: "Household", label: "Household" },
  { value: "Social", label: "Social" },
  { value: "Finance", label: "Finance" },
  { value: "Budgeting", label: "Budgeting" },
  { value: "Hobbies", label: "Hobbies" },
  { value: "Self Care", label: "Self Care" },
  { value: "Errands", label: "Errands" },
  { value: "Shopping", label: "Shopping" },
  { value: "Travel", label: "Travel" },
  { value: "Planning", label: "Planning" },
  { value: "Learning", label: "Learning" },
  { value: "Health", label: "Health" },
  { value: "Other", label: "Other" },
];

const INITIAL_VALUES: DataProps = {
  id: null,
  title: "",
  description: "",
  date: "",
  category: "",
  isCompleted: false,
};

const TodoModal: FC<TodoModalProps> = ({
  open,
  data,
  onSave,
  ...restProps
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && data && Object.keys(data)?.length) {
      form.setFieldsValue({
        ...INITIAL_VALUES,
        ...(data ?? {}),
        date: data?.date ? dayjs(data?.date) : "",
      });
    } else {
      form.resetFields();
    }
  }, [open, data, form]);

  const onFinish = (values: DataProps) => {
    onSave({
      ...values,
      isCompleted: false,
      id: data?.id ?? null,
    });
  };

  const onFinishFailed = () => {
    message.error("Please fill required fields!");
  };

  return (
    <Modal open={open} centered title="Add Task" footer={null} {...restProps}>
      <Form
        form={form}
        name="task-form"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={INITIAL_VALUES}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[
            {
              required: true,
              message: "Please fill task title!",
            },
          ]}
        >
          <Input placeholder="Enter the task title..." />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: true,
              message: "Please fill task description!",
            },
          ]}
        >
          <Input.TextArea placeholder="Enter the task decription..." />
        </Form.Item>
        <Form.Item
          label="Category"
          name="category"
          rules={[
            {
              required: true,
              message: "Please select task category!",
            },
          ]}
        >
          <Select
            allowClear
            placeholder="Select Task Category"
            options={CATEGORY_LISTS}
          />
        </Form.Item>
        <Form.Item
          label="Date"
          name="date"
          rules={[
            {
              required: true,
              message: "Please select a task date!",
            },
          ]}
        >
          <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
        </Form.Item>
        <Divider />
        <Flex gap={8} justify="flex-end" align="center">
          <Button type="text" htmlType="reset">
            Reset
          </Button>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};

export default TodoModal;
