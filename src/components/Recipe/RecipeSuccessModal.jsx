import React from "react";
import { Modal, Button } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; 
import "../../pages/style/CreateRecipe.css";

export default function RecipeSuccessModal({ open, onClose }) {
  const navigate = useNavigate(); 

  const handleLater = () => {
    onClose(); 
    navigate("/recipe-detail"); 
  };

  return (
    <Modal
      open={open}
      footer={null}
      onCancel={onClose}
      centered
      width={560}
      className="recipe-success-modal"
    >
      <div className="success-modal-content">
        {/* ICON THƯ */}
        <div className="envelope-icon-wrapper">
          <div className="envelope-body"></div>
          <div className="envelope-flap"></div>
          <div className="envelope-paper"></div>
        </div>

        <h2 className="success-title">Công thức của bạn đã lên sóng! 🎉</h2>
        <p className="success-subtitle">Nhận email khi có cooksnap mới?</p>

        <p className="success-note">
          Bạn sẽ nhận được lời “cảm ơn” bằng ảnh từ người đã làm theo công thức.
        </p>

        <div className="success-buttons">
          <Button
            type="primary"
            icon={<MailOutlined />}
            className="success-btn-main"
            onClick={onClose}
          >
            Vâng, hãy gửi email cho tôi
          </Button>

          {/* Nút "Thiết lập sau" sẽ chuyển trang */}
          <Button
            type="link"
            className="success-btn-later"
            onClick={handleLater}
          >
            Thiết lập sau
          </Button>
        </div>
      </div>
    </Modal>
  );
}
