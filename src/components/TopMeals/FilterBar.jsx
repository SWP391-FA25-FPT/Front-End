import React from "react";
import { Select, Radio, Space } from "antd";
import { Icon } from "@iconify/react";

const { Option } = Select;

const FilterBar = ({
  timeRange,
  setTimeRange,
  category,
  setCategory,
  sortBy,
  setSortBy,
}) => {
  return (
    <div className="filter-bar">
      <Space size="middle" wrap>
        <div className="filter-group">
          <Icon
            icon="mdi:clock-outline"
            style={{ fontSize: "20px", marginRight: "8px" }}
          />
          <Radio.Group
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <Radio.Button value="week">Tuần này</Radio.Button>
            <Radio.Button value="month">Tháng này</Radio.Button>
            <Radio.Button value="all">Tất cả</Radio.Button>
          </Radio.Group>
        </div>

        <div className="filter-group">
          <Icon
            icon="mdi:tag-outline"
            style={{ fontSize: "20px", marginRight: "8px" }}
          />
          <Select
            value={category}
            onChange={setCategory}
            style={{ width: 180 }}
          >
            <Option value="all">Tất cả danh mục</Option>
            <Option value="healthy">Healthy</Option>
            <Option value="weight-loss">Giảm cân</Option>
            <Option value="muscle-gain">Tăng cơ</Option>
            <Option value="vegetarian">Chay</Option>
            <Option value="keto">Keto</Option>
          </Select>
        </div>

        <div className="filter-group">
          <Icon
            icon="mdi:sort"
            style={{ fontSize: "20px", marginRight: "8px" }}
          />
          <Select value={sortBy} onChange={setSortBy} style={{ width: 150 }}>
            <Option value="views">Lượt xem</Option>
            <Option value="likes">Lượt thích</Option>
            <Option value="rating">Đánh giá</Option>
          </Select>
        </div>
      </Space>
    </div>
  );
};

export default FilterBar;
