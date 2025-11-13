import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, InputNumber, Radio, Alert, Space, Typography, Divider } from "antd";
import { Icon } from "@iconify/react";

const { Text, Title } = Typography;
const { Option } = Select;

const GoalCreateModal = ({ visible, onCancel, onSubmit, loading, currentWeight }) => {
  const [form] = Form.useForm();
  const [goalCalculation, setGoalCalculation] = useState(null);
  const [hasWarnings, setHasWarnings] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

  useEffect(() => {
    if (visible && currentWeight) {
      form.setFieldsValue({ currentWeight });
    }
  }, [visible, currentWeight, form]);

  const calculateGoal = () => {
    const values = form.getFieldsValue();
    const { targetWeight, duration, durationType } = values;
    const startWeight = currentWeight || values.currentWeight;

    if (!startWeight || !targetWeight || !duration) {
      setGoalCalculation(null);
      return;
    }

    let durationWeeks = duration;
    if (durationType === 'months') {
      durationWeeks = duration * 4;
    }

    const totalWeightChange = targetWeight - startWeight;
    const weeklyWeightChange = totalWeightChange / durationWeeks;
    const absWeeklyChange = Math.abs(weeklyWeightChange);

    let goalType = 'maintain';
    let goalTypeText = 'Duy trì cân nặng';
    let goalIcon = 'mdi:target';
    let goalColor = '#1890ff';

    if (totalWeightChange < -0.1) {
      goalType = 'weight_loss';
      goalTypeText = 'Giảm cân';
      goalIcon = 'mdi:arrow-down-bold';
      goalColor = '#52c41a';
    } else if (totalWeightChange > 0.1) {
      goalType = 'weight_gain';
      goalTypeText = 'Tăng cân';
      goalIcon = 'mdi:arrow-up-bold';
      goalColor = '#f5222d';
    }

    const dailyCalorieAdjustment = Math.round((weeklyWeightChange * 7700) / 7);

    const warnings = [];
    const errors = [];

    if (goalType === 'weight_loss') {
      if (absWeeklyChange > 1) {
        errors.push({
          type: 'error',
          message: `Mục tiêu giảm ${absWeeklyChange.toFixed(1)}kg/tuần là quá nhanh và không an toàn cho sức khỏe. Tốc độ giảm cân tối đa khuyến nghị là 1kg/tuần. Giảm cân quá nhanh có thể gây mất cơ, suy dinh dưỡng, rụng tóc, và các vấn đề sức khỏe nghiêm trọng khác.`
        });
      } else if (absWeeklyChange > 0.8) {
        warnings.push({
          type: 'warning',
          message: `Mục tiêu giảm ${absWeeklyChange.toFixed(1)}kg/tuần hơi cao. Tốc độ giảm cân an toàn khuyến nghị là 0.5-0.8kg/tuần để bảo vệ sức khỏe và duy trì cơ bắp.`
        });
      }

      const minSafeDuration = Math.ceil(Math.abs(totalWeightChange) / 1);
      if (durationWeeks < minSafeDuration) {
        errors.push({
          type: 'error',
          message: `Để giảm ${Math.abs(totalWeightChange).toFixed(1)}kg một cách an toàn, bạn cần ít nhất ${minSafeDuration} tuần (khoảng ${Math.ceil(minSafeDuration / 4)} tháng).`
        });
      }
    }

    if (goalType === 'weight_gain') {
      if (absWeeklyChange > 0.5) {
        errors.push({
          type: 'error',
          message: `Mục tiêu tăng ${absWeeklyChange.toFixed(1)}kg/tuần là quá nhanh. Tốc độ tăng cân tối đa khuyến nghị là 0.5kg/tuần để tăng cơ thay vì mỡ. Tăng cân quá nhanh thường dẫn đến tích tụ mỡ thừa và các vấn đề sức khỏe.`
        });
      } else if (absWeeklyChange > 0.4) {
        warnings.push({
          type: 'warning',
          message: `Mục tiêu tăng ${absWeeklyChange.toFixed(1)}kg/tuần hơi cao. Tốc độ tăng cân an toàn khuyến nghị là 0.25-0.4kg/tuần để tăng cơ bắp, không phải mỡ.`
        });
      }

      const minSafeDuration = Math.ceil(Math.abs(totalWeightChange) / 0.5);
      if (durationWeeks < minSafeDuration) {
        errors.push({
          type: 'error',
          message: `Để tăng ${Math.abs(totalWeightChange).toFixed(1)}kg một cách lành mạnh, bạn cần ít nhất ${minSafeDuration} tuần (khoảng ${Math.ceil(minSafeDuration / 4)} tháng).`
        });
      }
    }

    if (targetWeight < 30) {
      errors.push({
        type: 'error',
        message: 'Cân nặng mục tiêu không hợp lệ. Vui lòng kiểm tra lại.'
      });
    }

    setHasWarnings(warnings.length > 0);
    setHasErrors(errors.length > 0);

    setGoalCalculation({
      goalType,
      goalTypeText,
      goalIcon,
      goalColor,
      totalWeightChange,
      weeklyWeightChange,
      absWeeklyChange,
      dailyCalorieAdjustment,
      durationWeeks,
      warnings,
      errors
    });
  };

  const handleValuesChange = () => {
    calculateGoal();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (hasErrors) {
        return;
      }

      await onSubmit(values);
      form.resetFields();
      setGoalCalculation(null);
    } catch (error) {
      console.error('Form validation error:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setGoalCalculation(null);
    onCancel();
  };

  return (
    <Modal
      title={
        <Space>
          <Icon icon="mdi:target" style={{ fontSize: "24px", color: "#F8B602" }} />
          <span>Tạo mục tiêu mới</span>
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      okText="Tạo mục tiêu"
      cancelText="Hủy"
      width={600}
      confirmLoading={loading}
      okButtonProps={{ disabled: hasErrors || loading }}
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        initialValues={{
          durationType: 'months',
          duration: 1
        }}
      >
        <Form.Item
          label="Cân nặng hiện tại (kg)"
          name="currentWeight"
          rules={[
            { required: true, message: "Vui lòng nhập cân nặng hiện tại!" },
            { type: 'number', min: 30, max: 300, message: "Cân nặng không hợp lệ!" }
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Nhập cân nặng hiện tại"
            min={30}
            max={300}
            step={0.1}
            disabled={!!currentWeight}
          />
        </Form.Item>

        <Form.Item
          label="Cân nặng mục tiêu (kg)"
          name="targetWeight"
          rules={[
            { required: true, message: "Vui lòng nhập cân nặng mục tiêu!" },
            { type: 'number', min: 30, max: 300, message: "Cân nặng không hợp lệ!" }
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Nhập cân nặng mục tiêu"
            min={30}
            max={300}
            step={0.1}
          />
        </Form.Item>

        <Form.Item label="Thời gian thực hiện">
          <Input.Group compact style={{ display: 'flex' }}>
            <Form.Item
              name="duration"
              noStyle
              rules={[{ required: true, message: "Vui lòng nhập thời gian!" }]}
            >
              <InputNumber
                style={{ width: "50%" }}
                placeholder="Thời gian"
                min={1}
                max={52}
              />
            </Form.Item>
            <Form.Item name="durationType" noStyle>
              <Select style={{ width: "50%" }}>
                <Option value="weeks">Tuần</Option>
                <Option value="months">Tháng</Option>
              </Select>
            </Form.Item>
          </Input.Group>
        </Form.Item>

        <Form.Item
          label="Mô tả (tùy chọn)"
          name="description"
        >
          <Input.TextArea
            rows={3}
            placeholder="Ví dụ: Chuẩn bị cho mùa hè, giảm mỡ bụng..."
          />
        </Form.Item>
      </Form>

      {goalCalculation && (
        <>
          <Divider style={{ margin: "16px 0" }} />
          
          <div style={{ padding: "16px", background: "#f5f5f5", borderRadius: "8px" }}>
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              <div>
                <Text strong style={{ fontSize: "16px" }}>
                  <Icon icon={goalCalculation.goalIcon} style={{ color: goalCalculation.goalColor, marginRight: 8 }} />
                  {goalCalculation.goalTypeText}
                </Text>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <Text type="secondary">Thay đổi mỗi tuần:</Text>
                  <br />
                  <Text strong style={{ fontSize: "18px", color: goalCalculation.goalColor }}>
                    {goalCalculation.weeklyWeightChange > 0 ? '+' : ''}
                    {goalCalculation.weeklyWeightChange.toFixed(1)} kg
                  </Text>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Text type="secondary">Điều chỉnh calo:</Text>
                  <br />
                  <Text strong style={{ fontSize: "18px" }}>
                    {goalCalculation.dailyCalorieAdjustment > 0 ? '+' : ''}
                    {goalCalculation.dailyCalorieAdjustment} cal/ngày
                  </Text>
                </div>
              </div>

              <div>
                <Text type="secondary">Thời gian: </Text>
                <Text strong>{goalCalculation.durationWeeks} tuần</Text>
              </div>
            </Space>
          </div>

          {goalCalculation.errors.length > 0 && (
            <div style={{ marginTop: "16px" }}>
              {goalCalculation.errors.map((error, index) => (
                <Alert
                  key={index}
                  message="Mục tiêu không an toàn"
                  description={error.message}
                  type="error"
                  showIcon
                  style={{ marginBottom: "8px" }}
                  icon={<Icon icon="mdi:alert-circle" />}
                />
              ))}
            </div>
          )}

          {goalCalculation.warnings.length > 0 && goalCalculation.errors.length === 0 && (
            <div style={{ marginTop: "16px" }}>
              {goalCalculation.warnings.map((warning, index) => (
                <Alert
                  key={index}
                  message="Cảnh báo"
                  description={warning.message}
                  type="warning"
                  showIcon
                  style={{ marginBottom: "8px" }}
                  icon={<Icon icon="mdi:alert" />}
                />
              ))}
            </div>
          )}

          {goalCalculation.errors.length === 0 && goalCalculation.warnings.length === 0 && (
            <Alert
              message="Mục tiêu an toàn"
              description="Mục tiêu của bạn nằm trong phạm vi an toàn và khả thi. Hãy kiên trì thực hiện!"
              type="success"
              showIcon
              style={{ marginTop: "16px" }}
              icon={<Icon icon="mdi:check-circle" />}
            />
          )}
        </>
      )}
    </Modal>
  );
};

export default GoalCreateModal;



