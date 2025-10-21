import React, { useState } from "react";
import {
  Row,
  Col,
  Modal,
  Form,
  Input,
  DatePicker,
  Button,
  message,
} from "antd";
import AppLayout from "../components/layout/AppLayout";
import PageHeader from "../components/Progress/PageHeader";
import StatsOverview from "../components/Progress/StatsOverview";
import WeightChart from "../components/Progress/WeightChart";
import DailyProgress from "../components/Progress/DailyProgress";
import WaterIntake from "../components/Progress/WaterIntake";
import WeeklyOverview from "../components/Progress/WeeklyOverview";
import GoalsSection from "../components/Progress/GoalsSection";
import "./style/ProgressTracking.css";

const ProgressTracking = () => {
  const [addRecordModalVisible, setAddRecordModalVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Mock data - trong thực tế sẽ lấy từ API
  const [stats, setStats] = useState({
    currentWeight: 68.5,
    targetWeight: 65,
    weightChange: -2.5,
    currentStreak: 7,
  });

  const [weightData, setWeightData] = useState({
    labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
    values: [71, 70.5, 70, 69.5, 69, 68.5, 68.5],
    target: Array(7).fill(65),
  });

  const [dailyData, setDailyData] = useState({
    calories: { current: 1450, target: 2000 },
    protein: { current: 78, target: 120 },
    carbs: { current: 180, target: 250 },
    fat: { current: 45, target: 65 },
  });

  const [waterData, setWaterData] = useState({
    current: 5,
    target: 8,
  });

  const [weeklyData] = useState([
    { date: "2025-10-15", exercised: true, metCalories: true, metWater: true },
    { date: "2025-10-16", exercised: true, metCalories: false, metWater: true },
    { date: "2025-10-17", exercised: false, metCalories: true, metWater: true },
    { date: "2025-10-18", exercised: true, metCalories: true, metWater: false },
    { date: "2025-10-19", exercised: true, metCalories: true, metWater: true },
    { date: "2025-10-20", exercised: true, metCalories: true, metWater: true },
    {
      date: "2025-10-21",
      exercised: false,
      metCalories: false,
      metWater: true,
    },
  ]);

  const [goals] = useState([
    {
      title: "Giảm cân",
      description: "Giảm 5kg trong 2 tháng",
      progress: 50,
      current: 2.5,
      target: 5,
      unit: "kg",
      daysLeft: 30,
      status: "in-progress",
      icon: "mdi:target",
      color: "#F8B602",
    },
    {
      title: "Tập luyện đều đặn",
      description: "Tập thể dục 5 ngày/tuần",
      progress: 80,
      current: 4,
      target: 5,
      unit: "ngày",
      daysLeft: 2,
      status: "in-progress",
      icon: "mdi:run",
      color: "#52c41a",
    },
    {
      title: "Uống đủ nước",
      description: "Uống 2L nước mỗi ngày",
      progress: 100,
      current: 7,
      target: 7,
      unit: "ngày",
      daysLeft: 0,
      status: "completed",
      icon: "mdi:cup-water",
      color: "#1890ff",
    },
  ]);

  const handleAddWater = () => {
    if (waterData.current < waterData.target) {
      setWaterData((prev) => ({
        ...prev,
        current: prev.current + 1,
      }));
      message.success("Đã thêm 1 cốc nước!");
    }
  };

  const handleRemoveWater = () => {
    if (waterData.current > 0) {
      setWaterData((prev) => ({
        ...prev,
        current: prev.current - 1,
      }));
    }
  };

  const handleAddRecord = () => {
    setAddRecordModalVisible(true);
  };

  const handleViewHistory = () => {
    setHistoryModalVisible(true);
  };

  const handleAddRecordSubmit = (values) => {
    console.log("New record:", values);
    message.success("Đã thêm bản ghi mới!");
    setAddRecordModalVisible(false);
    form.resetFields();
  };

  return (
    <AppLayout>
      <div className="progress-tracking-container">
        <PageHeader
          onAddRecord={handleAddRecord}
          onViewHistory={handleViewHistory}
        />

        <StatsOverview stats={stats} />

        <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
          <Col xs={24} lg={16}>
            <WeightChart weightData={weightData} />
          </Col>
          <Col xs={24} lg={8}>
            <WaterIntake
              waterData={waterData}
              onAddWater={handleAddWater}
              onRemoveWater={handleRemoveWater}
            />
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
          <Col xs={24} lg={12}>
            <DailyProgress dailyData={dailyData} />
          </Col>
          <Col xs={24} lg={12}>
            <GoalsSection goals={goals} />
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
          <Col xs={24}>
            <WeeklyOverview weeklyData={weeklyData} />
          </Col>
        </Row>
      </div>

      {/* Add Record Modal */}
      <Modal
        title="Thêm bản ghi mới"
        open={addRecordModalVisible}
        onCancel={() => {
          setAddRecordModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddRecordSubmit}
          style={{ marginTop: "20px" }}
        >
          <Form.Item
            label="Ngày"
            name="date"
            rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
          >
            <DatePicker style={{ width: "100%" }} placeholder="Chọn ngày" />
          </Form.Item>

          <Form.Item
            label="Cân nặng (kg)"
            name="weight"
            rules={[{ required: true, message: "Vui lòng nhập cân nặng!" }]}
          >
            <Input type="number" placeholder="Nhập cân nặng" />
          </Form.Item>

          <Form.Item label="Calories tiêu thụ" name="calories">
            <Input type="number" placeholder="Nhập calories" />
          </Form.Item>

          <Form.Item label="Ghi chú" name="notes">
            <Input.TextArea rows={4} placeholder="Ghi chú..." />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: "24px" }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              style={{
                background: "linear-gradient(135deg, #F8B602 0%, #e19a28 100%)",
                border: "none",
              }}
            >
              Thêm bản ghi
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* History Modal */}
      <Modal
        title="Lịch sử theo dõi"
        open={historyModalVisible}
        onCancel={() => setHistoryModalVisible(false)}
        footer={null}
        width={800}
      >
        <div style={{ padding: "20px" }}>
          <p>Danh sách lịch sử theo dõi sẽ được hiển thị ở đây...</p>
        </div>
      </Modal>
    </AppLayout>
  );
};

export default ProgressTracking;
