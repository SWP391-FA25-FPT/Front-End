import React from "react";
import { Plus, Trash2 } from "lucide-react";

export default function ChallengeRequirementFields({
  requirements,
  setFormData,
}) {
  const handleAddRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }));
  };

  const handleRemoveRequirement = (index) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const handleRequirementChange = (index, value) => {
    setFormData((prev) => {
      const newRequirements = [...prev.requirements];
      newRequirements[index] = value;
      return {
        ...prev,
        requirements: newRequirements,
      };
    });
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold mb-0">Yêu Cầu Tham Gia</h6>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={handleAddRequirement}
        >
          <Plus size={16} className="me-1" />
          Thêm Yêu Cầu
        </button>
      </div>

      {requirements.length === 0 ? (
        <p className="text-muted">Chưa có yêu cầu nào</p>
      ) : (
        <div>
          {requirements.map((requirement, index) => (
            <div
              key={index}
              className="input-group mb-2"
            >
              <input
                type="text"
                className="form-control"
                value={requirement}
                onChange={(e) =>
                  handleRequirementChange(index, e.target.value)
                }
                placeholder={`Yêu cầu ${index + 1}`}
              />
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => handleRemoveRequirement(index)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

