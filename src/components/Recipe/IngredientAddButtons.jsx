import React from "react";
import { Button } from "antd";
import { Icon } from "@iconify/react";

const IngredientAddButtons = ({ onAddIngredient, onAddSection }) => {
  return (
    <div className="ingredient-add-buttons">
      <Button
        type="text"
        onClick={onAddSection}
        icon={<Icon icon="mdi:plus" />}
        className="add-section-btn"
      >
        Phần
      </Button>
      <Button
        type="text"
        onClick={onAddIngredient}
        icon={<Icon icon="mdi:plus" />}
        className="add-ingredient-btn"
      >
        Nguyên liệu
      </Button>
    </div>
  );
};

export default IngredientAddButtons;


