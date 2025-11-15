import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spin, message } from "antd";
import { Icon } from "@iconify/react";
import AppLayout from "../components/layout/AppLayout";
import DetailBanner from "../components/Challenge/DetailBanner";
import DetailHeader from "../components/Challenge/DetailHeader";
import DetailInfo from "../components/Challenge/DetailInfo";
import DetailPrizes from "../components/Challenge/DetailPrizes";
import DetailActions from "../components/Challenge/DetailActions";
import DetailEntries from "../components/Challenge/DetailEntries";
import SubmitEntryModal from "../components/Challenge/SubmitEntryModal";
import WinnerPrize from "../components/Challenge/WinnerPrize";
import { getChallengeById, joinChallenge } from "../apis/challenge";
import { useAuth } from "../context/useAuth";
import "./style/ChallengeDetail.css";

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === "admin";
  const isLoggedIn = isAuthenticated();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Fetch challenge data
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getChallengeById(id);

        if (response.success) {
          setChallenge(response.data);
        } else {
          setError("Không tìm thấy thử thách");
          message.error("Không tìm thấy thử thách");
          setTimeout(() => navigate("/challenge"), 2000);
        }
      } catch (err) {
        console.error("Error fetching challenge:", err);
        setError(err.message || "Lỗi khi tải dữ liệu thử thách");
        message.error(err.message || "Lỗi khi tải dữ liệu thử thách");
        setTimeout(() => navigate("/challenge"), 2000);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchChallenge();
    }
  }, [id, navigate]);

  const handleJoin = async () => {
    // Check if user is logged in
    if (!isLoggedIn) {
      message.warning("Vui lòng đăng nhập để tham gia thử thách");
      navigate("/login", { state: { from: `/challenge/${id}` } });
      return;
    }

    try {
      setIsJoining(true);
      const response = await joinChallenge(id);
      if (response.success) {
        message.success("Tham gia thử thách thành công!");
        // Refresh challenge data
        const updatedResponse = await getChallengeById(id);
        if (updatedResponse.success) {
          setChallenge(updatedResponse.data);
        }
      }
    } catch (err) {
      message.error(err.message || "Lỗi khi tham gia thử thách");
    } finally {
      setIsJoining(false);
    }
  };

  const handleSubmit = () => {
    if (!challenge) return;
    
    // Check if user is logged in
    if (!isLoggedIn) {
      message.warning("Vui lòng đăng nhập để nộp bài");
      navigate("/login", { state: { from: `/challenge/${id}` } });
      return;
    }

    // Check if user has joined the challenge
    const userId = user?._id?.toString();
    const isParticipant = challenge.participants?.some(
      (p) => (typeof p === 'object' ? p._id?.toString() : p.toString()) === userId
    );

    if (!isParticipant) {
      message.warning("Bạn cần tham gia thử thách trước khi nộp bài");
      return;
    }

    // Check if challenge is ongoing
    if (challenge.status !== "ongoing") {
      message.warning("Chỉ có thể nộp bài khi thử thách đang diễn ra");
      return;
    }

    // Open submit modal
    setShowSubmitModal(true);
  };

  const handleSubmitSuccess = async () => {
    // Refresh challenge data
    try {
      const response = await getChallengeById(id);
      if (response.success) {
        setChallenge(response.data);
      }
    } catch (err) {
      console.error("Error refreshing challenge:", err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: challenge?.title,
        text: challenge?.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      message.success("Đã sao chép link!");
    }
  };

  // Format duration
  const formatDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  if (loading) {
    return (
      <AppLayout>
        <div style={{ padding: 100, textAlign: "center" }}>
          <Spin size="large" />
          <p style={{ marginTop: "16px" }}>Đang tải dữ liệu...</p>
        </div>
      </AppLayout>
    );
  }

  if (error || !challenge) {
    return (
      <AppLayout>
        <div style={{ padding: 100, textAlign: "center" }}>
          <p style={{ color: "#ff4d4f" }}>{error || "Không tìm thấy thử thách"}</p>
          <Button onClick={() => navigate("/challenge")} style={{ marginTop: 16 }}>
            Quay lại danh sách
          </Button>
        </div>
      </AppLayout>
    );
  }

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
            participants={challenge.participants?.length || challenge.participantsCount || 0}
            dishes={isAdmin ? (challenge.entries?.length || challenge.entriesCount || 0) : undefined}
            timeLeft={challenge.timeLeft || ""}
            duration={formatDuration(challenge.startDate, challenge.endDate)}
            status={challenge.status}
          />

          {/* Join Button (if not joined) - Moved to top */}
          {!isAdmin && challenge.status === "ongoing" && (
            <div style={{ marginTop: 24, marginBottom: 24, textAlign: "center" }}>
              <Button
                type="primary"
                size="large"
                loading={isJoining}
                onClick={handleJoin}
                icon={<Icon icon="mdi:account-plus" />}
                style={{
                  padding: "12px 32px",
                  height: "auto",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                Tham gia thử thách
              </Button>
            </div>
          )}

          {/* Main Content */}
          <div className="challenge-detail-content">
            <div className="challenge-detail-main">
              {/* Winner Prize Section - Show if user won */}
              {!isAdmin && <WinnerPrize challenge={challenge} user={user} />}

              {/* Info Section */}
              <DetailInfo
                description={challenge.description}
                hashtags={challenge.hashtags || []}
                category={challenge.category}
                requirements={challenge.requirements || []}
              />

              {/* Prizes Section */}
              <DetailPrizes
                prizes={challenge.prizes || []}
                prizeDetails={challenge.prizeDetails || {}}
              />

              {/* Action Buttons */}
              <DetailActions
                status={challenge.status}
                onSubmit={handleSubmit}
                onShare={handleShare}
                isLoggedIn={isLoggedIn}
              />

              {/* Submitted Entries - Only show for admin */}
              {isAdmin && <DetailEntries entries={challenge.entries || []} />}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Entry Modal */}
      <SubmitEntryModal
        challengeId={id}
        visible={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSuccess={handleSubmitSuccess}
      />
    </AppLayout>
  );
};

export default ChallengeDetail;
