import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  Row,
  Col,
  Empty,
  Spin,
  message,
  Modal,
  List,
  Avatar,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import ProfileHeader from "../components/User/ProfileHeader";
import ProfileStats from "../components/User/ProfileStats";
import ProfileTabs from "../components/User/ProfileTabs";
import SearchResultCard from "../components/SearchResultCard/SearchResultCard";
import { getProfile } from "../apis/user";
import { useAuth } from "../context/useAuth";
import guest from "../assets/guest.png";

import "./style/Profile.css";

const Profile = () => {
  const { user: authUser } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("recipes");
  const [recipeSearch, setRecipeSearch] = useState("");
  const [savedSearch, setSavedSearch] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [friendsModalOpen, setFriendsModalOpen] = useState(false);
  const [followersModalOpen, setFollowersModalOpen] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      message.error("Không tìm thấy người dùng");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getProfile(userId);
      setProfileData(data);
    } catch (err) {
      console.error(err);
      message.error(
        err?.message || err?.error || "Không thể tải dữ liệu người dùng"
      );
      setProfileData(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    setProfileData(null);
    setActiveTab("recipes");
    setRecipeSearch("");
    setSavedSearch("");
    fetchProfile();
  }, [fetchProfile]);

  const filteredRecipes = useMemo(() => {
    const recipes = profileData?.recipes || [];
    const keyword = recipeSearch.trim().toLowerCase();
    if (!keyword) return recipes;
    return recipes.filter((recipe) => {
      const nameMatch = recipe.name
        ?.toLowerCase()
        .includes(keyword);
      const descMatch = recipe.description
        ?.toLowerCase()
        .includes(keyword);
      const tagMatch = Array.isArray(recipe.tags)
        ? recipe.tags.some((tag) =>
            tag?.toLowerCase().includes(keyword)
          )
        : false;
      return nameMatch || descMatch || tagMatch;
    });
  }, [profileData?.recipes, recipeSearch]);

  const filteredSavedRecipes = useMemo(() => {
    const saved = profileData?.savedRecipes || [];
    const keyword = savedSearch.trim().toLowerCase();
    if (!keyword) return saved;
    return saved.filter((recipe) => {
      const nameMatch = recipe.name
        ?.toLowerCase()
        .includes(keyword);
      const descMatch = recipe.description
        ?.toLowerCase()
        .includes(keyword);
      const authorMatch = recipe.author
        ?.toLowerCase()
        .includes(keyword);
      return nameMatch || descMatch || authorMatch;
    });
  }, [profileData?.savedRecipes, savedSearch]);

  const handleSaveChange = useCallback(
    (recipeId, isSaved) => {
      setProfileData((prev) => {
        if (!prev || !prev.isOwnProfile) return prev;

        const currentSaved = prev.savedRecipes || [];

        if (!isSaved) {
          return {
            ...prev,
            savedRecipes: currentSaved.filter(
              (item) => item._id !== recipeId
            ),
          };
        }

        const alreadyHas = currentSaved.some(
          (item) => item._id === recipeId
        );
        if (alreadyHas) return prev;

        const recipeToAdd =
          prev.recipes?.find((item) => item._id === recipeId) ||
          null;

        if (!recipeToAdd) {
          return prev;
        }

        return {
          ...prev,
          savedRecipes: [recipeToAdd, ...currentSaved],
        };
      });
    },
    []
  );

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  const isOwnProfile =
    !!profileData &&
    (profileData.isOwnProfile ||
      authUser?._id === profileData?.user?._id);

  useEffect(() => {
    if (!isOwnProfile && activeTab === "saved") {
      setActiveTab("recipes");
    }
  }, [isOwnProfile, activeTab]);

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

  if (!profileData) {
    return (
      <AppLayout>
        <div
          className="profile-page-container"
          style={{ textAlign: "center", padding: 80 }}
        >
          <Empty description="Không tìm thấy người dùng" />
        </div>
      </AppLayout>
    );
  }

  const friendsList = profileData?.friends || [];
  const followersList = profileData?.followers || [];

  return (
    <AppLayout>
      <div className="profile-page-container">
        <ProfileHeader
          user={profileData?.user || {}}
          isOwnProfile={isOwnProfile}
        />

        <ProfileStats
          stats={profileData?.stats || {}}
          onShowFriends={() => setFriendsModalOpen(true)}
          onShowFollowers={() => setFollowersModalOpen(true)}
        />

        <ProfileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          recipeSearch={recipeSearch}
          onRecipeSearchChange={setRecipeSearch}
          savedSearch={savedSearch}
          onSavedSearchChange={setSavedSearch}
          showSaved={isOwnProfile}
        />

        <div className="profile-content">
          {activeTab === "recipes" ? (
            filteredRecipes.length > 0 ? (
              <Row gutter={[24, 24]}>
                {filteredRecipes.map((recipe) => (
                  <Col
                    xs={24}
                    sm={12}
                    lg={8}
                    xl={6}
                    key={recipe._id}
                  >
                    <SearchResultCard
                      recipe={recipe}
                      layout="vertical"
                      onClick={() => handleRecipeClick(recipe._id)}
                      onSaveChange={handleSaveChange}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty
                description="Chưa có món nào được chia sẻ"
                style={{ marginTop: 48 }}
              />
            )
          ) : filteredSavedRecipes.length > 0 ? (
            <Row gutter={[24, 24]}>
              {filteredSavedRecipes.map((recipe) => (
                <Col
                  xs={24}
                  sm={12}
                  lg={8}
                  xl={6}
                  key={recipe._id}
                >
                  <SearchResultCard
                    recipe={recipe}
                    layout="vertical"
                    onClick={() => handleRecipeClick(recipe._id)}
                    onSaveChange={handleSaveChange}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <Empty
              description="Bạn chưa lưu món nào"
              style={{ marginTop: 48 }}
            />
          )}
        </div>
      </div>

      <Modal
        open={friendsModalOpen}
        onCancel={() => setFriendsModalOpen(false)}
        footer={null}
        title="Danh sách bạn bếp"
        width={480}
      >
        {friendsList.length === 0 ? (
          <Empty description="Chưa có bạn bếp nào" />
        ) : (
          <List
            dataSource={friendsList}
            renderItem={(friend) => (
              <List.Item
                key={friend._id}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setFriendsModalOpen(false);
                  navigate(`/user/${friend._id}`);
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={friend.avatar || guest}
                      alt={friend.name}
                    />
                  }
                  title={friend.name || "Người dùng"}
                  description={
                    friend.username
                      ? `@${friend.username}`
                      : friend.email
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Modal>

      <Modal
        open={followersModalOpen}
        onCancel={() => setFollowersModalOpen(false)}
        footer={null}
        title="Người quan tâm"
        width={480}
      >
        {followersList.length === 0 ? (
          <Empty description="Chưa có người quan tâm" />
        ) : (
          <List
            dataSource={followersList}
            renderItem={(follower) => (
              <List.Item
                key={follower._id}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setFollowersModalOpen(false);
                  navigate(`/user/${follower._id}`);
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={follower.avatar || guest}
                      alt={follower.name}
                    />
                  }
                  title={follower.name || "Người dùng"}
                  description={
                    follower.username
                      ? `@${follower.username}`
                      : follower.email
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Modal>
    </AppLayout>
  );
};

export default Profile;