import React from "react";
import { Badge, Button } from "antd";
import { Icon } from "@iconify/react";

const NotificationBell = ({ count, onClick, loading }) => {
  return (
    <Badge count={count} size="small" overflowCount={99}>
      <Button
        type="text"
        shape="circle"
        onClick={onClick}
        loading={loading}
        icon={<Icon icon="mdi:bell-outline" width="24" height="24" />}
        style={{ color: "#4A5568" }}
      />
    </Badge>
  );
};

export default NotificationBell;


