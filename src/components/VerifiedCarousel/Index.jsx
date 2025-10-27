import React, { useRef } from "react";
import { Card, Button } from "antd";
import { Icon } from "@iconify/react";
import "./style.css";

const VerifiedCarousel = ({ recipes, onRecipeClick }) => {
  const scrollRef = useRef(null);

  if (!recipes || recipes.length === 0) {
    return null;
  }

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="verified-carousel-container">
      {/* Scroll Buttons */}
      {recipes.length > 4 && (
        <>
          <Button
            className="carousel-nav-btn carousel-nav-left"
            shape="circle"
            icon={<Icon icon="mdi:chevron-left" width="24" />}
            onClick={() => scroll('left')}
          />
          <Button
            className="carousel-nav-btn carousel-nav-right"
            shape="circle"
            icon={<Icon icon="mdi:chevron-right" width="24" />}
            onClick={() => scroll('right')}
          />
        </>
      )}

      {/* Horizontal Scroll Container */}
      <div className="verified-carousel-scroll" ref={scrollRef}>
        {recipes.map((recipe) => (
          <Card
            key={recipe._id}
            hoverable
            className="verified-recipe-card"
            onClick={() => onRecipeClick && onRecipeClick(recipe._id)}
            cover={
              <div style={{ position: "relative", paddingTop: "100%", overflow: "hidden" }}>
                <img
                  alt={recipe.name}
                  src={recipe.image}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
                <div 
                  className="verified-badge"
                  style={{
                    position: "absolute",
                    top: "8px",
                    left: "8px",
                    backgroundColor: "rgba(250, 173, 20, 0.95)",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <Icon icon="mdi:crown" width="12" />
                </div>
              </div>
            }
          >
            <Card.Meta
              title={
                <div style={{ 
                  fontSize: "13px", 
                  fontWeight: "500",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  lineHeight: "1.4",
                  minHeight: "36px"
                }}>
                  {recipe.name}
                </div>
              }
            />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VerifiedCarousel;

