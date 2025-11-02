import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/AppLayout";
import CardPopular from "../components/CardPopular/CardPopular.jsx";
import CardRecent from "../components/CardRecent/CardRecent.jsx";
import Card from "../components/Card/Card.jsx";
import SearchResultCard from "../components/SearchResultCard/SearchResultCard.jsx";
import ListPremium from "../data/ListPremium.json";
import { Typography, Space, Spin, message, Modal, Button } from "antd";
import { Icon } from "@iconify/react";
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fullRecentRecipes, setFullRecentRecipes] = useState([]);
  const [loadingFullRecent, setLoadingFullRecent] = useState(false);

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
        // Refresh recent recipes list to reflect the update
        // (recipe clicked will move to top, duplicates removed)
        const response = await getRecentlyViewed(6);
        if (response.success) {
          setRecentRecipes(response.data);
        }
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

  // Handle open modal for full recent recipes list
  const handleViewAllRecent = async () => {
    setIsModalVisible(true);
    
    // Fetch full list if not already loaded or if list might have changed
    if (fullRecentRecipes.length === 0 || fullRecentRecipes.length < 50) {
      try {
        setLoadingFullRecent(true);
        const response = await getRecentlyViewed(50);
        if (response.success) {
          setFullRecentRecipes(response.data);
        }
      } catch (error) {
        console.error("Error fetching full recent recipes:", error);
        message.error("Không thể tải danh sách đầy đủ");
      } finally {
        setLoadingFullRecent(false);
      }
    }
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  // Handle recipe click from modal
  const handleRecipeClickFromModal = async (recipeId) => {
    // Track view history if user is logged in
    if (user) {
      try {
        await addViewHistory(recipeId, 'desktop');
        // Refresh both lists to reflect the update
        const [shortResponse, fullResponse] = await Promise.all([
          getRecentlyViewed(6),
          getRecentlyViewed(50)
        ]);
        if (shortResponse.success) {
          setRecentRecipes(shortResponse.data);
        }
        if (fullResponse.success) {
          setFullRecentRecipes(fullResponse.data);
        }
      } catch (error) {
        console.error("Error tracking view:", error);
      }
    }
    
    // Close modal first
    setIsModalVisible(false);
    // Then navigate
    navigate(`/recipe/${recipeId}`);
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <Title level={3} style={{ margin: 0 }}>Món Bạn Mới Xem Gần Đây</Title>
                  {recentRecipes.length > 0 && (
                    <Button
                      type="text"
                      icon={<Icon icon="mdi:arrow-right" width={24} />}
                      onClick={handleViewAllRecent}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px',
                        width: '32px',
                        height: '32px',
                        color: '#595959'
                      }}
                    />
                  )}
                </div>
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

      {/* Modal for Full Recent Recipes List */}
      <Modal
        title="Món Bạn Mới Xem Gần Đây"
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
        style={{ top: 20 }}
      >
        <div style={{ maxHeight: '70vh', overflowY: 'auto', padding: '8px' }}>
          {loadingFullRecent ? (
            <div className="text-center py-5">
              <Spin size="large" tip="Đang tải...">
                <div style={{ minHeight: '200px' }}></div>
              </Spin>
            </div>
          ) : fullRecentRecipes.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {fullRecentRecipes.map((recipe) => (
                <SearchResultCard
                  key={recipe._id}
                  recipe={recipe}
                  layout="horizontal"
                  onClick={() => handleRecipeClickFromModal(recipe._id)}
                />
              ))}
            </div>
          ) : recentRecipes.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentRecipes.map((recipe) => (
                <SearchResultCard
                  key={recipe._id}
                  recipe={recipe}
                  layout="horizontal"
                  onClick={() => handleRecipeClickFromModal(recipe._id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-5 text-muted">
              Bạn chưa xem recipe nào gần đây
            </div>
          )}
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default HomePage;
