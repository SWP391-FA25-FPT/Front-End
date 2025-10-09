import React, { useState } from 'react';
import { Row, Col, Modal } from 'antd';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/Nu-Analysis/PageHeader';
import UploadSection from '../components/Nu-Analysis/UploadSection';
import AnalysisResults from '../components/Nu-Analysis/AnalysisResults';
import TipsSection from '../components/Nu-Analysis/TipsSection';
import './style/NutritionalAnalysis.css';

const NutritionalAnalysis = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  // Mock analysis result for demonstration
  const mockAnalysisResult = {
    foodItems: [
      {
        name: "Cơm trắng",
        confidence: 95,
        quantity: "1 chén",
        calories: 130,
        nutrition: {
          protein: 2.7,
          carbs: 28,
          fat: 0.3,
          fiber: 0.4
        }
      },
      {
        name: "Thịt kho tàu",
        confidence: 88,
        quantity: "100g",
        calories: 180,
        nutrition: {
          protein: 15,
          carbs: 2,
          fat: 12,
          fiber: 0
        }
      },
      {
        name: "Rau muống xào",
        confidence: 92,
        quantity: "80g",
        calories: 25,
        nutrition: {
          protein: 2,
          carbs: 4,
          fat: 0.5,
          fiber: 2
        }
      }
    ],
    totalNutrition: {
      calories: 335,
      protein: 19.7,
      carbs: 34,
      fat: 12.8,
      fiber: 2.4
    },
    healthScore: 78,
    recommendations: [
      "Món ăn có lượng protein tốt, phù hợp cho bữa trưa",
      "Nên bổ sung thêm rau xanh để tăng chất xơ",
      "Có thể giảm lượng dầu mỡ trong món thịt kho"
    ]
  };

  const handleAnalyze = async () => {
    if (!uploadedImage) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setAnalysisResult(mockAnalysisResult);
      setLoading(false);
    }, 3000);
  };

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
    setUploadedImage(null);
  };

  return (
    <AppLayout>
      <div className="nutritional-analysis-container">
        <PageHeader />

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <UploadSection
              uploadedImage={uploadedImage}
              setUploadedImage={setUploadedImage}
              onAnalyze={handleAnalyze}
              loading={loading}
              previewVisible={previewVisible}
              setPreviewVisible={setPreviewVisible}
            />
          </Col>

          <Col xs={24} lg={12}>
            <AnalysisResults
              analysisResult={analysisResult}
              loading={loading}
              onNewAnalysis={handleNewAnalysis}
            />
          </Col>
        </Row>

        <TipsSection />
      </div>

      {/* Image Preview Modal */}
      <Modal
        title="Xem ảnh món ăn"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width="auto"
        centered
      >
        {uploadedImage && (
          <img
            src={uploadedImage}
            alt="Food preview"
            style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain' }}
          />
        )}
      </Modal>
    </AppLayout>
  );
};

export default NutritionalAnalysis;
