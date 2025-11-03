import React, { useState, useMemo } from "react";
import { Row, Col, Empty } from "antd";
import AppLayout from "../components/layout/AppLayout";
import ProfileHeader from "../components/User/ProfileHeader";
import ProfileStats from "../components/User/ProfileStats";
import ProfileTabs from "../components/User/ProfileTabs";
import RecipeCard from "../components/User/RecipeCard";
import profileData from "../data/profile.json";
import "./style/Profile.css";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("recipes");
  const [search, setSearch] = useState("");

  // Filter recipes
  const filteredRecipes = useMemo(() => {
    let filtered = [...profileData.recipes];
    if (search) {
      filtered = filtered.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(search.toLowerCase()) ||
          recipe.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    return filtered;
  }, [search]);

  return (
    <AppLayout>
      <div className="profile-page-container">
        <ProfileHeader user={profileData.user} />
        <ProfileStats stats={profileData.stats} />

        <ProfileTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          search={search}
          setSearch={setSearch}
        />

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
              <Empty
                description="Bạn chưa đăng món nào"
                style={{ marginTop: "48px" }}
              />
            )
          ) : (
            <Empty
              description="Chưa có cooksnap nào được chia sẻ"
              style={{ marginTop: "48px" }}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
