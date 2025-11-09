import React from "react";
import { Input } from "antd";

const ProfileTabs = ({ activeTab, setActiveTab, search, setSearch }) => {
  return (
    <div className="profile-tabs">
      <div className="tab-buttons">
        <button
          className={activeTab === "recipes" ? "active-tab" : ""}
          onClick={() => setActiveTab("recipes")}
        >
          Món của tôi
        </button>
        <button
          className={activeTab === "cooksnaps" ? "active-tab" : ""}
          onClick={() => setActiveTab("cooksnaps")}
        >
          Cooksnap
        </button>
      </div>

      {activeTab === "recipes" && (
        <Input
          placeholder="Tìm món ăn của bạn..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="profile-search"
        />
      )}
    </div>
  );
};

export default ProfileTabs;
