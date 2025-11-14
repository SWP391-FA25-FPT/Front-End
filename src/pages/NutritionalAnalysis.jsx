import React, { useState, useEffect } from 'react';
import { Result, Button } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../context/useAuth';
import { isPremium } from '../utils/premium';
import PremiumNotice from '../components/PremiumNotice';
import './style/NutritionalAnalysis.css';

const NutritionalAnalysis = () => {
  const { user } = useAuth();
  const [premiumNoticeVisible, setPremiumNoticeVisible] = useState(false);

  // Auto-show premium notice on mount if not premium
  useEffect(() => {
    if (user && !isPremium(user)) {
      setPremiumNoticeVisible(true);
    }
  }, [user]);

  // Block access if not premium - show empty page with modal
  if (user && !isPremium(user)) {
    return (
      <AppLayout>
        <div className="nutritional-analysis-container">
          <div className="coming-soon-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h2 style={{ color: '#ffc107', marginBottom: '20px' }}>Tính Năng Premium</h2>
              <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
                Tính năng "Phân tích Dinh Dưỡng Bằng Ảnh" yêu cầu tài khoản Premium. Vui lòng nâng cấp để sử dụng.
              </p>
            </div>
          </div>
          <PremiumNotice
            visible={premiumNoticeVisible}
            onCancel={() => {
              setPremiumNoticeVisible(false);
              window.location.href = '/';
            }}
            featureName="Phân tích Dinh Dưỡng Bằng Ảnh"
          />
        </div>
      </AppLayout>
    );
  }

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
