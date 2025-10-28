import React, { useState } from "react";
import { Image, Modal } from "antd";
import "./Recipe.css";

const RecipeImage = ({ image, name }) => {
  const [previewVisible, setPreviewVisible] = useState(false);

  return (
    <div className="recipe-image-container" style={{ marginBottom: "24px" }}>
      <Image
        src={image}
        alt={name}
        style={{
          width: "100%",
          maxHeight: "500px",
          objectFit: "cover",
          borderRadius: "8px",
          cursor: "pointer"
        }}
        preview={{
          visible: previewVisible,
          onVisibleChange: (visible) => setPreviewVisible(visible),
        }}
      />
    </div>
  );
};

export default RecipeImage;

