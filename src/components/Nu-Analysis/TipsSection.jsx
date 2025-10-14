import React from 'react';
import { Card, Row, Col, Space, Typography } from 'antd';
import { Icon } from '@iconify/react';

const { Title, Text } = Typography;

const TipsSection = () => {
  const tips = [
    {
      icon: 'mdi:lightbulb-outline',
      title: 'Ánh sáng tốt',
      description: 'Chụp ở nơi có ánh sáng tự nhiên hoặc đủ sáng'
    },
    {
      icon: 'mdi:camera-outline',
      title: 'Góc chụp',
      description: 'Chụp từ trên xuống để thấy rõ toàn bộ món ăn'
    },
    {
      icon: 'mdi:focus-field',
      title: 'Độ nét',
      description: 'Đảm bảo ảnh rõ nét, không bị mờ'
    },
    {
      icon: 'mdi:food',
      title: 'Món ăn',
      description: 'Chụp món ăn đã được bày ra đĩa/bát'
    }
  ];

  return (
    <Card title="Mẹo chụp ảnh tốt nhất" className="tips-card">
      <Row gutter={[16, 16]} style={{ display: 'flex', alignItems: 'stretch' }}>
        {tips.map((tip, index) => (
          <Col xs={24} sm={12} md={6} key={index} style={{ display: 'flex' }}>
            <Card 
              size="small" 
              hoverable 
              className="tip-item"
              style={{ 
                width: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                height: '100%'
              }}
              styles={{
                body: {
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'center'
                }
              }}
            >
              <Space direction="vertical" align="center" style={{ width: '100%', height: '100%', justifyContent: 'center', padding: '12px 0' }}>
                <Icon icon={tip.icon} className="tip-icon" />
                <Title level={5} style={{ margin: '8px 0 6px 0' }}>{tip.title}</Title>
                <Text type="secondary" style={{ textAlign: 'center', fontSize: '13px' }}>
                  {tip.description}
                </Text>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default TipsSection;
