import React from "react";

const DetailBanner = ({ image, title, description }) => {
  return (
    <div className="detail-banner">
      <img src={image} alt={title} />
      <div className="detail-banner-overlay">
        <h1 className="detail-banner-title">{title}</h1>
        <p className="detail-banner-subtitle">{description}</p>
      </div>
    </div>
  );
};

export default DetailBanner;
