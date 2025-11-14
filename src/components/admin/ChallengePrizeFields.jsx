import React from "react";
import { Plus, Trash2 } from "lucide-react";

export default function ChallengePrizeFields({
  prizes,
  prizeDetails,
  setFormData,
}) {
  const handleAddPrize = () => {
    setFormData((prev) => ({
      ...prev,
      prizes: [
        ...prev.prizes,
        { title: "", description: "" },
      ],
    }));
  };

  const handleRemovePrize = (index) => {
    setFormData((prev) => ({
      ...prev,
      prizes: prev.prizes.filter((_, i) => i !== index),
    }));
  };

  const handlePrizeChange = (index, field, value) => {
    setFormData((prev) => {
      const newPrizes = [...prev.prizes];
      newPrizes[index][field] = value;
      return {
        ...prev,
        prizes: newPrizes,
      };
    });
  };

  const handlePrizeDetailsChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      prizeDetails: {
        ...prev.prizeDetails,
        [field]: value,
      },
    }));
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold mb-0">Giải Thưởng</h6>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={handleAddPrize}
        >
          <Plus size={16} className="me-1" />
          Thêm Giải
        </button>
      </div>

      {prizes.length === 0 ? (
        <p className="text-muted">Chưa có giải thưởng nào</p>
      ) : (
        <div className="mb-3">
          {prizes.map((prize, index) => (
            <div
              key={index}
              className="card mb-3"
              style={{ borderLeft: "4px solid #F8B602" }}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="mb-0">Giải {index + 1}</h6>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleRemovePrize(index)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="mb-2">
                  <label className="form-label small">Tên giải</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={prize.title}
                    onChange={(e) =>
                      handlePrizeChange(index, "title", e.target.value)
                    }
                    placeholder="Ví dụ: Giải Nhất"
                  />
                </div>
                <div>
                  <label className="form-label small">Mô tả giải</label>
                  <textarea
                    className="form-control form-control-sm"
                    rows="2"
                    value={prize.description}
                    onChange={(e) =>
                      handlePrizeChange(index, "description", e.target.value)
                    }
                    placeholder="Ví dụ: 5.000.000đ + Chiếc thớt gỗ MBM cao cấp"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Prize Details */}
      <div className="card" style={{ borderLeft: "4px solid #1890ff" }}>
        <div className="card-body">
          <h6 className="fw-bold mb-3">Chi Tiết Giải Thưởng</h6>
          <div className="mb-3">
            <label className="form-label small">Ghi chú</label>
            <textarea
              className="form-control form-control-sm"
              rows="2"
              value={prizeDetails.note || ""}
              onChange={(e) =>
                handlePrizeDetailsChange("note", e.target.value)
              }
              placeholder="Ví dụ: Chủ bếp mới là người chưa hoặc ít tham gia các thử thách của M&M"
            />
          </div>
          <div>
            <label className="form-label small">Các mục khác</label>
            <textarea
              className="form-control form-control-sm"
              rows="2"
              value={prizeDetails.items || ""}
              onChange={(e) =>
                handlePrizeDetailsChange("items", e.target.value)
              }
              placeholder="Ví dụ: Tất cả người chiến thắng đều nhận được huy hiệu..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

