import React, { useState, useMemo, useEffect } from "react";
import { Row, Col, Empty, Pagination, Button } from "antd";
import SettingLayout from "../components/layout/SettingLayout";
import PageHeader from "../components/TopMeals/PageHeader";
import FilterBar from "../components/TopMeals/FilterBar";
import MealPlanListCard from "../components/TopMeals/MealPlanListCard";
import SidebarStats from "../components/TopMeals/SidebarStats";
import RankingTable from "../components/TopMeals/RankingTable";
import { useTheme } from "../context/ThemeContext"; // BỔ SUNG: Import useTheme
import { useAuth } from "../context/useAuth";
import { isPremium } from "../utils/premium";
import PremiumNotice from "../components/PremiumNotice";
import topMealPlansData from "../data/topMealPlans.json";
import "./style/TopMealPlans.css";

const TopMealPlans = () => {
  const { user } = useAuth();
  const [premiumNoticeVisible, setPremiumNoticeVisible] = useState(false);

  // Auto-show premium notice on mount if not premium
  useEffect(() => {
    if (user && !isPremium(user)) {
      setPremiumNoticeVisible(true);
    }
  }, [user]);
  const [timeRange, setTimeRange] = useState("all");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("views");
  const [currentPage, setCurrentPage] = useState(1);
  const mealsPerPage = 8;
  const { themeMode } = useTheme(); // BỔ SUNG: Lấy themeMode

  // Filter and sort meal plans
  const filteredAndSortedMealPlans = useMemo(() => {
    let filtered = [...topMealPlansData.mealPlans];

    // Filter by category
    if (category !== "all") {
      filtered = filtered.filter((plan) => plan.category === category);
    }

    // Filter by time range (mock - in real app would use actual dates)
    // For demo, we'll just use all data

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "views":
          return b.views - a.views;
        case "likes":
          return b.likes - a.likes;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [category, timeRange, sortBy]);

  // Pagination calculations
  const totalMeals = filteredAndSortedMealPlans.length;
  const startIndex = (currentPage - 1) * mealsPerPage;
  const currentMeals = filteredAndSortedMealPlans.slice(
    startIndex,
    startIndex + mealsPerPage
  );

  // Reset to page 1 when filters change
  const handleFilterChange = (filterType, value) => {
    setCurrentPage(1);
    switch (filterType) {
      case "timeRange":
        setTimeRange(value);
        break;
      case "category":
        setCategory(value);
        break;
      case "sortBy":
        setSortBy(value);
        break;
      default:
        break;
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Block access if not premium - show empty page with modal
  if (user && !isPremium(user)) {
    return (
      <SettingLayout>
        <div style={{ textAlign: 'center', padding: '60px 20px', minHeight: '60vh' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ color: '#ffc107', marginBottom: '20px' }}>Tính Năng Premium</h2>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
              Tính năng "Top Thực Đơn Xem Nhiều Nhất" yêu cầu tài khoản Premium. Vui lòng nâng cấp để sử dụng.
            </p>
          </div>
        </div>
        <PremiumNotice
          visible={premiumNoticeVisible}
          onCancel={() => {
            setPremiumNoticeVisible(false);
            window.location.href = '/';
          }}
          featureName="Top Thực Đơn Xem Nhiều Nhất"
        />
      </SettingLayout>
    );
  }

  return (
    <SettingLayout>
      <div
        className="top-meal-plans-container"
        // BỔ SUNG: Áp dụng màu nền body và màu chữ
        style={{
          backgroundColor: themeMode === "dark" ? "var(--color-bg-body)" : undefined,
          color: "var(--color-text-primary)",
        }}
      >
        <PageHeader />

        <FilterBar
          timeRange={timeRange}
          setTimeRange={(value) => handleFilterChange("timeRange", value)}
          category={category}
          setCategory={(value) => handleFilterChange("category", value)}
          sortBy={sortBy}
          setSortBy={(value) => handleFilterChange("sortBy", value)}
        />

        <Row gutter={[24, 24]}>
          {/* Main Content - Left Side */}
          <Col xs={24} lg={16}>
            <div className="meal-plans-list">
              {currentMeals.length > 0 ? (
                <>
                  {currentMeals.map((mealPlan, index) => (
                    <MealPlanListCard
                      key={mealPlan.id}
                      mealPlan={mealPlan}
                      rank={startIndex + index + 1}
                    />
                  ))}

                  {/* Pagination */}
                  <div className="pagination-wrapper">
                    <Pagination
                      current={currentPage}
                      total={totalMeals}
                      pageSize={mealsPerPage}
                      onChange={handlePageChange}
                      showSizeChanger={false}
                      showTotal={(total, range) =>
                        `${range[0]}-${range[1]} của ${total} thực đơn`
                      }
                    />
                  </div>
                </>
              ) : (
                <Empty
                  description="Không tìm thấy thực đơn nào"
                  style={{ marginTop: 48 }}
                />
              )}
            </div>
          </Col>

          {/* Sidebar - Right Side */}
          <Col xs={24} lg={8}>
            <div className="sidebar-sticky">
              <SidebarStats stats={topMealPlansData.stats} />
              <RankingTable mealPlans={filteredAndSortedMealPlans} />
            </div>
          </Col>
        </Row>
      </div>
      <PremiumNotice
        visible={premiumNoticeVisible}
        onCancel={() => setPremiumNoticeVisible(false)}
        featureName="Top Thực Đơn Xem Nhiều Nhất"
      />
    </SettingLayout>
  );
};

export default TopMealPlans;
