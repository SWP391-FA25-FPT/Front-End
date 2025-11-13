import React from "react";
import { Input, Select, Radio, Space } from "antd";
import { Icon } from "@iconify/react";

const { Search } = Input;
const { Option } = Select;

const FilterBar = ({
  search,
  setSearch,
  status,
  setStatus,
  category,
  setCategory,
}) => {
  return (
    <div className="challenge-filter-bar">
      <div className="filter-search">
        <Search
          placeholder="Tìm kiếm thử thách..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="large"
          prefix={<Icon icon="mdi:magnify" style={{ fontSize: "20px" }} />}
          style={{ maxWidth: 400 }}
        />
      </div>

      <Space size="middle" wrap className="filter-controls">
        <div className="filter-group">
          <Icon
            icon="mdi:filter-outline"
            style={{ fontSize: "20px", marginRight: "8px" }}
          />
          <Radio.Group
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="all">Tất cả</Radio.Button>
            <Radio.Button value="ongoing">Đang diễn ra</Radio.Button>
            <Radio.Button value="upcoming">Sắp diễn ra</Radio.Button>
            <Radio.Button value="ended">Đã kết thúc</Radio.Button>
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
            size="large"
          >
            <Option value="all">Tất cả danh mục</Option>
            <Option value="healthy">Healthy</Option>
            <Option value="dessert">Món tráng miệng</Option>
            <Option value="asian">Món Á</Option>
            <Option value="western">Món Tây</Option>
            <Option value="vegan">Chay</Option>
          </Select>
        </div>
      </Space>
    </div>
  );
};

export default FilterBar;