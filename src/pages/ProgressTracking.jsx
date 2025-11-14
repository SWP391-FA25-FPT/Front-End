import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Modal,
  Form,
  Input,
  DatePicker,
  Button,
  message,
  InputNumber,
  Checkbox,
} from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from "dayjs";
import SettingLayout from "../components/layout/SettingLayout";
import PageHeader from "../components/Progress/PageHeader";
import StatsOverview from "../components/Progress/StatsOverview";
import WeightChart from "../components/Progress/WeightChart";
import DailyProgress from "../components/Progress/DailyProgress";
import WaterIntake from "../components/Progress/WaterIntake";
import WeeklyOverview from "../components/Progress/WeeklyOverview";
import GoalsSection from "../components/Progress/GoalsSection";
import GoalCreateModal from "../components/Progress/GoalCreateModal";
import MealPlanSection from "../components/Progress/MealPlanSection";
import DailyCheckInModal from "../components/Progress/DailyCheckInModal";
import { getActiveGoal, createGoal } from "../apis/goal";
import { getProgressHistory, addProgressRecord, updateProgressRecord, getProgressStats, getTodayProgress } from "../apis/progressTracking";
import { getMealPlans, generateMealPlan, regenerateMealPlan, deleteAllUserMealPlans } from "../apis/mealplan";
import { getProfile } from "../apis/user";
import "./style/ProgressTracking.css";
import { useAuth } from "../context/useAuth";
import { isPremium } from "../utils/premium";
import PremiumNotice from "../components/PremiumNotice";

const ProgressTracking = () => {
  const { user } = useAuth();
  const [premiumNoticeVisible, setPremiumNoticeVisible] = useState(false);
  const [addRecordModalVisible, setAddRecordModalVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [dailyCheckInVisible, setDailyCheckInVisible] = useState(false);
  const [form] = Form.useForm();

  // State for backend data (Đã giữ lại phần state mới kết nối API)
  const [activeGoal, setActiveGoal] = useState(null);
  const [goals, setGoals] = useState([]);
  const [todayProgress, setTodayProgress] = useState(null);
  const [progressHistory, setProgressHistory] = useState([]);
  const [progressStats, setProgressStats] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [mealPlanLoading, setMealPlanLoading] = useState(false);

  // Derived state for UI components (Đã giữ lại phần state mới kết nối API)
  const [stats, setStats] = useState({
    currentWeight: 0,
    targetWeight: 0,
    weightChange: 0,
    currentStreak: 0
  });
  const [weightData, setWeightData] = useState({
    labels: [],
    values: [],
    target: []
  });
  const [dailyData, setDailyData] = useState({
    calories: { current: 0, target: 2000 },
    protein: { current: 0, target: 120 },
    carbs: { current: 0, target: 250 },
    fat: { current: 0, target: 65 }
  });
  const [waterData, setWaterData] = useState({
    current: 0,
    target: 8
  });
  const [weeklyData, setWeeklyData] = useState([]);

  // Check premium status on mount and auto-show notice
  useEffect(() => {
    if (user && !isPremium(user)) {
      // Auto-show premium notice modal
      setPremiumNoticeVisible(true);
    }
  }, [user]);

  // Load data on mount (only if premium)
  useEffect(() => {
    if (user && isPremium(user)) {
      loadAllData();
    }
  }, [user]);

  // Auto-show daily check-in modal
  useEffect(() => {
    const checkDailyCheckIn = () => {
      const today = new Date().toISOString().split('T')[0];
      const lastCheckIn = localStorage.getItem('lastDailyCheckIn');

      // Only show if:
      // 1. Not shown today yet
      // 2. User has an active goal (to make it more meaningful)
      // 3. No progress record for today yet
      if (lastCheckIn !== today && activeGoal && !todayProgress) {
        // Delay a bit to let the page load first
        const timer = setTimeout(() => {
          setDailyCheckInVisible(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    };

    if (activeGoal !== null) { // Wait until we've checked for active goal
      checkDailyCheckIn();
    }
  }, [activeGoal, todayProgress]);

  const loadAllData = async () => {
    try {
      setLoading(true);

      // Load user profile
      const profileRes = await getProfile();
      if (profileRes) {
        // getProfile returns { user: { profile: {...} }, stats: {...}, ... }
        // So we need to extract the user object
        const userData = profileRes.user || profileRes;
        console.log('Profile data loaded:', userData);
        console.log('User weight:', userData?.profile?.weight);
        setUserProfile(userData);
      }

      // Load active goal
      try {
        const goalRes = await getActiveGoal();
        if (goalRes.success) {
          setActiveGoal(goalRes.data);
          setGoals([goalRes.data]);

          // Update stats from goal
          setStats({
            currentWeight: goalRes.data.currentWeight,
            targetWeight: goalRes.data.targetWeight,
            weightChange: goalRes.data.currentWeight - goalRes.data.startWeight,
            currentStreak: 0
          });
        }
      } catch (error) {
        // No active goal
        console.log('No active goal');
      }

      // Load today's progress
      try {
        const todayRes = await getTodayProgress();
        if (todayRes.success) {
          setTodayProgress(todayRes.data);
          updateDailyDataFromProgress(todayRes.data);
        }
      } catch (error) {
        // No progress for today
        console.log('No progress for today');
      }

      // Load progress history (last 30 days)
      const historyRes = await getProgressHistory({ limit: 30 });
      if (historyRes.success) {
        setProgressHistory(historyRes.data);
        updateWeightChartFromHistory(historyRes.data);
        updateWeeklyDataFromHistory(historyRes.data);
      }

      // Load progress stats
      const statsRes = await getProgressStats();
      if (statsRes.success) {
        setProgressStats(statsRes.data);
      }

      // Load today's meal plan (only goal-based meal plans for Tracking Page)
      const today = new Date().toISOString().split('T')[0];
      const mealPlanRes = await getMealPlans({ date: today, forGoal: true });
      if (mealPlanRes.success && mealPlanRes.data.length > 0) {
        setMealPlan(mealPlanRes.data[0]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      message.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const updateDailyDataFromProgress = (progress) => {
    const caloriesTarget = activeGoal?.targetCaloriesPerDay || 2000;
    setDailyData({
      calories: {
        current: progress.actualCalories || 0,
        target: caloriesTarget
      },
      protein: {
        current: progress.actualMacros?.protein || 0,
        target: 120
      },
      carbs: {
        current: progress.actualMacros?.carbs || 0,
        target: 250
      },
      fat: {
        current: progress.actualMacros?.fat || 0,
        target: 65
      }
    });

    setWaterData({
      current: progress.waterIntake || 0,
      target: 8
    });
  };

  const updateWeightChartFromHistory = (history) => {
    const last7Days = history.slice(0, 7).reverse();
    const labels = last7Days.map(record => {
      const date = new Date(record.date);
      return ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][date.getDay()];
    });
    const values = last7Days.map(record => record.actualWeight || 0).filter(w => w > 0);
    const targetWeight = activeGoal?.targetWeight || 0;
    const target = last7Days.map(() => targetWeight);

    setWeightData({ labels, values, target });
  };

  const updateWeeklyDataFromHistory = (history) => {
    const last7Days = history.slice(0, 7).reverse();
    const weekly = last7Days.map(record => ({
      date: record.date,
      exercised: record.exercised || false,
      metCalories: record.actualCalories > 0,
      metWater: (record.waterIntake || 0) >= 8
    }));
    setWeeklyData(weekly);
  };

  const handleAddWater = async () => {
    if (waterData.current < waterData.target) {
      const newWaterCount = waterData.current + 1;
      setWaterData((prev) => ({
        ...prev,
        current: newWaterCount,
      }));

      // Update progress record if exists, otherwise do nothing (will be saved when full record is added)
      if (todayProgress) {
        try {
          await updateProgressRecord(todayProgress._id, { waterIntake: newWaterCount });
          message.success("Đã thêm 1 cốc nước!");
        } catch (error) {
          console.error('Error updating water:', error);
        }
      } else {
        message.success("Đã thêm 1 cốc nước!");
      }
    }
  };

  const handleRemoveWater = async () => {
    if (waterData.current > 0) {
      const newWaterCount = waterData.current - 1;
      setWaterData((prev) => ({
        ...prev,
        current: newWaterCount,
      }));

      if (todayProgress) {
        try {
          await updateProgressRecord(todayProgress._id, { waterIntake: newWaterCount });
        } catch (error) {
          console.error('Error updating water:', error);
        }
      }
    }
  };

  const handleAddRecord = () => {
    form.setFieldsValue({
      date: dayjs(),
      waterIntake: waterData.current
    });
    setAddRecordModalVisible(true);
  };

  const handleViewHistory = () => {
    setHistoryModalVisible(true);
  };

  const handleAddRecordSubmit = async (values) => {
    try {
      setLoading(true);
      const recordData = {
        date: values.date.toISOString(),
        actualWeight: values.weight,
        actualCalories: values.calories || 0,
        waterIntake: values.waterIntake || waterData.current,
        exercised: values.exercised || false,
        notes: values.notes || '',
        goalId: activeGoal?._id,
        mealPlanId: mealPlan?._id
      };

      const response = await addProgressRecord(recordData);
      if (response.success) {
        message.success("Đã thêm bản ghi mới!");
        setAddRecordModalVisible(false);
        form.resetFields();
        loadAllData(); // Reload all data
      }
    } catch (error) {
      console.error('Error adding record:', error);
      message.error(error.message || 'Không thể thêm bản ghi');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = () => {
    setGoalModalVisible(true);
  };

  const handleGoalSubmit = async (goalData) => {
    try {
      setLoading(true);
      const response = await createGoal(goalData);
      if (response.success) {
        message.success("Đã tạo mục tiêu mới!");
        setGoalModalVisible(false);
        setActiveGoal(response.data);
        setGoals([response.data]);
        loadAllData();
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      if (error.errors && error.errors.length > 0) {
        error.errors.forEach(err => message.error(err));
      } else {
        message.error(error.message || 'Không thể tạo mục tiêu');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMealPlan = async () => {
    if (!activeGoal) {
      message.warning('Vui lòng tạo mục tiêu trước để nhận gợi ý bữa ăn phù hợp!');
      return;
    }

    try {
      setMealPlanLoading(true);
      const today = new Date().toISOString().split('T')[0];
      // Use goal-based calories and save goalId for tracking page
      const response = await generateMealPlan(today, true, activeGoal._id);
      if (response.success) {
        setMealPlan(response.data);
        message.success('Đã tạo kế hoạch bữa ăn theo mục tiêu của bạn!');
      }
    } catch (error) {
      console.error('Error generating meal plan:', error);
      message.error(error.message || 'Không thể tạo kế hoạch bữa ăn');
    } finally {
      setMealPlanLoading(false);
    }
  };

  const handleRegenerateMealPlan = async () => {
    try {
      setMealPlanLoading(true);
      const today = new Date().toISOString().split('T')[0];
      // Use goal-based calories and save goalId for tracking page
      const response = await regenerateMealPlan(today, true, activeGoal?._id);
      if (response.success) {
        setMealPlan(response.data);
        message.success('Đã tạo lại kế hoạch bữa ăn theo mục tiêu của bạn!');
      }
    } catch (error) {
      console.error('Error regenerating meal plan:', error);
      message.error(error.message || 'Không thể tạo lại kế hoạch bữa ăn');
    } finally {
      setMealPlanLoading(false);
    }
  };

  const handleDailyCheckInSubmit = async (values) => {
    try {
      setLoading(true);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const recordData = {
        date: today.toISOString(),
        actualWeight: values.weight,
        actualCalories: values.calories || 0,
        waterIntake: values.waterIntake || 0,
        exercised: values.exercised || false,
        notes: values.notes || '',
        goalId: activeGoal?._id,
        mealPlanId: mealPlan?._id
      };

      let response;
      // Check if record exists for today
      if (todayProgress) {
        // Update existing record
        response = await updateProgressRecord(todayProgress._id, recordData);
        if (response.success) {
          message.success("Đã cập nhật thông tin hôm nay!");
        }
      } else {
        // Create new record
        response = await addProgressRecord(recordData);
        if (response.success) {
          message.success("Cảm ơn bạn đã chia sẻ! Tiếp tục phát huy nhé! 💪");
        }
      }

      // Update local state immediately for instant UI feedback
      if (response.success) {
        const updatedProgress = {
          ...todayProgress,
          ...recordData,
          actualWeight: values.weight,
          actualCalories: values.calories || 0,
          waterIntake: values.waterIntake || 0,
          exercised: values.exercised || false,
          date: today.toISOString()
        };
        
        setTodayProgress(updatedProgress);
        
        // Update water data immediately
        setWaterData({
          current: values.waterIntake || 0,
          target: 8
        });

        // Update daily data immediately
        updateDailyDataFromProgress(updatedProgress);

        // Update current weight in stats if changed
        if (values.weight && activeGoal) {
          setStats(prev => ({
            ...prev,
            currentWeight: values.weight,
            weightChange: values.weight - activeGoal.startWeight
          }));
        }

        // Update weight chart immediately with today's weight
        if (values.weight) {
          // Update progress history to include today's data
          const updatedHistory = [updatedProgress, ...progressHistory.filter(h => 
            new Date(h.date).toDateString() !== today.toDateString()
          )];
          setProgressHistory(updatedHistory);
          
          // Update weight chart with new data
          updateWeightChartFromHistory(updatedHistory);
          
          // Update weekly data with new record
          updateWeeklyDataFromHistory(updatedHistory);
        }
      }

      // Mark as checked in today
      const today_str = new Date().toISOString().split('T')[0];
      localStorage.setItem('lastDailyCheckIn', today_str);

      setDailyCheckInVisible(false);
      
      // Reload all data in background to ensure consistency
      loadAllData();
    } catch (error) {
      console.error('Error submitting daily check-in:', error);
      message.error(error.message || 'Không thể lưu thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleDailyCheckInCancel = () => {
    setDailyCheckInVisible(false);
    // Mark as dismissed for today
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('lastDailyCheckIn', today);
  };

  const getLastWeight = () => {
    if (progressHistory && progressHistory.length > 0) {
      const recordsWithWeight = progressHistory.filter(r => r.actualWeight);
      if (recordsWithWeight.length > 0) {
        return recordsWithWeight[0].actualWeight;
      }
    }
    return activeGoal?.currentWeight || null;
  };

  const handlePauseGoal = async () => {
    if (!activeGoal) return;

    try {
      setLoading(true);
      const newStatus = activeGoal.status === 'paused' ? 'active' : 'paused';

      const { updateGoal } = await import("../apis/goal");
      const response = await updateGoal(activeGoal._id, { status: newStatus });

      if (response.success) {
        message.success(
          newStatus === 'paused'
            ? 'Đã tạm dừng mục tiêu'
            : 'Đã tiếp tục mục tiêu'
        );
        setActiveGoal({ ...activeGoal, status: newStatus });
        loadAllData();
      }
    } catch (error) {
      console.error('Error pausing/resuming goal:', error);
      message.error('Không thể cập nhật trạng thái mục tiêu');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelGoal = () => {
    if (!activeGoal) return;

    // First confirmation - Ask if user wants to delete all data
    Modal.confirm({
      title: 'Xác nhận hủy mục tiêu',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p style={{ fontSize: '15px', marginBottom: '16px' }}>
            Bạn có chắc chắn muốn hủy mục tiêu này không?
          </p>

          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: '#f5f5f5',
            borderRadius: '4px',
            marginBottom: '16px'
          }}>
            <p style={{ margin: 0, fontWeight: 500 }}>
              Mục tiêu hiện tại:
            </p>
            <p style={{ margin: '4px 0 0 0' }}>
              {activeGoal.startWeight}kg → {activeGoal.targetWeight}kg
              ({activeGoal.goalType === 'weight_loss' ? 'Giảm cân' : 'Tăng cân'})
            </p>
          </div>

          <div style={{
            padding: '12px',
            background: '#fff2e8',
            border: '1px solid #ffbb96',
            borderRadius: '4px'
          }}>
            <p style={{ margin: 0, fontWeight: 500, color: '#d46b08' }}>
              ⚠️ Chọn hành động:
            </p>
            <div style={{ marginTop: '8px' }}>
              <p style={{ margin: '4px 0', fontSize: '13px' }}>
                • <strong>Hủy và giữ dữ liệu</strong>: Mục tiêu bị hủy nhưng lịch sử tracking vẫn được lưu
              </p>
              <p style={{ margin: '4px 0', fontSize: '13px' }}>
                • <strong>Hủy và xóa tất cả</strong>: Xóa mục tiêu và TẤT CẢ dữ liệu tracking liên quan
              </p>
            </div>
          </div>
        </div>
      ),
      okText: 'Hủy và giữ dữ liệu',
      cancelText: 'Không hủy',
      width: 550,
      okButtonProps: {
        danger: true
      },
      footer: (_, { OkBtn, CancelBtn }) => (
        <>
          <CancelBtn />
          <Button
            danger
            onClick={async () => {
              Modal.destroyAll();
              // Show second confirmation for delete all
              showDeleteAllConfirmation();
            }}
            style={{ marginRight: '8px' }}
          >
            Hủy và xóa tất cả
          </Button>
          <OkBtn />
        </>
      ),
      onOk: async () => {
        try {
          setLoading(true);
          const { cancelGoal } = await import("../apis/goal");
          const response = await cancelGoal(activeGoal._id);

          if (response.success) {
            message.success('Đã hủy mục tiêu (dữ liệu tracking được giữ lại)');
            setActiveGoal(null);
            setGoals([]);
            loadAllData();
          }
        } catch (error) {
          console.error('Error canceling goal:', error);
          message.error('Không thể hủy mục tiêu');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const showDeleteAllConfirmation = () => {
    Modal.confirm({
      title: '⚠️ Xác nhận xóa tất cả dữ liệu',
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: (
        <div>
          <p style={{ fontSize: '15px', fontWeight: 500, color: '#ff4d4f' }}>
            Bạn sắp xóa TẤT CẢ dữ liệu tracking!
          </p>
          <p style={{ marginTop: '12px' }}>
            Hành động này sẽ XÓA VĨNH VIỄN:
          </p>
          <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
            <li>Mục tiêu hiện tại</li>
            <li>Tất cả bản ghi theo dõi hằng ngày</li>
            <li>Lịch sử cân nặng</li>
            <li>Dữ liệu calories, nước uống, tập luyện</li>
            <li>Tất cả kế hoạch bữa ăn</li>
          </ul>
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: '#fff1f0',
            border: '2px solid #ff4d4f',
            borderRadius: '4px'
          }}>
            <p style={{ margin: 0, color: '#ff4d4f', fontWeight: 500 }}>
              ❌ KHÔNG THỂ KHÔI PHỤC SAU KHI XÓA!
            </p>
          </div>
        </div>
      ),
      okText: 'Tôi hiểu, xóa tất cả',
      okType: 'danger',
      cancelText: 'Không, giữ lại',
      width: 500,
      onOk: async () => {
        try {
          setLoading(true);

          // Import APIs
          const { cancelGoal } = await import("../apis/goal");
          const { getProgressHistory, deleteProgressRecord } = await import("../apis/progressTracking");

          // Step 1: Get all progress records for this goal
          const progressRes = await getProgressHistory({ goalId: activeGoal._id, limit: 1000 });

          // Step 2: Delete all progress records
          if (progressRes.success && progressRes.data && progressRes.data.length > 0) {
            const deletePromises = progressRes.data.map(record =>
              deleteProgressRecord(record._id).catch(err => {
                console.error('Error deleting record:', err);
                return null;
              })
            );
            await Promise.all(deletePromises);
          }

          // Step 3: Delete all meal plans (during goal period)
          try {
            const mealPlanDeleteRes = await deleteAllUserMealPlans({
              startDate: activeGoal.startDate,
              endDate: new Date().toISOString().split('T')[0] // Up to today
            });
            console.log('Deleted meal plans:', mealPlanDeleteRes);
          } catch (error) {
            console.error('Error deleting meal plans:', error);
            // Continue even if meal plan deletion fails
          }

          // Step 4: Cancel the goal
          const response = await cancelGoal(activeGoal._id);

          if (response.success) {
            // Reset all state to default
            setActiveGoal(null);
            setGoals([]);
            setTodayProgress(null);
            setProgressHistory([]);
            setProgressStats(null);
            setMealPlan(null); // Reset meal plan state

            // Reset UI stats
            setStats({
              currentWeight: 0,
              targetWeight: 0,
              weightChange: 0,
              currentStreak: 0
            });

            setWeightData({
              labels: [],
              values: [],
              target: []
            });

            setDailyData({
              calories: { current: 0, target: 2000 },
              protein: { current: 0, target: 120 },
              carbs: { current: 0, target: 250 },
              fat: { current: 0, target: 65 }
            });

            setWaterData({
              current: 0,
              target: 8
            });

            setWeeklyData([]);

            message.success({
              content: '✅ Đã xóa mục tiêu và tất cả dữ liệu tracking (bao gồm meal plans)',
              duration: 3
            });

            // Clear localStorage
            localStorage.removeItem('lastDailyCheckIn');
          }
        } catch (error) {
          console.error('Error deleting all data:', error);
          message.error('Không thể xóa dữ liệu. Vui lòng thử lại.');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Block access if not premium - show empty page with modal
  if (user && !isPremium(user)) {
    return (
      <SettingLayout>
        <div className="progress-tracking-container" style={{ textAlign: 'center', padding: '60px 20px', minHeight: '60vh' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ color: '#ffc107', marginBottom: '20px' }}>Tính Năng Premium</h2>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
              Tính năng "Theo Dõi Tiến Độ" yêu cầu tài khoản Premium. Vui lòng nâng cấp để sử dụng.
            </p>
          </div>
        </div>
        <PremiumNotice
          visible={premiumNoticeVisible}
          onCancel={() => {
            setPremiumNoticeVisible(false);
            // Redirect to home if user closes modal
            window.location.href = '/';
          }}
          featureName="Theo Dõi Tiến Độ"
        />
      </SettingLayout>
    );
  }

  return (
    <SettingLayout>
      <div className="progress-tracking-container">
        <PageHeader
          onAddRecord={handleAddRecord}
          onViewHistory={handleViewHistory}
          onCreateGoal={handleCreateGoal}
          onPauseGoal={handlePauseGoal}
          onCancelGoal={handleCancelGoal}
          hasActiveGoal={!!activeGoal}
          goalStatus={activeGoal?.status}
        />

        <StatsOverview stats={stats} />

        {/* Meal Plan Section (Đã giữ lại phần này) */}
        <MealPlanSection
          mealPlan={mealPlan}
          loading={mealPlanLoading}
          onGenerate={handleGenerateMealPlan}
          onRegenerate={handleRegenerateMealPlan}
          activeGoal={activeGoal}
        />

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

        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col xs={24} lg={12}>
            <DailyProgress dailyData={dailyData} />
          </Col>
          <Col xs={24} lg={12}>
            <GoalsSection
              goals={goals}
              onCreateGoal={handleCreateGoal}
              loading={loading}
            />
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col xs={24}>
            <WeeklyOverview weeklyData={weeklyData} />
          </Col>
        </Row>
      </div>

      {/* Daily Check-in Modal */}
      <DailyCheckInModal
        visible={dailyCheckInVisible}
        onCancel={handleDailyCheckInCancel}
        onSubmit={handleDailyCheckInSubmit}
        loading={loading}
        activeGoal={activeGoal}
        lastWeight={getLastWeight()}
        todayProgress={todayProgress}
      />

      {/* Goal Create Modal */}
      <GoalCreateModal
        visible={goalModalVisible}
        onCancel={() => setGoalModalVisible(false)}
        onSubmit={handleGoalSubmit}
        loading={loading}
        currentWeight={userProfile?.profile?.weight || user?.profile?.weight || null}
      />

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
          style={{ marginTop: 20 }}
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
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Nhập cân nặng"
              min={30}
              max={300}
              step={0.1}
            />
          </Form.Item>

          <Form.Item label="Calories tiêu thụ" name="calories">
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Nhập calories"
              min={0}
            />
          </Form.Item>

          <Form.Item label="Số cốc nước" name="waterIntake">
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Số cốc nước đã uống"
              min={0}
              max={20}
            />
          </Form.Item>

          <Form.Item name="exercised" valuePropName="checked">
            <Checkbox>Đã tập luyện hôm nay</Checkbox>
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
              loading={loading}
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

      {/* Premium Notice Modal */}
      <PremiumNotice
        visible={premiumNoticeVisible}
        onCancel={() => setPremiumNoticeVisible(false)}
        featureName="Theo Dõi Tiến Độ"
      />

      {/* History Modal */}
      <Modal
        title="Lịch sử theo dõi"
        open={historyModalVisible}
        onCancel={() => setHistoryModalVisible(false)}
        footer={null}
        width={800}
      >
        <div style={{ padding: 20 }}>
          <p>Danh sách lịch sử theo dõi sẽ được hiển thị ở đây...</p>
        </div>
      </Modal>
    </SettingLayout>
  );
};

export default ProgressTracking;