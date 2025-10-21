import React from "react";
import { Card, Tag } from "antd";
import { Icon } from "@iconify/react";

const DetailInfo = ({ description, hashtags, category, requirements }) => {
  return (
    <Card className="detail-info-card" bordered={false}>
      <h2 className="detail-section-title">
        <Icon icon="mdi:information" style={{ marginRight: "8px" }} />
        Về thử thách này
      </h2>

      <div className="detail-description">
        {description.split("\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <div className="detail-meta">
        <div className="detail-meta-item">
          <Icon icon="mdi:tag" style={{ fontSize: "20px", color: "#f8b602" }} />
          <span className="detail-meta-label">Danh mục:</span>
          <Tag color="gold">{category}</Tag>
        </div>

        <div className="detail-meta-item">
          <Icon
            icon="mdi:pound"
            style={{ fontSize: "20px", color: "#1890ff" }}
          />
          <span className="detail-meta-label">Hashtags:</span>
          <div className="detail-hashtags">
            {hashtags.map((tag, index) => (
              <Tag key={index} color="blue">
                {tag}
              </Tag>
            ))}
          </div>
        </div>
      </div>

      {requirements && requirements.length > 0 && (
        <div className="detail-requirements">
          <h3>
            <Icon icon="mdi:clipboard-check" style={{ marginRight: "8px" }} />
            Yêu cầu đăng bài:
          </h3>
          <ul>
            {requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};

export default DetailInfo;
