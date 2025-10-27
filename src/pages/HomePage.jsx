import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/AppLayout";
import CardPopular from "../components/CardPopular/Index";
import CardRecent from "../components/CardRecent/Index";
import Card from "../components/Card/Index";
import ListPremium from "../data/ListPremium.json";
import { Typography, Space, Spin, message } from "antd";
import { Container } from "react-bootstrap";
import { getTrendingTags, getRecentlyViewed, addViewHistory } from "../apis/analytics";
import { useAuth } from "../context/useAuth";

const { Title } = Typography;

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [trendingTags, setTrendingTags] = useState([]);
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);

  // Fetch trending tags
  useEffect(() => {
    const fetchTrendingTags = async () => {
      try {
        setLoadingTrending(true);
        const response = await getTrendingTags(8);
        if (response.success) {
          setTrendingTags(response.data);
        }
      } catch (error) {
        console.error("Error fetching trending tags:", error);
        message.error("Không thể tải trending tags");
      } finally {
        setLoadingTrending(false);
      }
    };

    fetchTrendingTags();
  }, []);

  // Fetch recently viewed recipes (only if user is logged in)
  useEffect(() => {
    const fetchRecentRecipes = async () => {
      if (!user) {
        setLoadingRecent(false);
        return;
      }

      try {
        setLoadingRecent(true);
        const response = await getRecentlyViewed(6);
        if (response.success) {
          setRecentRecipes(response.data);
        }
      } catch (error) {
        console.error("Error fetching recent recipes:", error);
      } finally {
        setLoadingRecent(false);
      }
    };

    fetchRecentRecipes();
  }, [user]);

  // Handle recipe click
  const handleRecipeClick = async (recipeId) => {
    // Track view history if user is logged in
    if (user) {
      try {
        await addViewHistory(recipeId, 'desktop');
      } catch (error) {
        console.error("Error tracking view:", error);
      }
    }
    
    // Navigate to recipe detail page
    navigate(`/recipe/${recipeId}`);
  };

  // Handle trending tag click - navigate to search page
  const handleTrendingTagClick = (tagName) => {
    navigate(`/search?q=${encodeURIComponent(tagName)}`);
  };

  return (
    <React.Fragment>
      <Layout>
        <Container className="py-4">
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* Trending Tags Section */}
            <div>
              <Title level={3}>Từ Khóa Thịnh Hành</Title>
              {loadingTrending ? (
                <div className="text-center py-5">
                  <Spin size="large" tip="Đang tải...">
                    <div style={{ minHeight: '200px' }}></div>
                  </Spin>
                </div>
              ) : trendingTags.length > 0 ? (
                <div className="row g-4 py-2">
                  {trendingTags.map((tag, index) => (
                    <div key={index} className="col-12 col-sm-6 col-lg-3">
                      <div onClick={() => handleTrendingTagClick(tag.name)} style={{ cursor: 'pointer' }}>
                        <CardPopular 
                          title={tag.name} 
                          src={tag.image} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted">
                  Chưa có dữ liệu trending tags
                </div>
              )}
            </div>

            {/* Recently Viewed Section - Only show if user is logged in */}
            {user && (
              <div>
                <Title level={3}>Món Bạn Mới Xem Gần Đây</Title>
                {loadingRecent ? (
                  <div className="text-center py-5">
                    <Spin size="large" tip="Đang tải...">
                      <div style={{ minHeight: '200px' }}></div>
                    </Spin>
                  </div>
                ) : recentRecipes.length > 0 ? (
                  <div className="row g-4 py-2">
                    {recentRecipes.slice(0, 6).map((recipe, index) => (
                      <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
                        <div onClick={() => handleRecipeClick(recipe._id)} style={{ cursor: 'pointer' }}>
                          <CardRecent
                            title={recipe.name}
                            src={recipe.image}
                            avatar={recipe.image}
                            userName={recipe.author}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted">
                    Bạn chưa xem recipe nào gần đây
                  </div>
                )}
              </div>
            )}

            {/* Premium Features Section - Keep static data */}
            <div>
              <Title level={3}>Gói Premium</Title>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                padding: '8px 0'
              }}>
                {ListPremium.premiumFeatures.slice(0, 5).map((item, index) => (
                  <div key={index} style={{ height: '100%' }}>
                    <div style={{ height: '100%', display: 'flex' }}>
                      <Card
                        title={item.title}
                        src={item.image}
                        description={item.description}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Space>
        </Container>
      </Layout>
    </React.Fragment>
  );
};

export default HomePage;
