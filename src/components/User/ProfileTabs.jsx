import React from "react";
import { Input } from "antd";

const ProfileTabs = ({
  activeTab,
  onTabChange,
  recipeSearch,
  onRecipeSearchChange,
  savedSearch,
  onSavedSearchChange,
  showSaved = false,
}) => {
  return (
    <div className="profile-tabs">
      <div className="tab-buttons">
        <button
          className={activeTab === "recipes" ? "active-tab" : ""}
          onClick={() => onTabChange("recipes")}
        >
          Món đã đăng
        </button>
        {showSaved && (
          <button
            className={activeTab === "saved" ? "active-tab" : ""}
            onClick={() => onTabChange("saved")}
          >
            Món đã lưu
          </button>
        )}
      </div>

      {activeTab === "recipes" && (
        <Input
          placeholder="Tìm món đã đăng..."
          value={recipeSearch}
          onChange={(e) => onRecipeSearchChange(e.target.value)}
          className="profile-search"
        />
      )}

      {activeTab === "saved" && showSaved && (
        <Input
          placeholder="Tìm trong danh sách đã lưu..."
          value={savedSearch}
          onChange={(e) => onSavedSearchChange(e.target.value)}
          className="profile-search"
        />
      )}
    </div>
  );
};

export default ProfileTabs;
