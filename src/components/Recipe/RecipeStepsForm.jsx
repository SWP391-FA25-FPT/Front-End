import React from "react";
import { Button, Upload, Input } from "antd";
import { PlusOutlined, CameraOutlined } from "@ant-design/icons";

const { TextArea } = Input;

export default function RecipeStepsForm({ steps, setSteps }) {
  const handleAddStep = () => {
    setSteps([...steps, { description: "", image: null }]);
  };

  const handleImageUpload = (file, index) => {
    const newSteps = [...steps];
    newSteps[index].image = URL.createObjectURL(file);
    setSteps(newSteps);
    return false;
  };

  return (
    <div className="recipe-section">
      <h3 className="section-title">Các bước thực hiện</h3>

      {steps.map((step, index) => (
        <div key={index} className="step-item">
          <div className="step-header">
            <span className="step-number">Bước {index + 1}</span>
          </div>

          <TextArea
            rows={2}
            placeholder="Mô tả cách làm..."
            value={step.description}
            onChange={(e) => {
              const newSteps = [...steps];
              newSteps[index].description = e.target.value;
              setSteps(newSteps);
            }}
          />

          <Upload
            beforeUpload={(file) => handleImageUpload(file, index)}
            showUploadList={false}
          >
            <Button icon={<CameraOutlined />}>Thêm ảnh</Button>
          </Upload>

          {step.image && (
            <img
              src={step.image}
              alt={`step-${index}`}
              className="step-image"
            />
          )}
        </div>
      ))}

      <Button
        icon={<PlusOutlined />}
        onClick={handleAddStep}
        className="add-btn"
      >
        Thêm bước làm
      </Button>
    </div>
  );
}
