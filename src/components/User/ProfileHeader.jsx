import React from "react";
import { FaUserEdit } from "react-icons/fa";

const ProfileHeader = ({ user }) => {
  return (
    <div className="profile-header">
      <img src={user.avatar} alt="Avatar" className="profile-avatar" />
      <div className="profile-info">
        <h2>{user.name}</h2>
        <p className="username">@{user.username}</p>
        <button className="edit-btn">
          <FaUserEdit /> Sửa thông tin cá nhân
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
