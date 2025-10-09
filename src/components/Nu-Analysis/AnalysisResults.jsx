import React from 'react';
import { Card, Progress, Typography, Row, Col, Statistic, List, Tag, Alert, Button, Result, Empty, Space } from 'antd';
import { ReloadOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const AnalysisResults = ({ analysisResult, loading, onNewAnalysis }) => {
  const getHealthScoreColor = (score) => {
    if (score >= 80) return '#52c41a';
    if (score >= 60) return '#faad14';
    return '#ff4d4f';
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'success';
    if (confidence >= 70) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Card className="results-card" title="Kết quả phân tích">
        <Result
          icon={<Progress type="circle" percent={75} strokeColor="#1890ff" />}
          title="AI đang phân tích ảnh của bạn..."
          subTitle="Đang nhận diện món ăn và tính toán dinh dưỡng"
        />
      </Card>
    );
  }

  if (!analysisResult) {
    return (
      <Card className="results-card" title="Kết quả phân tích">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Space direction="vertical" size="small" align="center">
              <Text>Chưa có kết quả phân tích</Text>
              <Text type="secondary">Hãy tải lên ảnh món ăn để bắt đầu phân tích</Text>
            </Space>
          }
        />
      </Card>
    );
  }

  return (
    <Card className="results-card" title="Kết quả phân tích">
      <div className="analysis-results">
        {/* Health Score */}
        <div className="health-score-section">
          <Title level={4}>Điểm sức khỏe</Title>
          <div className="health-score-display">
            <Progress
              type="circle"
              percent={analysisResult.healthScore}
              strokeColor={getHealthScoreColor(analysisResult.healthScore)}
              format={() => (
                <div className="score-text">
                  <div className="score-number">{analysisResult.healthScore}</div>
                  <div className="score-label">/100</div>
                </div>
              )}
            />
          </div>
        </div>

        {/* Total Nutrition */}
        <div className="total-nutrition-section">
          <Title level={4}>Tổng dinh dưỡng</Title>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Statistic
                title="Calories"
                value={analysisResult.totalNutrition.calories}
                suffix="kcal"
                valueStyle={{ color: '#F8B602' }}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Protein"
                value={analysisResult.totalNutrition.protein}
                suffix="g"
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Carbs"
                value={analysisResult.totalNutrition.carbs}
                suffix="g"
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Fat"
                value={analysisResult.totalNutrition.fat}
                suffix="g"
                valueStyle={{ color: '#fa541c' }}
              />
            </Col>
          </Row>
        </div>

        {/* Food Items */}
        <div className="food-items-section">
          <Title level={4}>Món ăn được nhận diện</Title>
          <List
            dataSource={analysisResult.foodItems}
            renderItem={(item) => (
              <List.Item className="food-item">
                <div className="food-item-content">
                  <div className="food-info">
                    <Title level={5} className="food-name">{item.name}</Title>
                    <Text type="secondary">{item.quantity}</Text>
                    <div className="food-nutrition">
                      <Tag color="orange">{item.calories} kcal</Tag>
                      <Tag color="green">P: {item.nutrition.protein}g</Tag>
                      <Tag color="blue">C: {item.nutrition.carbs}g</Tag>
                      <Tag color="red">F: {item.nutrition.fat}g</Tag>
                    </div>
                  </div>
                  <div className="confidence-score">
                    <Tag color={getConfidenceColor(item.confidence)}>
                      {item.confidence}% chính xác
                    </Tag>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>

        {/* Recommendations */}
        <div className="recommendations-section">
          <Title level={4}>
            <InfoCircleOutlined /> Gợi ý dinh dưỡng
          </Title>
          <List
            dataSource={analysisResult.recommendations}
            renderItem={(recommendation) => (
              <List.Item>
                <Alert
                  message={recommendation}
                  type="info"
                  showIcon
                  className="recommendation-alert"
                />
              </List.Item>
            )}
          />
        </div>

        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={onNewAnalysis}
          className="new-analysis-button"
          block
        >
          Phân tích ảnh mới
        </Button>
      </div>
    </Card>
  );
};

export default AnalysisResults;
