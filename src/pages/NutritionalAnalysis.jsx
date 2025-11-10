import React from 'react';
import { Result } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import AppLayout from '../components/layout/AppLayout';
import './style/NutritionalAnalysis.css';

const NutritionalAnalysis = () => {
  return (
    <AppLayout>
      <div className="nutritional-analysis-container">
        <div className="coming-soon-container">
          <Result
            icon={<ClockCircleOutlined style={{ color: '#f8b602', fontSize: '72px' }} />}
            title="Coming Soon"
            subTitle="Tính năng phân tích dinh dưỡng bằng hình ảnh đang được phát triển. Chúng tôi sẽ sớm ra mắt tính năng này!"
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default NutritionalAnalysis;
