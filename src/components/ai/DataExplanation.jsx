import React from "react";
import { Card, Table, Tag, Tooltip, Typography, Space } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { formatNutritionData, formatProgressData, explainNutritionTerm } from "../../utils/aiHelpers";
import "./DataExplanation.css";

const { Text, Title } = Typography;

const DataExplanation = ({ data, type = "nutrition" }) => {
  if (!data) return null;

  if (type === "nutrition") {
    const formatted = formatNutritionData(data);
    if (!formatted) return null;

    const nutritionTerms = [
      { key: "calories", label: "Calories", value: formatted.calories, term: "Calorie" },
      { key: "protein", label: "Protein", value: formatted.protein, term: "Protein" },
      { key: "carbs", label: "Carbohydrates", value: formatted.carbs, term: "Carbs" },
      { key: "fat", label: "Fat", value: formatted.fat, term: "Fat" },
    ];

    if (formatted.fiber) {
      nutritionTerms.push({ key: "fiber", label: "Fiber", value: formatted.fiber, term: null });
    }
    if (formatted.sugar) {
      nutritionTerms.push({ key: "sugar", label: "Sugar", value: formatted.sugar, term: null });
    }

    return (
      <Card className="data-explanation-card" size="small">
        <Title level={5} className="data-explanation-title">
          Thông tin dinh dưỡng
        </Title>
        <div className="nutrition-grid">
          {nutritionTerms.map((item) => (
            <div key={item.key} className="nutrition-item">
              <div className="nutrition-label">
                <Text strong>{item.label}</Text>
                {item.term && (
                  <Tooltip title={explainNutritionTerm(item.term)}>
                    <InfoCircleOutlined className="info-icon" />
                  </Tooltip>
                )}
              </div>
              <Text className="nutrition-value">{item.value}</Text>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (type === "progress") {
    const formatted = formatProgressData(data);
    if (!formatted) return null;

    const progressItems = [
      { key: "start", label: "Cân nặng ban đầu", value: formatted.startWeight },
      { key: "current", label: "Cân nặng hiện tại", value: formatted.currentWeight },
      { key: "target", label: "Cân nặng mục tiêu", value: formatted.targetWeight },
      { key: "change", label: "Thay đổi", value: formatted.weightChange },
      { key: "progress", label: "Tiến độ", value: formatted.progress },
    ];

    return (
      <Card className="data-explanation-card" size="small">
        <Title level={5} className="data-explanation-title">
          Tiến độ mục tiêu
        </Title>
        <div className="progress-grid">
          {progressItems.map((item) => (
            <div key={item.key} className="progress-item">
              <Text type="secondary" className="progress-label">
                {item.label}
              </Text>
              <Text strong className="progress-value">
                {item.value}
              </Text>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (type === "table") {
    // Try to parse table from markdown format
    const lines = data.split("\n").filter((line) => line.trim().startsWith("|"));
    if (lines.length < 2) return null;

    const headers = lines[0]
      .split("|")
      .map((h) => h.trim())
      .filter((h) => h);
    const rows = lines.slice(2).map((line) =>
      line
        .split("|")
        .map((cell) => cell.trim())
        .filter((cell) => cell)
    );

    const columns = headers.map((header, index) => ({
      title: header,
      dataIndex: `col${index}`,
      key: `col${index}`,
    }));

    const tableData = rows.map((row, rowIndex) => {
      const obj = { key: rowIndex };
      row.forEach((cell, cellIndex) => {
        obj[`col${cellIndex}`] = cell;
      });
      return obj;
    });

    return (
      <Card className="data-explanation-card" size="small">
        <div className="table-wrapper">
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            size="small"
            className="data-table"
          />
        </div>
      </Card>
    );
  }

  return null;
};

export default DataExplanation;

