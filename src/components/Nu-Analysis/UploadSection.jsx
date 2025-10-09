import React, { useState, useRef } from 'react';
import { Upload, Button, Card, Space, Image } from 'antd';
import { UploadOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Icon } from '@iconify/react';

const { Dragger } = Upload;

const UploadSection = ({ uploadedImage, setUploadedImage, onAnalyze, loading, previewVisible, setPreviewVisible }) => {
  const fileInputRef = useRef(null);

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
    };
    reader.readAsDataURL(file);
    return false; // Prevent default upload
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: 'image/*',
    beforeUpload: handleImageUpload,
    showUploadList: false,
    listType: 'picture-card',
    maxCount: 1,
  };

  return (
    <Card className="upload-card" title="Tải lên ảnh món ăn">
      {!uploadedImage ? (
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">
            Kéo thả ảnh vào đây hoặc <span className="upload-link">chọn ảnh</span>
          </p>
          <p className="ant-upload-hint">
            Hỗ trợ định dạng: JPG, PNG, JPEG (Tối đa 10MB)
          </p>
        </Dragger>
      ) : (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card
            cover={
              <Image
                src={uploadedImage}
                alt="Uploaded food"
                style={{ maxHeight: 200, objectFit: 'cover' }}
                preview={{
                  visible: previewVisible,
                  onVisibleChange: setPreviewVisible,
                }}
              />
            }
            actions={[
              <Button
                type="primary"
                icon={<EyeOutlined />}
                onClick={() => setPreviewVisible(true)}
              >
                Xem ảnh
              </Button>,
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleRemoveImage}
              >
                Xóa
              </Button>
            ]}
          />
          <Button
            type="primary"
            size="large"
            icon={<Icon icon="mdi:brain" />}
            onClick={onAnalyze}
            loading={loading}
            block
          >
            {loading ? 'Đang phân tích...' : 'Phân tích dinh dưỡng'}
          </Button>
        </Space>
      )}
    </Card>
  );
};

export default UploadSection;
