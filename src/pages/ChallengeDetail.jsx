import React, { useEffect } from "react"; // NOTE: Thêm useEffect
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { Icon } from "@iconify/react";
import AppLayout from "../components/layout/AppLayout";
import DetailBanner from "../components/Challenge/DetailBanner";
import DetailHeader from "../components/Challenge/DetailHeader";
import DetailInfo from "../components/Challenge/DetailInfo";
import DetailPrizes from "../components/Challenge/DetailPrizes";
import DetailActions from "../components/Challenge/DetailActions";
import DetailEntries from "../components/Challenge/DetailEntries";
import challengeDetailsData from "../data/challengeDetails.json";
import "./style/ChallengeDetail.css";

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // NOTE: SỬA LỖI Ở ĐÂY
  // 1. Chuyển 'id' (String) từ URL thành Number
  const challengeId = parseInt(id, 10);
  
  // 2. Tìm kiếm bằng 'challengeId' (Number)
  const challenge = challengeDetailsData[challengeId];

  // NOTE: SỬA LỖI NAVIGATE
  // 3. Dùng useEffect để xử lý việc "không tìm thấy"
  useEffect(() => {
    if (!challenge) {
      console.error(`Không tìm thấy thử thách với ID: ${id}`);
      navigate("/challenge");
    }
  }, [challenge, id, navigate]); // Thêm dependencies

  // 4. Nếu challenge chưa có (đang chờ useEffect chạy),
  // hiển thị "Đang tải..." thay vì render lỗi
  if (!challenge) {
    return (
      <AppLayout>
        <div style={{ padding: 40, textAlign: "center" }}>Đang tải...</div>
      </AppLayout>
    );
  }

  // --- Nếu challenge tồn tại, code dưới đây sẽ chạy ---

  const handleSubmit = () => {
    console.log("Submit entry for challenge:", id);
    // TODO: Navigate to submission page or open modal
  };

  const handleShare = () => {
    console.log("Share challenge:", id);
  };

  return (
    <AppLayout>
      <div className="challenge-detail-page">
        <div className="challenge-detail-container">
          {/* Back Button */}
          <Button
            type="text"
            size="large"
            icon={<Icon icon="mdi:arrow-left" style={{ fontSize: "20px" }} />}
            onClick={() => navigate("/challenge")}
            className="back-button"
          >
            Quay lại danh sách thử thách
          </Button>

          {/* Banner */}
          <DetailBanner
            image={challenge.image}
            title={challenge.title}
            description={challenge.category}
          />

          {/* Header Stats */}
          <DetailHeader
            participants={challenge.participants}
            dishes={challenge.dishes}
            timeLeft={challenge.timeLeft}
            duration={challenge.duration}
            status={challenge.status}
          />

          {/* Main Content */}
          <div className="challenge-detail-content">
            <div className="challenge-detail-main">
              {/* Info Section */}
              <DetailInfo
                description={challenge.description}
                hashtags={challenge.hashtags}
                category={challenge.category}
                requirements={challenge.requirements}
              />

              {/* Prizes Section */}
              <DetailPrizes
                prizes={challenge.prizes}
                prizeDetails={challenge.prizeDetails}
              />

              {/* Action Buttons */}
              <DetailActions
                status={challenge.status}
                onSubmit={handleSubmit}
                onShare={handleShare}
              />

              {/* Submitted Entries */}
              <DetailEntries entries={challenge.entries} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ChallengeDetail;