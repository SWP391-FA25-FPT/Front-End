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
  { title: "Bắt đầu với M&M", link: "/support/getting-started" },
  { title: "Theo dõi dinh dưỡng", link: "/support/nutrition-tracking" },
  { title: "Lên kế hoạch bữa ăn", link: "/support/meal-planner" },
  { title: "Tài khoản & Thanh toán", link: "/support/account-billing" },
  { title: "Quyền riêng tư & Bảo mật", link: "/support/privacy-security" },
];

const ChallengesCommunity = () => {
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

            <Title level={1} className="fw-bold display-6 mb-3">Thử thách & Cộng đồng</Title>
            <Paragraph type="secondary" style={{ fontSize: '16px' }}>
              Cập nhật lần cuối: 11/11/2025
            </Paragraph>
            <Paragraph style={{ fontSize: '16px' }} className="mb-4">
              Hành trình dinh dưỡng sẽ dễ dàng hơn khi có bạn đồng hành.
              Tham gia cộng đồng M&M để có thêm động lực và kiến thức.
            </Paragraph>

            {/* ----- Nội dung Collapse ----- */}
            <Collapse defaultActiveKey={['1']} accordion size="large" className="support-collapse">
              <Panel header="Tham gia Thử thách" key="1">
                <Paragraph>
                  Các thử thách (Challenges) là các sự kiện ngắn ngày do M&M
                  tổ chức để khuyến khích cộng đồng cùng đạt một mục tiêu chung.
                </Paragraph>
                <ul className="ps-4">
                  <li><Text strong>Cách thức:</Text> Truy cập trang <Text code>/challenge</Text>
                  để xem các thử thách đang và sắp diễn ra (ví dụ: '7 ngày Keto', '30 ngày không đường').</li>
                  <li><Text strong>Tham gia:</Text> Nhấn 'Tham gia' và làm theo các yêu cầu của thử thách
                  (ví dụ: ghi lại nhật ký ăn uống mỗi ngày, nấu một công thức chỉ định).</li>
                  <li><Text strong>Phần thưởng:</Text> Những người hoàn thành thử thách có thể
                  nhận được huy hiệu (badge) đặc biệt trên profile.</li>
                </ul>
              </Panel>

              <Panel header="Kết nối qua Blog" key="2">
                <Paragraph>
                  Trang Blog là nơi mọi người chia sẻ kiến thức và hành trình của mình.
                </Paragraph>
                <ul className="ps-4">
                  <li><Text strong>Đọc Blog:</Text> Guest và thành viên đều có thể đọc blog
                  để tìm cảm hứng, công thức, hoặc các mẹo hữu ích.</li>
                  <li><Text strong>Viết Blog (Cần đăng nhập):</Text> Chúng tôi khuyến khích bạn
                  chia sẻ câu chuyện của mình. Bạn có thể viết về:
                    <ul className="ps-4 mt-2">
                      <li>Hành trình giảm/tăng cân của bạn.</li>
                      <li>Review về một chế độ ăn (Keto, Low-carb...).</li>
                      <li>Các mẹo nấu ăn nhanh, lành mạnh.</li>
                    </ul>
                  </li>
                  <li><Text strong>Tương tác:</Text> Đừng quên để lại bình luận (cần đăng nhập)
                  để cổ vũ hoặc đặt câu hỏi cho tác giả.</li>
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

export default ChallengesCommunity;