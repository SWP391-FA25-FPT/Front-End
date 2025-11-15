import React from "react";
import { Modal, Descriptions, Avatar, Tag, Space } from "antd";
import { Award, Eye, Star, Heart, Calendar, User } from "lucide-react";

export default function EntryDetailModal({ entry, visible, onClose }) {
  if (!entry) return null;

  const authorName = typeof entry.userId === 'object' 
    ? entry.userId?.name || entry.author 
    : entry.author;
  const authorEmail = typeof entry.userId === 'object' 
    ? entry.userId?.email 
    : null;
  const authorAvatar = typeof entry.userId === 'object' 
    ? entry.userId?.avatar || entry.authorAvatar 
    : entry.authorAvatar;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate interaction score: (views + rating) / 2
  const calculateScore = () => {
    const views = entry.views || 0;
    const rating = entry.rating || 0;
    return ((views + rating) / 2).toFixed(2);
  };

  return (
    <Modal
      title="Chi tiết bài nộp"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <div style={{ marginBottom: 24 }}>
        {entry.image && (
          <div style={{ marginBottom: 24, textAlign: "center" }}>
            <img
              src={entry.image}
              alt={entry.title}
              style={{
                maxWidth: "100%",
                maxHeight: "400px",
                borderRadius: "8px",
                objectFit: "contain",
              }}
            />
          </div>
        )}

        <Descriptions bordered column={1}>
          <Descriptions.Item label="Tiêu đề">
            <strong>{entry.title || "N/A"}</strong>
            {entry.isPremium && (
              <Tag color="gold" style={{ marginLeft: 8 }}>Premium</Tag>
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Người nộp">
            <Space>
              {authorAvatar && (
                <Avatar src={authorAvatar} size={40} />
              )}
              <div>
                <div style={{ fontWeight: 500 }}>{authorName}</div>
                {authorEmail && (
                  <div style={{ fontSize: "12px", color: "#999" }}>
                    {authorEmail}
                  </div>
                )}
              </div>
            </Space>
          </Descriptions.Item>

          <Descriptions.Item label="Cách nấu / Status">
            <div style={{ 
              whiteSpace: "pre-wrap", 
              wordBreak: "break-word",
              padding: "12px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
              minHeight: "100px"
            }}>
              {entry.content || "Không có nội dung"}
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="Thống kê tương tác">
            <Space size="large">
              <div>
                <Eye size={16} style={{ marginRight: 4, verticalAlign: "middle" }} />
                <strong>Views:</strong> {entry.views || 0}
              </div>
              <div>
                <Star size={16} style={{ marginRight: 4, verticalAlign: "middle" }} />
                <strong>Rating:</strong> {entry.rating || 0}
              </div>
              <div>
                <Heart size={16} style={{ marginRight: 4, verticalAlign: "middle" }} />
                <strong>Likes:</strong> {entry.likes?.length || 0}
              </div>
            </Space>
          </Descriptions.Item>

          <Descriptions.Item label="Điểm tương tác">
            <Tag color="blue" style={{ fontSize: "16px", padding: "4px 12px" }}>
              <Award size={16} style={{ marginRight: 4, verticalAlign: "middle" }} />
              {(entry.views || 0) + (entry.rating || 0)} / 2 = {calculateScore()} điểm
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Ngày nộp">
            <Calendar size={16} style={{ marginRight: 4, verticalAlign: "middle" }} />
            {formatDate(entry.submittedAt)}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Modal>
  );
}

