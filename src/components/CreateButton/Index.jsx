import React from "react";
import { Button } from "antd";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleCreateRecipe = () => {
    navigate("/recipe/create");
  };

  return (
    <React.Fragment>
      <Button 
        type="primary" 
        style={{ backgroundColor: "#FFBA33" }}
        onClick={handleCreateRecipe}
      >
        <Icon icon="ic:baseline-plus" width="24" height="24" />
        Viết món mới
      </Button>
    </React.Fragment>
  );
};

export default Index;
