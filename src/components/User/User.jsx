import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import Dropdown from "antd/es/dropdown/dropdown";
import guest from "../../assets/guest.png";

const Index = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const profilePath = user?._id ? `/user/${user._id}` : "/";
  const profileEditPath = user?._id ? `/user/${user._id}/edit` : "/";

  // Lấy ảnh đại diện: ưu tiên từ API/Google, nếu không có thì dùng ảnh mặc định
  const avatarUrl = user?.profile?.profileImageUrl || guest;

  const items = [
    {
      key: "1",
      label: "Hồ sơ",
      onClick: () => navigate(profilePath),
    },
    {
      key: "2",
      label: "Cài đặt",
      onClick: () => navigate(profileEditPath),
    },
    {
      key: "3",
      label: "Đăng xuất",
      onClick: handleLogout,
      danger: true, 
    },
  ];

  return (
    <React.Fragment>
      <Dropdown trigger={["click"]} menu={{ items }}>
        <a>
          <img
            src={avatarUrl}
            alt="user"
            className="w-10 h-10 rounded-circle"
            onError={(e) => {
              // Nếu ảnh từ API/Google không load được, fallback về ảnh mặc định
              if (e.target.src !== guest) {
                e.target.src = guest;
              }
            }}
          />
        </a>
      </Dropdown>
    </React.Fragment>
  );
};

export default Index;