import React from "react";
import { FaHeart, FaUserFriends, FaBookOpen } from "react-icons/fa";

const ProfileStats = ({ stats }) => {
    return (
        <div className="profile-stats-bar">
            <div>
                <FaUserFriends className="icon" />
                <p>{stats.friends} bạn bếp</p>
            </div>
            <div>
                <FaHeart className="icon" />
                <p>{stats.followers} người quan tâm</p>
            </div>
            <div>
                <FaBookOpen className="icon" />
                <p>{stats.recipes} món đã đăng</p>
            </div>
        </div>
    );
};

export default ProfileStats;

