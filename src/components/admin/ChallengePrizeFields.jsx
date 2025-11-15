import React, { useEffect, useState } from "react";

export default function ChallengePrizeFields({
  prizes,
  prizeDetails,
  setFormData,
}) {
  // Prize labels for top 3
  const prizeLabels = ["Giải Nhất", "Giải Nhì", "Giải Ba"];

  // Detect initial prize count based on prizes with descriptions
  const getInitialPrizeCount = () => {
    if (!prizes || prizes.length === 0) return 3;
    const prizesWithDesc = prizes.filter(p => p.description && p.description.trim() !== "");
    if (prizesWithDesc.length === 0) return 3; // Default to 3 if all empty
    return Math.max(1, Math.min(3, prizesWithDesc.length));
  };

  const [prizeCount, setPrizeCount] = useState(getInitialPrizeCount);

  // Initialize prizes array with proper structure
  useEffect(() => {
    if (prizes.length === 0 || prizes.length !== 3) {
      const newPrizes = [
        { title: "Giải Nhất", description: prizes[0]?.description || "" },
        { title: "Giải Nhì", description: prizes[1]?.description || "" },
        { title: "Giải Ba", description: prizes[2]?.description || "" },
      ];
      setFormData((prev) => ({
        ...prev,
        prizes: newPrizes,
      }));
    }
  }, []);

  const handlePrizeCountChange = (e) => {
    const newCount = parseInt(e.target.value);
    setPrizeCount(newCount);
    
    // Update prizes array based on new count
    const currentPrizes = [...prizes];
    const updatedPrizes = [
      { title: "Giải Nhất", description: currentPrizes[0]?.description || "" },
      { title: "Giải Nhì", description: currentPrizes[1]?.description || "" },
      { title: "Giải Ba", description: currentPrizes[2]?.description || "" },
    ];
    
    setFormData((prev) => ({
      ...prev,
      prizes: updatedPrizes,
    }));
  };

  const handlePrizeChange = (index, value) => {
    setFormData((prev) => {
      const newPrizes = [...prev.prizes];
      newPrizes[index] = {
        title: prizeLabels[index],
        description: value,
      };
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
      <div className="mb-3">
        <h6 className="fw-bold mb-2">Giải Thưởng</h6>
        <div className="d-flex align-items-center gap-2 mb-2">
          <label className="form-label small mb-0">Số lượng giải thưởng:</label>
          <select 
            className="form-select form-select-sm w-auto"
            value={prizeCount}
            onChange={handlePrizeCountChange}
          >
            <option value={1}>Chỉ Giải Nhất</option>
            <option value={2}>Giải Nhất & Nhì</option>
            <option value={3}>Giải Nhất, Nhì & Ba</option>
          </select>
        </div>
        <p className="text-muted small mb-0">Nhập mô tả cho từng giải thưởng</p>
      </div>

      <div className="mb-3">
        {[0, 1, 2].slice(0, prizeCount).map((index) => {
          const borderColors = ["#FFD700", "#C0C0C0", "#CD7F32"]; // Gold, Silver, Bronze
          return (
            <div
              key={index}
              className="card mb-3"
              style={{ borderLeft: `4px solid ${borderColors[index]}` }}
            >
              <div className="card-body">
                <div className="mb-2">
                  <h6 className="mb-2 fw-bold">{prizeLabels[index]}</h6>
                  <label className="form-label small">Mô tả giải thưởng</label>
                  <textarea
                    className="form-control form-control-sm"
                    rows="3"
                    value={prizes[index]?.description || ""}
                    onChange={(e) => handlePrizeChange(index, e.target.value)}
                    placeholder={`Ví dụ: ${
                      index === 0
                        ? "5.000.000đ + Chiếc thớt gỗ MBM cao cấp"
                        : index === 1
                        ? "3.000.000đ + Voucher mua sắm"
                        : "1.000.000đ + Huy hiệu đặc biệt"
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

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

