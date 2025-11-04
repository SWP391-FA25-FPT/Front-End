import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./SubscriptionBadge.css";

const SubscriptionBadge = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/subscription");
  };

  const isFree = !user?.subscription?.status || user?.subscription?.status === "free";

  return (
    <div className={`subscription-badge ${isFree ? "free" : "premium"}`} onClick={handleClick}>
      {isFree ? (
        <>
          <span className="badge-icon">⭐</span>
          <span className="badge-text">Nâng cấp Premium</span>
        </>
      ) : (
        <>
          <span className="badge-icon">👑</span>
          <span className="badge-text">Premium</span>
        </>
      )}
    </div>
  );
};

export default SubscriptionBadge;


