import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import Dropdown from "antd/es/dropdown/dropdown";

const Index = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const items = [
    {
      key: "1",
      label: "Profile",
    },
    {
      key: "2",
      label: "Settings",
    },
    {
      key: "3",
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <React.Fragment>
      <Dropdown trigger={["click"]} menu={{items}}>
        <a>
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="user"
            className="tw:w-10 tw:h-10 tw:rounded-full"
          />
        </a>
      </Dropdown>
    </React.Fragment>
  );
};

export default Index;
