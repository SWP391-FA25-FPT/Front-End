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

  return (
    <Card
      className="challenge-card"
      hoverable
      onClick={() => navigate(`/challenge/${challenge.id}`)}
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
              <span>{challenge.participants} người tham gia</span>
            </div>
            <div className="stat-item">
              <Icon
                icon="mdi:trophy"
                style={{ fontSize: "18px", color: "#faad14" }}
              />
              <span>{challenge.entries} bài dự thi</span>
            </div>
          </Space>
        </div>

        <div className="challenge-progress">
          <div className="progress-label">
            <span>Tiến độ</span>
            <span className="progress-value">{challenge.progress}%</span>
          </div>
          <Progress
            percent={challenge.progress}
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
            <span>{challenge.duration}</span>
          </div>
          <div className="time-remaining">
            <Icon
              icon="mdi:clock-outline"
              style={{ fontSize: "16px", color: "#ff4d4f" }}
            />
            <span>{challenge.timeLeft}</span>
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
                  {prize}
                </Tag>
              ))}
            </div>
          </div>
        )}

        <div className="challenge-footer">
          <div className="host-info">
            <Avatar src={challenge.host?.avatar || guest} size={32} />
            <span className="host-name">{challenge.host.name}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChallengeCard;
