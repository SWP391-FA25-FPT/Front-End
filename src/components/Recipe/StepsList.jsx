import React from "react";
import { Image } from "antd";
import "./Recipe.css";

const StepsList = ({ steps }) => {
  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <div className="steps-list-container">
      {steps.map((step, index) => (
        <div key={index} className="step-item-detail">
          <div className="step-number-badge">{index + 1}</div>
          <div className="step-content-detail">
            <p className="step-description">{step.description}</p>
            {step.image && (
              <div className="step-image-wrapper">
                <Image
                  src={step.image}
                  alt={`Bước ${index + 1}`}
                  className="step-image"
                  preview={{
                    mask: "Xem ảnh"
                  }}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StepsList;

