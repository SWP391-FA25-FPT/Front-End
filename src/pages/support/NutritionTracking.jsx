import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/layout/AppLayout';
import { Button, Collapse, Typography, Alert } from 'antd'; // Thêm Collapse, Alert
import { Icon } from '@iconify/react';
import '../style/SupportPage.css'; // Tái sử dụng CSS

const { Panel } = Collapse;
const { Paragraph, Text, Title } = Typography;

// Danh sách các mục liên quan
const relatedLinks = [
  { title: "Bắt đầu với M&M", link: "/support/getting-started" },
  { title: "Lên kế hoạch bữa ăn", link: "/support/meal-planner" },
  { title: "Tài khoản & Thanh toán", link: "/support/account-billing" },
  { title: "Thử thách & Cộng đồng", link: "/support/challenges-community" },
  { title: "Quyền riêng tư & Bảo mật", link: "/support/privacy-security" },
];

const NutritionTracking = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <Container className="py-5">
        <Row className="justify-content-center">
          {/* CỘT CHÍNH (Nội dung) */}
          <Col md={7} lg={8} className="support-article-content">
            <Button 
              type="text" 
              onClick={() => navigate('/support')} 
              className="mb-3 d-flex align-items-center ps-0"
              style={{ color: '#F59E0B', fontWeight: 600 }}
            >
              <Icon icon="ph:arrow-left-bold" className="me-1" />
              Quay về Trung tâm Hỗ trợ
            </Button>

            <Title level={1} className="fw-bold display-6 mb-3">Theo dõi dinh dưỡng</Title>
            <Paragraph type="secondary" style={{ fontSize: '16px' }}>
              Cập nhật lần cuối: 11/11/2025
            </Paragraph>
            <Paragraph style={{ fontSize: '16px' }} className="mb-4">
              "You can't manage what you don't measure" (Bạn không thể quản lý thứ bạn không đo lường). 
              Theo dõi dinh dưỡng là chìa khóa để hiểu rõ cơ thể và đạt được mục tiêu.
            </Paragraph>

            {/* ----- Nội dung Collapse ----- */}
            <Collapse defaultActiveKey={['1']} accordion size="large" className="support-collapse">
              <Panel header="Tại sao nên theo dõi dinh dưỡng?" key="1">
                <Paragraph>
                  Việc ghi chép lại những gì bạn ăn (food logging) mang lại nhiều lợi ích:
                </Paragraph>
                <ul className="ps-4">
                  <li><Text strong>Nhận thức:</Text> Bạn sẽ nhận ra mình đang tiêu thụ bao nhiêu calo,
                  đường, hay chất béo - thường là cao hơn bạn nghĩ.</li>
                  <li><Text strong>Trách nhiệm:</Text> Khi biết mình phải ghi lại, bạn sẽ có xu hướng lựa chọn
                  thực phẩm lành mạnh hơn.</li>
                  <li><Text strong>Đạt mục tiêu:</Text> Đảm bảo bạn đang ăn đủ (hoặc ít hơn) lượng calo
                  và macros (Carb, Protein, Fat) mà mục tiêu của bạn đòi hỏi.</li>
                </ul>
              </Panel>

              <Panel header="Cách 1: Phân tích bằng ảnh (Tính năng Premium)" key="2">
                <Paragraph>
                  Đây là cách nhanh nhất để ghi lại nhật ký ăn uống.
                </Paragraph>
                <ol className="ps-4">
                  <li className="mb-2">Truy cập <Text code>Premium - Phân tích Dinh Dưỡng Bằng Ảnh</Text>.</li>
                  <li className="mb-2">Tải lên hoặc chụp ảnh bữa ăn của bạn.</li>
                  <li className="mb-2">AI của chúng tôi sẽ phân tích hình ảnh và đề xuất các món ăn
                  cùng khối lượng (ví dụ: '150g Ức gà nướng', '100g Bông cải xanh').</li>
                  <li className="mb-2">Bạn xác nhận hoặc chỉnh sửa lại cho chính xác.</li>
                  <li className="mb-2">Các thông số calo và macros sẽ tự động được thêm vào
                  nhật ký và trang 'Theo Dõi Tiến Độ' của bạn.</li>
                </ol>
              </Panel>
              
              <Panel header="Cách 2: Nhập thủ công (Miễn phí)" key="3">
                <Paragraph>
                  Bạn có thể tìm kiếm và thêm món ăn từ cơ sở dữ liệu của chúng tôi hoặc 
                  tạo món ăn của riêng bạn.
                </Paragraph>
                <ul className="ps-4">
                  <li><Text strong>Thêm từ Công thức:</Text> Khi xem một công thức trên M&M,
                  nhấn nút 'Thêm vào nhật ký' (I cooked this) để thêm nhanh.</li>
                  <li><Text strong>Tìm kiếm:</Text> Sử dụng thanh tìm kiếm để tìm các thực phẩm
                  đơn lẻ (ví dụ: 'Trứng', 'Táo') hoặc các món ăn phổ biến.</li>
                </ul>
              </Panel>

              <Panel header="Xem lại tiến độ ở đâu?" key="4">
                <Paragraph>
                  Tất cả dữ liệu bạn nhập sẽ được tổng hợp tại trang <Text strong>Theo Dõi Tiến Độ</Text>
                  (Progress Tracking). Tại đây bạn có thể xem:
                </Paragraph>
                <ul className="ps-4">
                  <li>Biểu đồ lượng calo tiêu thụ hàng ngày/hàng tuần.</li>
                  <li>Biểu đồ tỷ lệ Macros (Carb/Protein/Fat).</li>
                  <li>Biểu đồ thay đổi cân nặng (nếu bạn cập nhật trong Profile).</li>
                </ul>
              </Panel>
            </Collapse>
          
          </Col>

          {/* CỘT PHỤ (Các trang liên quan) */}
          <Col md={5} lg={4} className="ps-md-5 mt-5 mt-md-0">
            <div className="support-related-links">
              <h4 className="fw-bold mb-3">Các mục hỗ trợ khác</h4>
              <ul className="list-unstyled">
                {relatedLinks.map((item) => (
                  <li key={item.link} className="mb-2">
                    <Link to={item.link} className="support-related-link">
                      {item.title}
                      <Icon icon="ph:arrow-right-bold" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default NutritionTracking;