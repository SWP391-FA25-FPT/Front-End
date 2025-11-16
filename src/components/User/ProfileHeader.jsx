import React from "react";
import { FaUserEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import guest from "../../assets/guest.png";

const ProfileHeader = ({ user, isOwnProfile = false }) => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    if (!user?._id) return;
    navigate(`/user/${user._id}/edit`);
  };

  const avatar = user?.profile?.profileImageUrl || guest;

  return (
    <div className="profile-header">
      <img src={avatar} alt="Avatar" className="profile-avatar" />
      <div className="profile-info">
        <h2>{user?.name || "Người dùng"}</h2>
        <p className="username">@{user?.username || "..."}</p>
        {isOwnProfile && (
          <button className="edit-btn" onClick={handleEditClick}>
            <FaUserEdit /> Sửa thông tin cá nhân
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
