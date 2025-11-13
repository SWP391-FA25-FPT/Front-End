import React from "react";
import { FaHeart, FaUserFriends, FaBookOpen } from "react-icons/fa";

const ProfileStats = ({
  stats = {},
  onShowFriends,
  onShowFollowers,
}) => {
  const { friends = 0, followers = 0, recipes = 0 } = stats;

  const handleKeyDown = (event, handler) => {
    if (!handler) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handler();
    }
  };

  const clickableClass = (handler) =>
    handler ? "profile-stat-clickable" : "";

  return (
    <div className="profile-stats-bar">
      <div
        className={clickableClass(onShowFriends)}
        role={onShowFriends ? "button" : undefined}
        tabIndex={onShowFriends ? 0 : undefined}
        onClick={() => onShowFriends?.()}
        onKeyDown={(event) => handleKeyDown(event, onShowFriends)}
      >
        <FaUserFriends className="icon" />
        <p>{friends} bạn bếp</p>
      </div>
      <div
        className={clickableClass(onShowFollowers)}
        role={onShowFollowers ? "button" : undefined}
        tabIndex={onShowFollowers ? 0 : undefined}
        onClick={() => onShowFollowers?.()}
        onKeyDown={(event) => handleKeyDown(event, onShowFollowers)}
      >
        <FaHeart className="icon" />
        <p>{followers} người quan tâm</p>
      </div>
      <div>
        <FaBookOpen className="icon" />
        <p>{recipes} món đã đăng</p>
      </div>
    </div>
  );
};

export default ProfileStats;
