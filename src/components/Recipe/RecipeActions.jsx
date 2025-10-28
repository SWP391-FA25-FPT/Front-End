import React from "react";
import { Button } from "antd";
import { CheckOutlined, SaveOutlined } from "@ant-design/icons";

export default function RecipeActions({ onSubmit }) {
  return (
    <div className="recipe-actions">
      <Button
        type="primary"
        icon={<CheckOutlined />}
        className="submit-btn"
        onClick={onSubmit}
      >
        Lên sóng
      </Button>
      <Button icon={<SaveOutlined />} className="draft-btn">
        Lưu nháp
      </Button>
    </div>
  );
}
