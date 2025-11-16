import React from "react";
import { Link } from "react-router-dom";
import { Tag } from "antd";
import "./SmartNavigation.css";

const SmartNavigation = ({ content, className = "" }) => {
  if (!content) return null;

  // Extract potential navigation links from content
  const navigationItems = [];

  // Look for recipe mentions (simple pattern matching)
  const recipePattern = /(?:món|recipe|công thức|món ăn)\s+([A-Za-zÀ-ỹ\s]+)/gi;
  const recipeMatches = [...content.matchAll(recipePattern)];
  recipeMatches.forEach((match) => {
    if (match[1] && match[1].trim().length > 2) {
      navigationItems.push({
        type: "recipe",
        text: match[1].trim(),
        path: "/recipes",
        label: "Xem công thức",
      });
    }
  });

  // Look for meal plan mentions
  if (content.toLowerCase().includes("thực đơn") || content.toLowerCase().includes("meal plan")) {
    navigationItems.push({
      type: "mealplan",
      text: "Thực đơn",
      path: "/mealplan",
      label: "Xem thực đơn",
    });
  }

  // Look for goal mentions
  if (content.toLowerCase().includes("mục tiêu") || content.toLowerCase().includes("goal")) {
    navigationItems.push({
      type: "goal",
      text: "Mục tiêu",
      path: "/goals",
      label: "Quản lý mục tiêu",
    });
  }

  // Look for progress mentions
  if (content.toLowerCase().includes("tiến độ") || content.toLowerCase().includes("progress")) {
    navigationItems.push({
      type: "progress",
      text: "Tiến độ",
      path: "/progress",
      label: "Xem tiến độ",
    });
  }

  // Remove duplicates
  const uniqueItems = navigationItems.filter(
    (item, index, self) => index === self.findIndex((t) => t.path === item.path)
  );

  if (uniqueItems.length === 0) return null;

  return (
    <div className={`smart-navigation ${className}`}>
      <div className="smart-navigation-label">Liên kết nhanh:</div>
      <div className="smart-navigation-links">
        {uniqueItems.map((item, index) => (
          <Link key={index} to={item.path} className="smart-navigation-link">
            <Tag color="blue" className="smart-navigation-tag">
              {item.label}
            </Tag>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SmartNavigation;

