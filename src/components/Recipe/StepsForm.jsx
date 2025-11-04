import React from "react";
import { Button, Upload, Input } from "antd";
import { Icon } from "@iconify/react";
import "../../pages/style/RecipeCreate.css";

const { TextArea } = Input;

const StepsForm = ({ 
  steps, 
  onUpdateStep, 
  onUpdateStepImage, 
  onRemoveStep, 
  onAddStep 
}) => {
  return (
    <div className="section-card">
      <h3>Các bước</h3>

      <div className="steps-list">
        {steps.map((step, index) => (
          <div key={index} className="step-item">
            <div className="step-number">{index + 1}</div>
            <div className="step-content">
              <TextArea
                placeholder={`Trộn bột và nước đến khi đặc lại`}
                value={step.description}
                onChange={(e) => onUpdateStep(index, "description", e.target.value)}
                rows={3}
                style={{ marginBottom: "12px" }}
              />
              
              <div className="step-image-upload">
                {step.imagePreview ? (
                  <div className="step-image-preview">
                    <img src={step.imagePreview} alt={`Bước ${index + 1}`} />
                    <Button 
                      danger 
                      size="small"
                      icon={<Icon icon="mdi:close" />}
                      onClick={() => onUpdateStepImage(index, null)}
                      className="remove-image-btn"
                    />
                  </div>
                ) : (
                  <Upload
                    beforeUpload={(file) => {
                      onUpdateStepImage(index, file);
                      return false;
                    }}
                    showUploadList={false}
                  >
                    <div className="upload-placeholder">
                      <Icon icon="mdi:camera" width="32" />
                    </div>
                  </Upload>
                )}
              </div>

              <Button 
                danger
                size="small"
                icon={<Icon icon="mdi:delete" />}
                onClick={() => onRemoveStep(index)}
                disabled={steps.length === 1}
                style={{ marginTop: "8px" }}
              >
                Xóa bước
              </Button>
            </div>
          </div>
        ))}
        
        <Button 
          type="dashed" 
          onClick={onAddStep}
          block
          icon={<Icon icon="mdi:plus" />}
          className="add-step-btn"
        >
          Thêm bước
        </Button>
      </div>
    </div>
  );
};

export default StepsForm;

