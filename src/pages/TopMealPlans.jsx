import React, { useState, useMemo } from "react";
import { Row, Col, Empty, Pagination } from "antd";
import SettingLayout from "../components/layout/SettingLayout";
import PageHeader from "../components/TopMeals/PageHeader";
import FilterBar from "../components/TopMeals/FilterBar";
import MealPlanListCard from "../components/TopMeals/MealPlanListCard";
import SidebarStats from "../components/TopMeals/SidebarStats";
import RankingTable from "../components/TopMeals/RankingTable";
import topMealPlansData from "../data/topMealPlans.json";
import "./style/TopMealPlans.css";

const TopMealPlans = () => {
  const [timeRange, setTimeRange] = useState("all");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("views");
  const [currentPage, setCurrentPage] = useState(1);
  const mealsPerPage = 8;

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

  return (
    <SettingLayout>
      <div className="top-meal-plans-container">
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
                  style={{ marginTop: "48px" }}
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
    </SettingLayout>
  );
};

export default TopMealPlans;
