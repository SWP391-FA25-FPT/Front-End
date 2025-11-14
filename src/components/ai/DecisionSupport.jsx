import React from "react";
import { Button, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { generateSuggestedActions, detectIntent } from "../../utils/aiHelpers";
import "./DecisionSupport.css";

const DecisionSupport = ({ message, className = "" }) => {
  const navigate = useNavigate();

  if (!message) return null;

  const intents = detectIntent(message);
  const actions = generateSuggestedActions(intents);

  if (actions.length === 0) return null;

  const handleActionClick = (path) => {
    navigate(path);
  };

  return (
    <div className={`decision-support ${className}`}>
      <div className="decision-support-label">Bạn có thể muốn:</div>
      <Space wrap size="small" className="decision-support-actions">
        {actions.map((action, index) => (
          <Button
            key={index}
            type="default"
            size="small"
            icon={<span>{action.icon}</span>}
            onClick={() => handleActionClick(action.path)}
            className="decision-support-button"
          >
            {action.label}
          </Button>
        ))}
      </Space>
    </div>
  );
};

export default DecisionSupport;

