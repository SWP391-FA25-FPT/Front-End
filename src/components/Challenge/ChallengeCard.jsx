import React from "react";
import { Card, Tag, Progress, Avatar, Space } from "antd";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import blank4x3 from "../../assets/blank4x3.png";
import guest from "../../assets/guest.png";

const ChallengeCard = ({ challenge }) => {
  const navigate = useNavigate();

  const getStatusTag = (status) => {
    const statusConfig = {
      ongoing: { color: "success", text: "Đang diễn ra" },
      upcoming: { color: "processing", text: "Sắp diễn ra" },
      ended: { color: "default", text: "Đã kết thúc" },
    };
    return statusConfig[status] || statusConfig.ongoing;
  };

  const statusTag = getStatusTag(challenge.status);

  // Format duration from dates
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

  // Calculate progress (entries / participants * 100, max 100)
  const calculateProgress = () => {
    const participantsCount = challenge.participants?.length || challenge.participantsCount || 0;
    const entriesCount = challenge.entries?.length || challenge.entriesCount || 0;
    if (participantsCount === 0) return 0;
    return Math.min(Math.round((entriesCount / participantsCount) * 100), 100);
  };

  // Get time left
  const getTimeLeft = () => {
    if (!challenge.endDate) return "";
    const end = new Date(challenge.endDate);
    const now = new Date();
    const diff = end - now;
    
    if (diff < 0) return "Đã kết thúc";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `Còn ${days} ngày`;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 0) return `Còn ${hours} giờ`;
    
    const minutes = Math.floor(diff / (1000 * 60));
    return `Còn ${minutes} phút`;
  };

  const participantsCount = challenge.participants?.length || challenge.participantsCount || 0;
  const entriesCount = challenge.entries?.length || challenge.entriesCount || 0;
  const progress = calculateProgress();
  const duration = formatDuration(challenge.startDate, challenge.endDate);
  const timeLeft = challenge.timeLeft || getTimeLeft();

  return (
    <Card
      className="challenge-card"
      hoverable
      onClick={() => navigate(`/challenge/${challenge._id}`)}
      cover={
        <div className="challenge-card-cover">
          <img 
            src={challenge.image || blank4x3} 
            alt={challenge.title}
            onError={(e) => {
              e.target.src = blank4x3;
            }}
          />
          <div className="challenge-overlay">
            <Tag color={statusTag.color} className="status-tag">
              {statusTag.text}
            </Tag>
          </div>
        </div>
      }
    >
      <div className="challenge-card-content">
        <div className="challenge-header">
          <h3 className="challenge-title">{challenge.title}</h3>
          <Tag color="orange">{challenge.category}</Tag>
        </div>

        <p className="challenge-description">{challenge.description}</p>

        <div className="challenge-stats">
          <Space size={16}>
            <div className="stat-item">
              <Icon
                icon="mdi:account-group"
                style={{ fontSize: "18px", color: "#1890ff" }}
              />
              <span>{participantsCount} người tham gia</span>
            </div>
            <div className="stat-item">
              <Icon
                icon="mdi:trophy"
                style={{ fontSize: "18px", color: "#faad14" }}
              />
              <span>{entriesCount} bài dự thi</span>
            </div>
          </Space>
        </div>

        <div className="challenge-progress">
          <div className="progress-label">
            <span>Tiến độ</span>
            <span className="progress-value">{progress}%</span>
          </div>
          <Progress
            percent={progress}
            strokeColor={{
              "0%": "#F8B602",
              "100%": "#ffa500",
            }}
            showInfo={false}
          />
        </div>

        <div className="challenge-time">
          <div className="time-item">
            <Icon
              icon="mdi:calendar-clock"
              style={{ fontSize: "16px", color: "#F8B602" }}
            />
            <span>{duration}</span>
          </div>
          <div className="time-remaining">
            <Icon
              icon="mdi:clock-outline"
              style={{ fontSize: "16px", color: "#ff4d4f" }}
            />
            <span>{timeLeft}</span>
          </div>
        </div>

        {challenge.prizes && challenge.prizes.length > 0 && (
          <div className="challenge-prizes">
            <div className="prize-label">
              <Icon
                icon="mdi:gift"
                style={{ fontSize: "16px", color: "#F8B602" }}
              />
              <span>Giải thưởng</span>
            </div>
            <div className="prize-list">
              {challenge.prizes.map((prize, index) => (
                <Tag key={index} color="gold">
                  {typeof prize === "string" ? prize : prize.title || prize.description}
                </Tag>
              ))}
            </div>
          </div>
        )}

        <div className="challenge-footer">
          <div className="host-info">
            <Avatar src={challenge.host?.avatar || guest} size={32} />
            <span className="host-name">{challenge.host?.name || "Admin"}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChallengeCard;
