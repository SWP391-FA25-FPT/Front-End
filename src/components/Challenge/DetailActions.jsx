import React from "react";
import { Button, Space, message } from "antd";
import { Icon } from "@iconify/react";

const DetailActions = ({ status, onSubmit, onShare }) => {
  const handleSubmit = () => {
    if (status === "ended") {
      message.warning("Thử thách đã kết thúc!");
      return;
    }
    if (status === "upcoming") {
      message.info("Thử thách chưa bắt đầu!");
      return;
    }
    onSubmit();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    message.success("Đã sao chép link thử thách!");
    if (onShare) onShare();
  };

  return (
    <div className="detail-actions">
      <Space size="large">
        <Button
          type="primary"
          size="large"
          icon={<Icon icon="mdi:upload" />}
          onClick={handleSubmit}
          disabled={status !== "ongoing"}
          className="btn-submit-challenge"
        >
          {status === "ended"
            ? "Đã kết thúc"
            : status === "upcoming"
            ? "Chưa bắt đầu"
            : "Gửi món tham gia"}
        </Button>

        <Button
          size="large"
          icon={<Icon icon="mdi:share-variant" />}
          onClick={handleShare}
          className="btn-share-challenge"
        >
          Chia sẻ
        </Button>

        <Button
          size="large"
          icon={<Icon icon="mdi:bookmark-outline" />}
          className="btn-bookmark-challenge"
        >
          Lưu
        </Button>
      </Space>
    </div>
  );
};

export default DetailActions;
