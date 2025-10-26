import React from "react";
import { Card, Calendar, Badge } from "antd";

const WeeklyOverview = ({ weeklyData }) => {
  const getListData = (value) => {
    const dateStr = value.format("YYYY-MM-DD");
    const dayData = weeklyData.find((d) => d.date === dateStr);

    if (!dayData) return [];

    const listData = [];
    if (dayData.exercised) {
      listData.push({ type: "success", content: "Đã tập luyện" });
    }
    if (dayData.metCalories) {
      listData.push({ type: "warning", content: "Đạt calories" });
    }
    if (dayData.metWater) {
      listData.push({ type: "processing", content: "Đủ nước" });
    }

    return listData;
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item, index) => (
          <li key={index}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card className="weekly-overview-card" title="Tổng quan tuần">
      <Calendar fullscreen={false} cellRender={dateCellRender} />
    </Card>
  );
};

export default WeeklyOverview;
