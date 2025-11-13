import React, { useState, useEffect } from "react";
import { Modal, Form, InputNumber, Checkbox, Input, Button, Space, Progress, Typography, Divider } from "antd";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";

const { Text, Title } = Typography;

const DailyCheckInModal = ({ 
  visible, 
  onCancel, 
  onSubmit, 
  loading,
  activeGoal,
  lastWeight,
  todayProgress
}) => {
  const [form] = Form.useForm();
  const [currentWeight, setCurrentWeight] = useState(null);
  const [waterIntake, setWaterIntake] = useState(0);

  useEffect(() => {
    if (visible) {
      const initialWeight = todayProgress?.actualWeight || lastWeight || activeGoal?.currentWeight;
      const initialWater = todayProgress?.waterIntake || 0;
      form.setFieldsValue({
        weight: initialWeight,
        waterIntake: initialWater,
        exercised: todayProgress?.exercised || false,
        calories: todayProgress?.actualCalories || null,
        notes: todayProgress?.notes || ''
      });
      setCurrentWeight(initialWeight);
      setWaterIntake(initialWater);
    }
  }, [visible, lastWeight, activeGoal, todayProgress, form]);

  const handleWeightChange = (value) => {
    setCurrentWeight(value);
  };

  const handleWaterSelect = (count) => {
    setWaterIntake(count);
    form.setFieldsValue({ waterIntake: count });
  };

  const getWaterFeedback = (count) => {
    if (count === 0) {
      return {
        message: "💧 Hãy bắt đầu uống nước ngay! Nước rất quan trọng cho sức khỏe của bạn.",
        color: "#ff4d4f",
        icon: "mdi:alert-circle"
      };
    } else if (count <= 2) {
      return {
        message: "💪 Cần uống nhiều nước hơn nhé! Nước giúp cơ thể lọc độc tố và hoạt động tốt hơn.",
        color: "#fa8c16",
        icon: "mdi:alert"
      };
    } else if (count <= 4) {
      return {
        message: "👍 Đang làm tốt đấy! Cố gắng uống thêm vài cốc nữa để đạt mục tiêu nhé.",
        color: "#faad14",
        icon: "mdi:emoticon-happy"
      };
    } else if (count <= 5) {
      return {
        message: "😊 Tuyệt vời! Bạn đã uống được hơn nửa mục tiêu rồi, tiếp tục phát huy!",
        color: "#52c41a",
        icon: "mdi:thumb-up"
      };
    } else if (count <= 7) {
      return {
        message: "🌟 Xuất sắc! Chỉ còn một chút nữa là đạt mục tiêu 8 cốc rồi!",
        color: "#52c41a",
        icon: "mdi:star"
      };
    } else {
      return {
        message: "🎉 Hoàn hảo! Bạn đã uống đủ nước trong ngày. Cơ thể cảm ơn bạn!",
        color: "#1890ff",
        icon: "mdi:trophy"
      };
    }
  };

  const waterFeedback = getWaterFeedback(waterIntake);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
    } catch (error) {
      console.error('Form validation error:', error);
    }
  };

  const calculateProgress = () => {
    if (!activeGoal || !currentWeight) return 0;
    const totalChange = Math.abs(activeGoal.targetWeight - activeGoal.startWeight);
    const currentChange = Math.abs(currentWeight - activeGoal.startWeight);
    return Math.min(100, Math.round((currentChange / totalChange) * 100));
  };

  const getGoalStatus = () => {
    if (!activeGoal || !currentWeight) return null;
    
    const remaining = activeGoal.goalType === 'weight_loss' 
      ? currentWeight - activeGoal.targetWeight
      : activeGoal.targetWeight - currentWeight;
    
    if (remaining <= 0) {
      return {
        text: '🎉 Chúc mừng! Bạn đã đạt mục tiêu!',
        color: '#52c41a'
      };
    }
    
    return {
      text: `Còn ${Math.abs(remaining).toFixed(1)}kg nữa là đạt mục tiêu!`,
      color: '#F8B602'
    };
  };

  const goalStatus = getGoalStatus();

  return (
    <Modal
      title={
        <Space>
          <Icon icon="mdi:clipboard-check" style={{ fontSize: "24px", color: "#F8B602" }} />
          <span>Xin chào! Hôm nay của bạn thế nào? 👋</span>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      closable={true}
    >
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <Text type="secondary">
          {dayjs().format('dddd, DD/MM/YYYY')}
        </Text>
      </div>

      {activeGoal && (
        <div style={{ 
          padding: "16px", 
          background: "linear-gradient(135deg, #fff5e6 0%, #ffe8cc 100%)",
          borderRadius: "12px",
          marginBottom: "24px",
          border: "2px solid #F8B602"
        }}>
          <Space direction="vertical" style={{ width: "100%" }} size="small">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Text strong style={{ fontSize: "16px" }}>
                <Icon 
                  icon={activeGoal.goalType === 'weight_loss' ? 'mdi:arrow-down-bold' : 'mdi:arrow-up-bold'} 
                  style={{ marginRight: "8px", color: "#F8B602" }}
                />
                Mục tiêu: {activeGoal.startWeight}kg → {activeGoal.targetWeight}kg
              </Text>
              <Text type="secondary">
                {Math.max(0, Math.ceil((new Date(activeGoal.endDate) - new Date()) / (1000 * 60 * 60 * 24)))} ngày còn lại
              </Text>
            </div>
            
            <Progress 
              percent={calculateProgress()} 
              strokeColor={{
                '0%': '#F8B602',
                '100%': '#52c41a',
              }}
              trailColor="#f0f0f0"
              size={[undefined, 12]}
            />
            
            {goalStatus && (
              <Text style={{ color: goalStatus.color, fontWeight: 500, fontSize: "14px" }}>
                {goalStatus.text}
              </Text>
            )}
            
            <Text type="secondary" style={{ fontSize: "12px" }}>
              <Icon icon="mdi:fire" style={{ marginRight: "4px" }} />
              Target: {activeGoal.targetCaloriesPerDay} calories/ngày
            </Text>
          </Space>
        </div>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label={
            <span>
              <Icon icon="mdi:weight-kilogram" style={{ marginRight: "6px", color: "#F8B602" }} />
              Cân nặng hôm nay (kg)
            </span>
          }
          name="weight"
          rules={[
            { required: true, message: "Vui lòng nhập cân nặng!" },
            { type: 'number', min: 30, max: 300, message: "Cân nặng không hợp lệ!" }
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Nhập cân nặng"
            min={30}
            max={300}
            step={0.1}
            onChange={handleWeightChange}
            size="large"
          />
        </Form.Item>

        <Form.Item
          label={
            <span>
              <Icon icon="mdi:cup-water" style={{ marginRight: "6px", color: "#1890ff" }} />
              Hôm nay bạn đã uống bao nhiêu cốc nước?
            </span>
          }
          name="waterIntake"
        >
          <div style={{ display: 'none' }}>
            <InputNumber value={waterIntake} />
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '8px',
            marginBottom: '12px'
          }}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map(count => (
              <Button
                key={count}
                type={waterIntake === count ? "primary" : "default"}
                onClick={() => handleWaterSelect(count)}
                style={{
                  height: '50px',
                  fontSize: '16px',
                  fontWeight: waterIntake === count ? 'bold' : 'normal',
                  background: waterIntake === count 
                    ? 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)'
                    : '#fff',
                  borderColor: waterIntake === count ? '#1890ff' : '#d9d9d9',
                  color: waterIntake === count ? '#fff' : '#000',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px'
                }}
              >
                <Icon 
                  icon="mdi:cup-water" 
                  style={{ fontSize: '20px', marginBottom: '2px' }} 
                />
                {count}
              </Button>
            ))}
            <Button
              type={waterIntake >= 8 ? "primary" : "default"}
              onClick={() => handleWaterSelect(8)}
              style={{
                height: '50px',
                fontSize: '16px',
                fontWeight: waterIntake >= 8 ? 'bold' : 'normal',
                background: waterIntake >= 8 
                  ? 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)'
                  : '#fff',
                borderColor: waterIntake >= 8 ? '#52c41a' : '#d9d9d9',
                color: waterIntake >= 8 ? '#fff' : '#000',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px'
              }}
            >
              <Icon 
                icon="mdi:trophy" 
                style={{ fontSize: '20px', marginBottom: '2px' }} 
              />
              8+
            </Button>
          </div>

          <div style={{
            padding: '12px 16px',
            background: `${waterFeedback.color}15`,
            borderLeft: `4px solid ${waterFeedback.color}`,
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Icon 
              icon={waterFeedback.icon} 
              style={{ fontSize: '24px', color: waterFeedback.color, flexShrink: 0 }} 
            />
            <Text style={{ color: waterFeedback.color, fontSize: '14px', lineHeight: '1.5' }}>
              {waterFeedback.message}
            </Text>
          </div>
        </Form.Item>

        <Form.Item name="exercised" valuePropName="checked">
          <Checkbox style={{ fontSize: "15px" }}>
            <Icon icon="mdi:run" style={{ marginRight: "6px", color: "#52c41a" }} />
            Hôm nay tôi đã tập luyện
          </Checkbox>
        </Form.Item>

        <Form.Item
          label={
            <span>
              <Icon icon="mdi:food-apple" style={{ marginRight: "6px", color: "#ff4d4f" }} />
              Tổng calories tiêu thụ (tùy chọn)
            </span>
          }
          name="calories"
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Nhập calories nếu bạn biết"
            min={0}
            size="large"
          />
        </Form.Item>

        <Form.Item
          label={
            <span>
              <Icon icon="mdi:note-text" style={{ marginRight: "6px", color: "#722ed1" }} />
              Ghi chú (tùy chọn)
            </span>
          }
          name="notes"
        >
          <Input.TextArea
            rows={3}
            placeholder="Cảm giác hôm nay thế nào? Có điều gì đặc biệt không?"
            style={{ resize: "none" }}
          />
        </Form.Item>

        <Divider />

        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Button 
            onClick={onCancel}
            size="large"
          >
            Để sau
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            style={{
              background: "linear-gradient(135deg, #F8B602 0%, #e19a28 100%)",
              border: "none",
              minWidth: "120px"
            }}
          >
            <Icon icon="mdi:check" style={{ marginRight: "6px" }} />
            Lưu lại
          </Button>
        </Space>
      </Form>
    </Modal>
  );
};

export default DailyCheckInModal;


