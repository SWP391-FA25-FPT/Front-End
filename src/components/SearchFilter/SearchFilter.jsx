import React, { useState, useEffect } from "react";
import { Card, Input, Switch, Space, Typography, Tag, Spin } from "antd";
import { Icon } from "@iconify/react";
import { getTrendingTags } from "../../apis/analytics";
import { useNavigate } from "react-router-dom";
import "./style.css";

const { Title, Text } = Typography;

const SearchFilter = () => {
  const navigate = useNavigate();
  const [trendingTags, setTrendingTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(true);

  // Fetch trending tags for "Tìm kiếm tương tự"
  useEffect(() => {
    const fetchTrendingTags = async () => {
      try {
        setLoadingTags(true);
        const response = await getTrendingTags(6);
        if (response.success) {
          setTrendingTags(response.data);
        }
      } catch (error) {
        console.error("Error fetching trending tags:", error);
      } finally {
        setLoadingTags(false);
      }
    };

    fetchTrendingTags();
  }, []);

  const handleTagClick = (tagName) => {
    navigate(`/search?q=${encodeURIComponent(tagName)}`);
  };

  return (
    <div className="search-filter-sidebar">
      {/* Tìm kiếm tương tự */}
      <Card className="filter-card custom-panel-elevated" bordered={false}> 
        <Title level={5} className="filter-section-title">
          Tìm kiếm tương tự
        </Title>
        {loadingTags ? (
          <div className="text-center py-3">
            <Spin size="small" />
          </div>
        ) : (
          <Space wrap size={[8, 8]}>
            {trendingTags.map((tag, index) => (
              <Tag
                key={index}
                className="trending-tag"
                color="orange"
                style={{ 
                  cursor: "pointer",
                  fontSize: "13px",
                  padding: "4px 12px",
                  borderRadius: "12px"
                }}
                onClick={() => handleTagClick(tag.name)}
              >
                {tag.name}
              </Tag>
            ))}
          </Space>
        )}
      </Card>

      {/* Sàng lọc */}
      <Card className="filter-card custom-panel-elevated" bordered={false}>
        <Title level={5} className="filter-section-title">
          <Icon icon="mdi:filter-outline" width="20" style={{ marginRight: "8px" }} />
          Sàng lọc
        </Title>
        
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <div>
            <Text className="filter-label">
              Hiển thị các món với:
            </Text>
            <Input
              placeholder="Gõ vào tên các nguyên liệu..."
              prefix={<Icon icon="mdi:magnify" width="16" />}
              className="filter-input"
              disabled
              style={{ marginTop: "8px" }}
            />
          </div>

          <div>
            <Text className="filter-label">
              Hiển thị các món không có:
            </Text>
            <Input
              placeholder="Gõ vào tên các nguyên liệu..."
              prefix={<Icon icon="mdi:close-circle-outline" width="16" />}
              className="filter-input"
              disabled
              style={{ marginTop: "8px" }}
            />
          </div>
        </Space>
      </Card>

      {/* Bộ lọc Premium (FIX màu nền vàng CỨNG) */}
      <Card className="filter-card premium-filter premium-static-box" bordered={false}>
        <Title level={5} className="filter-section-title">
          {/* FIX: Màu icon trắng cứng */}
          <Icon icon="mdi:crown" width="20" style={{ marginRight: "8px", color: "white" }} /> 
          Bộ lọc Premium
        </Title>
        
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <div className="d-flex justify-content-between align-items-center">
            <div style={{ flex: 1 }}>
              <Text className="filter-label">Món được Tin Cậy Cao</Text>
              <div>
                {/* FIX: Chữ phụ trong hộp vàng nên là màu trắng mờ */}
                <Text className="premium-text-secondary" style={{ fontSize: "12px" }}>
                  Hiển thị các món có hình trong từng bước
                </Text>
              </div>
            </div>
            <Switch disabled />
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <div style={{ flex: 1 }}>
              <Text className="filter-label">Món được Tin Cậy Cao</Text>
            </div>
            <Switch disabled />
          </div>
        </Space>

        <div 
          className="premium-notice"
        >
          <div className="d-flex align-items-start gap-2 premium-warning-box">
            <Icon 
              icon="mdi:information" 
              width="20" 
              // FIX: Màu icon trắng cứng
              style={{ color: "white", marginTop: "2px" }} 
            />
            <Text 
              style={{ fontSize: "12px", color: "white" }} 
            >
              Tính năng này yêu cầu tài khoản Premium
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SearchFilter;