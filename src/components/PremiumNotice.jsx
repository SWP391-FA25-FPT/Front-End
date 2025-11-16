import React from 'react';
import { Modal, Button, Typography, Space } from 'antd';
import { CrownOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './PremiumNotice.css';

const { Title, Paragraph } = Typography;

const PremiumNotice = ({ visible, onCancel, featureName = 'tính năng này' }) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onCancel();
    navigate('/subscription');
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
      className="premium-notice-modal"
      width={500}
    >
      <div className="premium-notice-content">
        <div className="premium-notice-icon">
          <CrownOutlined style={{ fontSize: '48px', color: '#ffc107' }} />
        </div>
        <Title level={3} className="premium-notice-title">
          Tính Năng Premium
        </Title>
        <Paragraph className="premium-notice-description">
          {featureName} là tính năng Premium. Vui lòng nâng cấp tài khoản để sử dụng.
        </Paragraph>
        <div className="premium-features-list">
          <Paragraph strong>Các tính năng Premium bao gồm:</Paragraph>
          <ul>
            <li>AI Tư Vấn M&M</li>
            <li>Phân tích Dinh Dưỡng Bằng Ảnh</li>
            <li>Tạo Thực Đơn Premium</li>
            <li>Theo Dõi Tiến Độ</li>
            <li>Top Thực Đơn Xem Nhiều Nhất</li>
          </ul>
        </div>
        <Space className="premium-notice-actions" size="large">
          <Button onClick={onCancel}>
            Đóng
          </Button>
          <Button 
            type="primary" 
            icon={<CrownOutlined />}
            onClick={handleUpgrade}
            className="premium-upgrade-button"
          >
            Nâng Cấp Premium
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default PremiumNotice;

