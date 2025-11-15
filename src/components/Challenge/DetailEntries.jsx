import React, { useState } from "react";
import { Row, Col, Card, Avatar, Space, Tag, Empty, Select } from "antd";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import guest from "../../assets/guest.png";

const { Option } = Select;

const DetailEntries = ({ entries }) => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("latest");

  const getSortedEntries = () => {
    let sorted = [...entries];
    switch (sortBy) {
      case "latest":
        return sorted.sort(
          (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
        );
      case "popular":
        return sorted.sort(
          (a, b) => (b.likes?.length || b.likes || 0) - (a.likes?.length || a.likes || 0)
        );
      case "rating":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return sorted;
    }
  };

  const sortedEntries = getSortedEntries();

  const handleCardClick = (entry) => {
    // Navigate to recipe detail if recipeId exists
    if (entry.recipeId) {
      navigate(`/recipe/${entry.recipeId._id || entry.recipeId}`);
    } else {
      console.log("Clicked entry:", entry._id || entry.id);
    }
  };

  return (
    <div className="detail-entries">
      <div className="entries-header">
        <h2 className="detail-section-title">
          <Icon icon="mdi:food" style={{ marginRight: "8px" }} />
          {entries.length} Món đã đăng tài
        </h2>

        <div className="entries-sort">
          <span style={{ marginRight: "8px", color: "#666" }}>Sắp xếp:</span>
          <Select
            value={sortBy}
            onChange={setSortBy}
            style={{ width: 150 }}
            size="large"
          >
            <Option value="latest">Mới nhất</Option>
            <Option value="popular">Phổ biến nhất</Option>
            <Option value="rating">Đánh giá cao</Option>
          </Select>
        </div>
      </div>

          {sortedEntries.length === 0 ? (
        <Empty
          description="Chưa có món nào được đăng"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <Row gutter={[24, 24]}>
          {sortedEntries.map((entry) => (
            <Col xs={24} sm={12} md={8} lg={6} key={entry._id || entry.id}>
              <Card
                className="entry-card"
                hoverable
                cover={
                  <div className="entry-image-wrapper">
                    <img alt={entry.title} src={entry.image} />
                    {entry.isPremium && (
                      <Tag className="entry-premium-tag" color="gold">
                        <Icon icon="mdi:crown" style={{ marginRight: "4px" }} />
                        Premium
                      </Tag>
                    )}
                  </div>
                }
                onClick={() => handleCardClick(entry)}
              >
                <Card.Meta
                  title={
                    <div className="entry-title">
                      <span>{entry.title}</span>
                    </div>
                  }
                  description={
                    <div className="entry-info">
                      <Space
                        direction="vertical"
                        size={8}
                        style={{ width: "100%" }}
                      >
                        <div className="entry-author">
                          <Avatar size="small" src={entry.authorAvatar || entry.author?.avatar || guest}>
                            {entry.author?.[0] || entry.author?.name?.[0]}
                          </Avatar>
                          <span>{entry.author || entry.author?.name}</span>
                        </div>

                        <div className="entry-stats">
                          <Space size="middle">
                            <span className="entry-stat">
                              <Icon icon="mdi:heart" />
                              {entry.likes?.length || entry.likes || 0}
                            </span>
                            <span className="entry-stat">
                              <Icon icon="mdi:star" />
                              {entry.rating || 0}
                            </span>
                            <span className="entry-stat">
                              <Icon icon="mdi:eye" />
                              {entry.views || 0}
                            </span>
                          </Space>
                        </div>

                        <div className="entry-date">
                          <Icon
                            icon="mdi:clock-outline"
                            style={{ marginRight: "4px" }}
                          />
                          {new Date(entry.submittedAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                      </Space>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default DetailEntries;
