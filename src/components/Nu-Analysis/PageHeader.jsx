import React from 'react';
import { Card, Result } from 'antd';
import { CameraOutlined } from '@ant-design/icons';

const PageHeader = () => {
  return (
    <Card className="analysis-header">
      <Result
        icon={<CameraOutlined style={{ fontSize: '48px', color: 'white' }} />}
        title="Phân Tích Dinh Dưỡng Bằng Ảnh"
        subTitle="Chụp ảnh món ăn của bạn và nhận phân tích dinh dưỡng chi tiết chỉ trong vài giây"
      />
    </Card>
  );
};

export default PageHeader;
