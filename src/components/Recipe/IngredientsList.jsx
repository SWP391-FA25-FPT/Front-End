import React from "react";
import { Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

// Helper function để parse amount thành quantity và unit
const parseAmount = (amount) => {
  if (!amount || typeof amount !== "string") {
    return { quantity: "", unit: "" };
  }
  
  // Regex để tách số lượng và đơn vị
  // Hỗ trợ các format: "50 g", "1/2 mcf", "2 tép", "3 mc", etc.
  const match = amount.trim().match(/^(\d+[/,.]?\d*)\s*(.+)?$/);
  
  if (match) {
    return {
      quantity: match[1],
      unit: match[2] || "",
    };
  }
  
  // Nếu không match, trả về toàn bộ amount là quantity
  return {
    quantity: amount,
    unit: "",
  };
};

const IngredientsList = ({ ingredients, servings = 2 }) => {
  const navigate = useNavigate();

  if (!ingredients || ingredients.length === 0) {
    return null;
  }

  const handleIngredientClick = (ingredientName) => {
    if (ingredientName && ingredientName.trim()) {
      navigate(`/search?q=${encodeURIComponent(ingredientName.trim())}`);
    }
  };

  const containerStyle = {
    margin: "24px 0",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    paddingBottom: "12px",
    borderBottom: "2px solid #e8e8e8",
  };

  const titleStyle = {
    fontSize: "20px",
    fontWeight: 700,
    color: "#333",
    margin: 0,
  };

  const servingsInfoStyle = {
    fontSize: "14px",
    color: "#666",
  };

  const contentStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  };

  const rowStyle = {
    display: "grid",
    gridTemplateColumns: "20px 1fr",
    gap: "12px",
    alignItems: "center",
    padding: "8px 0",
  };

  const bulletStyle = {
    fontSize: "20px",
    color: "var(--primary-selected-color, #ff9500)",
    fontWeight: "bold",
  };

  const contentWrapperStyle = {
    fontSize: "15px",
    color: "#333",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    flexWrap: "wrap",
  };

  const quantityStyle = {
    fontSize: "15px",
    color: "#333",
  };

  const unitStyle = {
    fontSize: "15px",
    fontWeight: "bold",
    color: "#333",
  };

  const nameClickableStyle = {
    fontSize: "15px",
    color: "#333",
    textDecoration: "underline",
    cursor: "pointer",
    transition: "color 0.2s ease",
  };

  const handleNameMouseEnter = (e) => {
    e.target.style.color = "var(--primary-selected-color, #ff9500)";
  };

  const handleNameMouseLeave = (e) => {
    e.target.style.color = "#333";
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>Nguyên Liệu</h3>
        <div style={servingsInfoStyle}>
          <Text type="secondary">{servings} người</Text>
        </div>
      </div>
      <div style={contentStyle}>
        {ingredients.map((ingredient, index) => {
          const { quantity, unit } = parseAmount(ingredient.amount);
          const ingredientName = ingredient.name || "";

          return (
            <div key={index} style={rowStyle}>
              <div style={bulletStyle}>•</div>
              <div style={contentWrapperStyle}>
                <span style={quantityStyle}>{quantity}</span>
                {unit && <span style={unitStyle}>{unit}</span>}
                {ingredientName && (
                  <span 
                    style={nameClickableStyle}
                    onClick={() => handleIngredientClick(ingredientName)}
                    onMouseEnter={handleNameMouseEnter}
                    onMouseLeave={handleNameMouseLeave}
                  >
                    {ingredientName}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IngredientsList;

