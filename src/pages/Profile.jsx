import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, Empty, Spin, message } from "antd";
import AppLayout from "../components/layout/AppLayout";
import ProfileHeader from "../components/User/ProfileHeader";
import ProfileStats from "../components/User/ProfileStats";
import ProfileTabs from "../components/User/ProfileTabs";
import RecipeCard from "../components/User/RecipeCard";

import { getProfile } from "../apis/user"; // API helper

import "./style/Profile.css";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("recipes");
  const [search, setSearch] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1️⃣ Fetch profile từ backend khi mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();

        // Fallback cho recipes và user
        setProfileData({
          user: data || {},      // lấy trực tiếp object API trả về
          stats: data.stats || {},
          recipes: data.recipes || [],
        });

      } catch (err) {
        console.error(err);
        message.error("Không thể tải dữ liệu người dùng");
        setProfileData({ user: {}, stats: {}, recipes: [] }); // fallback trống
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // 2️⃣ Filter recipes theo search
  const filteredRecipes = useMemo(() => {
    if (!profileData?.recipes) return [];
    let filtered = [...profileData.recipes];
    if (search) {
      filtered = filtered.filter(
        (recipe) =>
          recipe.title?.toLowerCase().includes(search.toLowerCase()) ||
          recipe.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
    return filtered;
  }, [search, profileData]);

  // 3️⃣ Loading state
  if (loading) {
    return (
      <AppLayout>
        <div
          className="profile-page-container"
          style={{ textAlign: "center", padding: 100 }}
        >
          <Spin size="large" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="profile-page-container">
        {/* ProfileHeader luôn nhận user (fallback {}) */}
        <ProfileHeader user={profileData?.user || {}} />

        {/* ProfileStats luôn nhận stats (fallback {}) */}
        <ProfileStats stats={profileData?.stats || {}} />

        {/* Tabs */}
        <ProfileTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          search={search}
          setSearch={setSearch}
        />

        {/* Content */}
        <div className="profile-content">
          {activeTab === "recipes" ? (
            filteredRecipes.length > 0 ? (
              <Row gutter={[24, 24]}>
                {filteredRecipes.map((recipe) => (
                  <Col xs={24} sm={12} lg={8} xl={6} key={recipe.id}>
                    <RecipeCard recipe={recipe} />
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty description="Bạn chưa đăng món nào" style={{ marginTop: 48 }} />
            )
          ) : (
            <Empty
              description="Chưa có cooksnap nào được chia sẻ"
              style={{ marginTop: 48 }}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
