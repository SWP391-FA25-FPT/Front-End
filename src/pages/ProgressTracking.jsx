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
import SettingLayout from "../components/layout/SettingLayout";
import PageHeader from "../components/Progress/PageHeader";
import StatsOverview from "../components/Progress/StatsOverview";
import WeightChart from "../components/Progress/WeightChart";
import DailyProgress from "../components/Progress/DailyProgress";
import WaterIntake from "../components/Progress/WaterIntake";
import WeeklyOverview from "../components/Progress/WeeklyOverview";
import GoalsSection from "../components/Progress/GoalsSection";
import progressData from "../data/progressData.json";
import "./style/ProgressTracking.css";

const ProgressTracking = () => {
  const [addRecordModalVisible, setAddRecordModalVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Load data from JSON file
  const [stats, setStats] = useState(progressData.stats);
  const [weightData, setWeightData] = useState(progressData.weightData);
  const [dailyData, setDailyData] = useState(progressData.dailyData);
  const [waterData, setWaterData] = useState(progressData.waterData);
  const [weeklyData] = useState(progressData.weeklyData);
  const [goals] = useState(progressData.goals);

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
    <SettingLayout>
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
    </SettingLayout>
  );
};

export default ProgressTracking;
