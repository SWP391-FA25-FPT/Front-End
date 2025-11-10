import React from "react";
import { Button } from "antd";
import { Icon } from "@iconify/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isBlogPage =
    location.pathname.startsWith("/blog") &&
    location.pathname !== "/blog/create";

  const handleCreate = () => {
    if (isBlogPage) {
      navigate("/blog/create");
    } else {
      navigate("/recipe/create");
    }
  };

  if (user) {
    return (
      <React.Fragment>
        <Button
          type="primary"
          style={{ backgroundColor: "#FFBA33" }}
          onClick={handleCreate}
        >
          <Icon icon="ic:baseline-plus" width="24" height="24" />
          {isBlogPage ? "Tạo Blog" : "Viết món mới"}
        </Button>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Button
        type="primary"
        style={{ backgroundColor: "#FFBA33" }} 
        onClick={() => navigate("/login")} 
      >
        <Icon 
          icon="mdi:login-variant" 
          width="20" 
          height="20" 
          style={{ marginRight: '4px' }}
        />
        Đăng nhập
      </Button>
    </React.Fragment>
  );
};

export default Index;