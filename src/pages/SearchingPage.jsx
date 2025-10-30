import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Tabs, Spin, Empty, Typography, message, ConfigProvider } from "antd";
import { Icon } from "@iconify/react";
import SearchingLayout from "../components/layout/SearchingLayout";
import SearchResultCard from "../components/SearchResultCard/Index";
import VerifiedCarousel from "../components/VerifiedCarousel/Index";
import SearchFilter from "../components/SearchFilter/Index";
import { searchRecipes } from "../apis/recipe";
import { addViewHistory } from "../apis/analytics";
import { useAuth } from "../context/useAuth";
import "./style/SearchingPage.css";

const { Title } = Typography;

// Lấy màu từ CSS variables
const getCSSVariable = (variable) => {
  if (typeof window !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  }
  return '';
};

const SearchingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [recipes, setRecipes] = useState([]);
  const [verifiedRecipes, setVerifiedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  // Lấy màu từ CSS variables
  const primaryColor = getCSSVariable('--primary-selected-color') || '#f93';
  const hoverColor = getCSSVariable('--primary-hover-color') || '#000';
  const activeColor = getCSSVariable('--primary-hover-color') || '#000';

  const performSearch = useCallback(async (keyword) => {
    try {
      setLoading(true);
      const response = await searchRecipes(keyword, {
        page: 1,
        limit: 20,
        sortBy: activeTab === "popular" ? "views" : "createdAt"
      });

      if (response.success) {
        setRecipes(response.data || []);
        setVerifiedRecipes(response.verifiedRecipes || []);
        setPagination(response.pagination || {});
      }
    } catch (error) {
      console.error("Search error:", error);
      message.error("Không thể tìm kiếm công thức. Vui lòng thử lại!");
      setRecipes([]);
      setVerifiedRecipes([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  // Get keyword from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const keyword = params.get("q");
    setSearchQuery(keyword || "");
    
    if (keyword) {
      performSearch(keyword);
    }
  }, [location.search, performSearch]);

  // Handle tab change (Mới nhất / Phổ biến)
  const handleTabChange = (key) => {
    setActiveTab(key);
    // Re-fetch with new sort order
    if (searchQuery) {
      performSearch(searchQuery);
    }
  };

  // Sort recipes based on active tab (frontend sorting)
  const getSortedRecipes = () => {
    if (!recipes || recipes.length === 0) return [];
    
    const sorted = [...recipes];
    if (activeTab === "popular") {
      return sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else {
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  // Handle recipe click
  const handleRecipeClick = async (recipeId) => {
    // Track view history if user is logged in
    if (user) {
      try {
        await addViewHistory(recipeId, "desktop");
      } catch (error) {
        console.error("Error tracking view:", error);
      }
    }
    
    // Navigate to recipe detail page (you'll need to create this route)
    navigate(`/recipe/${recipeId}`);
  };

  const sortedRecipes = getSortedRecipes();

  const tabItems = [
    {
      key: "newest",
      label: (
        <span style={{ fontSize: "16px", fontWeight: activeTab === "newest" ? "600" : "400" }}>
          Mới nhất
        </span>
      )
    },
    {
      key: "popular",
      label: (
        <span style={{ fontSize: "16px", fontWeight: activeTab === "popular" ? "600" : "400" }}>
          Phổ biến
        </span>
      )
    }
  ];

  return (
    <SearchingLayout>
      <Container className="py-4 searching-page">
        {loading ? (
          <div className="text-center py-5">
            <Spin size="large" tip="Đang tìm kiếm...">
              <div style={{ minHeight: "300px" }}></div>
            </Spin>
          </div>
        ) : (
          <>
            {/* Tabs for Newest / Popular - Full Width */}
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: primaryColor,
                  colorPrimaryHover: hoverColor,
                  colorPrimaryActive: activeColor,
                },
                components: {
                  Tabs: {
                    inkBarColor: primaryColor,
                    itemActiveColor: primaryColor,
                    itemHoverColor: hoverColor,
                    itemSelectedColor: primaryColor,
                  }
                }
              }}
            >
              <Tabs
                activeKey={activeTab}
                items={tabItems}
                onChange={handleTabChange}
                className="search-tabs mb-3"
                style={{ marginTop: "-8px" }}
              />
            </ConfigProvider>

            {/* Main Layout with Flex */}
            <div className="search-layout-flex">
              {/* Main Content - Left Side */}
              <div className="search-content-main">
                {/* Search Results Header */}
                {searchQuery && (
                  <div className="search-header mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <Title level={2} style={{ margin: 0, fontSize: "28px", fontWeight: "700" }}>
                        {searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1)}
                      </Title>
                      {pagination.total > 0 && (
                        <Typography.Text type="secondary" style={{ fontSize: "18px" }}>
                          ({pagination.total.toLocaleString()})
                        </Typography.Text>
                      )}
                    </div>
                  </div>
                )}

                {/* Verified Notice */}
                {verifiedRecipes && verifiedRecipes.length > 0 && (
                  <div className="verified-notice mb-3 d-flex align-items-center gap-2" 
                       style={{ 
                         padding: "8px 12px", 
                         backgroundColor: "#fff7e6",
                         borderRadius: "6px",
                         border: "1px solid #ffd591"
                       }}>
                    <Icon icon="mdi:crown" width="18" style={{ color: "#faad14" }} />
                    <Typography.Text style={{ fontSize: "14px", color: "#ad6800" }}>
                      Món <strong>'{searchQuery}'</strong> đã được kiểm chứng
                    </Typography.Text>
                  </div>
                )}

                {/* Verified Recipes Carousel */}
                {verifiedRecipes && verifiedRecipes.length > 0 && (
                  <div className="mb-4">
                    <VerifiedCarousel 
                      recipes={verifiedRecipes}
                      onRecipeClick={handleRecipeClick}
                    />
                  </div>
                )}

                {/* Search Results List */}
                {sortedRecipes.length > 0 ? (
                  <div className="search-results-list">
                    {sortedRecipes.map((recipe) => (
                      <SearchResultCard 
                        key={recipe._id}
                        recipe={recipe}
                        onClick={() => handleRecipeClick(recipe._id)}
                        layout="horizontal"
                      />
                    ))}
                  </div>
                ) : (
                  <Empty
                    description={
                      <span>
                        Không tìm thấy công thức nào cho "{searchQuery}"
                        <br />
                        <Typography.Text type="secondary" style={{ fontSize: "14px" }}>
                          Thử tìm kiếm với từ khóa khác hoặc xem các từ khóa thịnh hành bên phải
                        </Typography.Text>
                      </span>
                    }
                    style={{ padding: "60px 20px" }}
                  />
                )}
              </div>

              {/* Filter Sidebar - Right Side */}
              <div className="search-filter-wrapper">
                <SearchFilter />
              </div>
            </div>
          </>
        )}
      </Container>
    </SearchingLayout>
  );
};

export default SearchingPage;

