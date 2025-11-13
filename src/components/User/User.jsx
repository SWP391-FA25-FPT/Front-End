import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import Dropdown from "antd/es/dropdown/dropdown";

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

  const items = [
    {
      key: "1",
      label: "Hồ sơ",
      onClick: () => navigate('/profile'),
    },
    {
      key: "2",
      label: "Cài đặt", 
      onClick: () => navigate('/settings'),
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
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="user"
            className="w-10 h-10 rounded-circle"
          />
        </a>
      </Dropdown>
    </React.Fragment>
  );
};

export default Index;