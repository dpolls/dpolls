import React, { useState } from 'react';
import { Button, Form, Input, Select, Space } from 'antd';
import { useGasPrice } from '../../context/GasPriceContext';
import './AdvancedSettings.css';

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

interface PollFormProps {
  gasMultiplier: number;
  onFormChange: (form: object) => void;
}

/**
 * Component for advanced settings like gas multiplier
 */
const PollForm: React.FC<PollFormProps> = ({
  gasMultiplier,
  onFormChange
}) => {
  const [form] = Form.useForm();

  const [options, setOptions] = useState<string[]>([]);


  const onGenderChange = (value: string) => {
    switch (value) {
      case 'male':
        form.setFieldsValue({ note: 'Hi, man!' });
        break;
      case 'female':
        form.setFieldsValue({ note: 'Hi, lady!' });
        break;
      case 'other':
        form.setFieldsValue({ note: 'Hi there!' });
        break;
      default:
    }
  };

  const onAddOption = () => {
    setOptions([...options, `Option ${options.length + 1}`]);
  }

  const onFinish = (values: any) => {
    console.log(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFill = () => {
    form.setFieldsValue({ note: 'Hello world!', gender: 'male' });
  };

  return (
    <Form
      {...layout}
      form={form}
      name="control-hooks"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
    >
      <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      {options.map((option, index) => (
        <Form.Item key={index} name={`option${index}`} label={`Option ${index + 1}`} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      ))}
      <Form.Item {...tailLayout}>
        <Space>
          <Button type="primary" onClick={onAddOption}>
            Add Option
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
          <Button type="link" htmlType="button" onClick={onFill}>
            Fill form
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default PollForm; 