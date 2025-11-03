import React from "react";
import { Button } from "antd";
import { Icon } from "@iconify/react";
import { useNavigate, useLocation } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on the blog page
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
};

export default Index;
