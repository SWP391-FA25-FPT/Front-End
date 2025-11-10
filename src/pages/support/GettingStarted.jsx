import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/layout/AppLayout';
import { Button, Collapse, Typography } from 'antd'; // Thêm Collapse
import { Icon } from '@iconify/react';
import '../style/SupportPage.css'; // Tái sử dụng CSS

const { Panel } = Collapse;
const { Paragraph, Text, Title } = Typography;

// Danh sách các mục liên quan
const relatedLinks = [
  { title: "Theo dõi dinh dưỡng", link: "/support/nutrition-tracking" },
  { title: "Lên kế hoạch bữa ăn", link: "/support/meal-planner" },
  { title: "Tài khoản & Thanh toán", link: "/support/account-billing" },
  { title: "Thử thách & Cộng đồng", link: "/support/challenges-community" },
  { title: "Quyền riêng tư & Bảo mật", link: "/support/privacy-security" },
];

const GettingStarted = () => {
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

            <Title level={1} className="fw-bold display-6 mb-3">Bắt đầu với M&M</Title>
            <Paragraph type="secondary" style={{ fontSize: '16px' }}>
              Cập nhật lần cuối: 11/11/2025
            </Paragraph>
            <Paragraph style={{ fontSize: '16px' }} className="mb-4">
              Chào mừng bạn đến với M&M! Đây là hướng dẫn chi tiết để bạn tận dụng tối đa
              các tính năng của ứng dụng và bắt đầu hành trình dinh dưỡng của mình.
            </Paragraph>

            {/* ----- Nội dung Collapse ----- */}
            <Collapse defaultActiveKey={['1']} accordion size="large" className="support-collapse">
              <Panel header="Bước 1: Hoàn thành Khảo sát (Survey)" key="1">
                <Paragraph>
                  Ngay sau khi đăng ký, bạn sẽ được đưa đến trang Khảo sát. Đây là bước CỰC KỲ QUAN TRỌNG.
                  Chúng tôi cần các thông tin này để cá nhân hóa trải nghiệm của bạn:
                </Paragraph>
                <ul className="ps-4">
                  <li><Text strong>Thông tin cơ bản:</Text> Chiều cao, cân nặng, tuổi, giới tính.</li>
                  <li><Text strong>Mục tiêu:</Text> Bạn muốn giảm cân, giữ dáng hay tăng cơ?</li>
                  <li><Text strong>Mức độ hoạt động:</Text> Bạn làm việc văn phòng hay vận động thường xuyên?</li>
                  <li><Text strong>Dị ứng & Kiêng cữ:</Text> Bạn có dị ứng với đậu phộng, hải sản, hay đang theo chế độ ăn kiêng (Keto, Vegan) không?</li>
                </ul>
                <Paragraph>
                  Dựa trên thông tin này, chúng tôi sẽ tính toán TDEE (Tổng năng lượng tiêu thụ hàng ngày)
                  và lượng Macro (Carb, Protein, Fat) khuyến nghị cho bạn.
                </Paragraph>
              </Panel>

              <Panel header="Bước 2: Khám phá Trang chủ" key="2">
                <Paragraph>
                  Trang chủ là trung tâm điều khiển của bạn. Bạn sẽ thấy các mục chính:
                </Paragraph>
                <ul className="ps-4">
                  <li><Text strong>Từ khóa thịnh hành:</Text> Các xu hướng tìm kiếm nổi bật trong cộng đồng (ví dụ: 'Giảm mỡ', 'Salad', 'Keto').</li>
                  <li><Text strong>Mới xem gần đây (Nếu đã login):</Text> Truy cập nhanh các công thức bạn vừa xem.</li>
                  <li><Text strong>Gợi ý Premium:</Text> Các tính năng cao cấp nổi bật giúp bạn đạt mục tiêu nhanh hơn.</li>
                </ul>
              </Panel>

              <Panel header="Bước 3: Tìm hiểu các tính năng Premium" key="3">
                <Paragraph>
                  Gói Premium mở khóa các công cụ mạnh mẽ nhất của M&M:
                </Paragraph>
                <ul className="ps-4">
                  <li><Text strong>AI Tư Vấn M&M:</Text> Chatbot AI thông minh, trả lời mọi câu hỏi về dinh dưỡng, công thức.</li>
                  <li><Text strong>Phân tích Dinh dưỡng bằng ảnh:</Text> Chụp ảnh bữa ăn, AI sẽ phân tích calo và macros giúp bạn.</li>
                  <li><Text strong>Tạo Thực Đơn Premium:</Text> Tạo kế hoạch bữa ăn hàng tuần dựa trên mục tiêu calo của bạn.</li>
                </ul>
              </Panel>

              <Panel header="Bước 4: Tạo nội dung đầu tiên của bạn" key="4">
                <Paragraph>
                  Đừng ngần ngại đóng góp cho cộng đồng! Bạn có thể:
                </Paragraph>
                <ul className="ps-4">
                  <li><Text strong>Viết món mới:</Text> Chia sẻ công thức nấu ăn của riêng bạn. Thêm hình ảnh, hướng dẫn, và lượng dinh dưỡng chi tiết.</li>
                  <li><Text strong>Viết Blog:</Text> Chia sẻ hành trình, mẹo giảm cân, hoặc các bài đánh giá về chế độ ăn.</li>
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

export default GettingStarted;