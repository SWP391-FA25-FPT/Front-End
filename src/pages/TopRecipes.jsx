import React, { useState, useEffect } from "react";
import { Row, Col, Empty, Pagination, Spin, message } from "antd";
import SettingLayout from "../components/layout/SettingLayout";
import PageHeader from "../components/TopMeals/PageHeader";
import FilterBar from "../components/TopMeals/FilterBar";
import MealPlanListCard from "../components/TopMeals/MealPlanListCard";
import SidebarStats from "../components/TopMeals/SidebarStats";
import RankingTable from "../components/TopMeals/RankingTable";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/useAuth";
import { isPremium } from "../utils/premium";
import PremiumNotice from "../components/PremiumNotice";
import { getTopRecipes } from "../apis/recipe";
import "./style/TopMealPlans.css";

const TopRecipes = () => {
  const { user } = useAuth();
  const [premiumNoticeVisible, setPremiumNoticeVisible] = useState(false);
  const [timeRange, setTimeRange] = useState("all");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("views");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mealPlans, setMealPlans] = useState([]);
  const [stats, setStats] = useState({
    totalMealPlans: 0,
    totalViews: 0,
    totalLikes: 0,
    averageRating: 0
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 8,
    pages: 0
  });
  const mealsPerPage = 8;
  const { themeMode } = useTheme();

  // Auto-show premium notice on mount if not premium
  useEffect(() => {
    if (user && !isPremium(user)) {
      setPremiumNoticeVisible(true);
    }
  }, [user]);

  // Fetch data from API
  useEffect(() => {
    const fetchTopRecipes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getTopRecipes({
          category,
          timeRange,
          sortBy,
          page: currentPage,
          limit: mealsPerPage
        });

        if (response.success) {
          setMealPlans(response.data.mealPlans || []);
          setStats(response.data.stats || stats);
          setPagination(response.data.pagination || pagination);
        } else {
          setError(response.error || "Không thể tải dữ liệu");
          message.error(response.error || "Không thể tải dữ liệu");
        }
      } catch (err) {
        console.error("Error fetching top recipes:", err);
        setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu");
        message.error(err.message || "Đã xảy ra lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchTopRecipes();
  }, [category, timeRange, sortBy, currentPage]);

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

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Spin size="large" tip="Đang tải dữ liệu..." />
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Empty
              description={error}
              style={{ marginTop: 48 }}
            />
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {/* Main Content - Left Side */}
            <Col xs={24} lg={16}>
              <div className="meal-plans-list">
                {mealPlans.length > 0 ? (
                  <>
                    {mealPlans.map((mealPlan, index) => (
                      <MealPlanListCard
                        key={mealPlan.id || mealPlan._id}
                        mealPlan={mealPlan}
                        rank={(currentPage - 1) * mealsPerPage + index + 1}
                      />
                    ))}

                    {/* Pagination */}
                    <div className="pagination-wrapper">
                      <Pagination
                        current={currentPage}
                        total={pagination.total}
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
                <SidebarStats stats={stats} />
                <RankingTable mealPlans={mealPlans} />
              </div>
            </Col>
          </Row>
        )}
      </div>
      <PremiumNotice
        visible={premiumNoticeVisible}
        onCancel={() => setPremiumNoticeVisible(false)}
        featureName="Top Thực Đơn Xem Nhiều Nhất"
      />
    </SettingLayout>
  );
};

export default TopRecipes;

