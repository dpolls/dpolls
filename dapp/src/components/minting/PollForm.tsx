import React, { useState } from 'react';
import { Button, Form, Input, InputNumber, Select, Space } from 'antd';
import { useGasPrice } from '../../context/GasPriceContext';
import './AdvancedSettings.css';
import { PollState } from '../../types/poll';

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

interface PollFormProps {
  pollForm: PollState;
  onFormChange: (form: PollState) => void;
}

/**
 * Component for advanced settings like gas multiplier
 */
const PollForm: React.FC<PollFormProps> = ({
  pollForm,
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

  const onUpdateOption = (value: any, index: number) => {
    options[index] = value;
    pollForm.options = options;
    onFormChange(pollForm);
  }

  const onReset = () => {
    form.resetFields();
  };

  const onFill = (value: any) => {
    form.setFieldsValue(value);
    pollForm = { ...pollForm, ...value };
    onFormChange(pollForm);
  };

  return (
    <Form
      {...layout}
      form={form}
      name="control-hooks"
      style={{ maxWidth: 600 }}
    >
      <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
        <Input onChange={(e) => onFill({subject: e.target.value})}/>
      </Form.Item>
      <Form.Item name="duration" label="Duration" rules={[{ required: true }]}>
        <InputNumber onChange={(value) => onFill({duration: value})}/>
      </Form.Item>
      <Form.Item name="rewardPerResponse" label="Reward Per Response" rules={[{ required: true }]}>
        <InputNumber onChange={(value) => onFill({rewardPerResponse: value})}/>
      </Form.Item>
      <Form.Item name="maxResponses" label="Max Responses" rules={[{ required: true }]}>
        <InputNumber onChange={(value) => onFill({maxResponses: value})}/>
      </Form.Item>
      {options.map((option, index) => (
        <Form.Item key={index} name={`option${index}`} label={`Option ${index + 1}`} rules={[{ required: true }]}>
          <Input onChange={(e) => onUpdateOption(e.target.value, index)} />
        </Form.Item>
      ))}
      <Form.Item {...tailLayout}>
        <Space>
          <Button type="primary" onClick={onAddOption}>
            Add Option
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default PollForm; 