import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/layout/AppLayout';
import { Button, Collapse, Typography, Alert } from 'antd'; // Thêm Collapse
import { Icon } from '@iconify/react';
import '../style/SupportPage.css'; // Tái sử dụng CSS

const { Panel } = Collapse;
const { Paragraph, Text, Title } = Typography;

// Danh sách các mục liên quan
const relatedLinks = [
  { title: "Bắt đầu với M&M", link: "/support/getting-started" },
  { title: "Theo dõi dinh dưỡng", link: "/support/nutrition-tracking" },
  { title: "Tài khoản & Thanh toán", link: "/support/account-billing" },
  { title: "Thử thách & Cộng đồng", link: "/support/challenges-community" },
  { title: "Quyền riêng tư & Bảo mật", link: "/support/privacy-security" },
];

const MealPlanner = () => {
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

            <Title level={1} className="fw-bold display-6 mb-3">Lên kế hoạch bữa ăn</Title>
            <Paragraph type="secondary" style={{ fontSize: '16px' }}>
              Cập nhật lần cuối: 11/11/2025
            </Paragraph>
            <Paragraph style={{ fontSize: '16px' }} className="mb-4">
              Lên kế hoạch bữa ăn giúp bạn tiết kiệm thời gian, tiền bạc và đảm bảo
              bạn luôn đi đúng hướng với mục tiêu dinh dưỡng của mình.
            </Paragraph>
            <Alert 
              message="Đây là tính năng Premium" 
              description="Tính năng 'Tạo Thực Đơn Premium' yêu cầu tài khoản của bạn phải được nâng cấp."
              type="info"
              showIcon
              className="mb-4"
            />

            {/* ----- Nội dung Collapse ----- */}
            <Collapse defaultActiveKey={['1']} accordion size="large" className="support-collapse">
              <Panel header="Tính năng 'Tạo Thực Đơn Premium' là gì?" key="1">
                <Paragraph>
                  Đây là công cụ AI giúp bạn tự động tạo ra một kế hoạch bữa ăn
                  (meal plan) cho nhiều ngày dựa trên các thông số bạn cung cấp.
                  Nó sẽ tự động chọn các công thức phù hợp từ cơ sở dữ liệu của M&M
                  để đảm bảo bạn đạt được mục tiêu calo và macros.
                </Paragraph>
              </Panel>

              <Panel header="Cách tạo một thực đơn mới" key="2">
                <ol className="ps-4">
                  <li className="mb-2">Truy cập <Text code>Premium - Tạo Thực Đơn Premium</Text>.</li>
                  <li className="mb-2">Chọn số ngày bạn muốn lên kế hoạch (ví dụ: 7 ngày).</li>
                  <li className="mb-2">Nhập mục tiêu calo hàng ngày của bạn (ví dụ: 2000 calo).
                  Hệ thống sẽ tự động đề xuất dựa trên khảo sát của bạn, nhưng bạn có thể tùy chỉnh.</li>
                  <li className="mb-2">Chọn chế độ ăn kiêng hoặc các dị ứng (nếu có).</li>
                  <li className="mb-2">Nhấn "Tạo Kế hoạch". AI sẽ mất vài giây để tổng hợp
                  và trả về một kế hoạch hoàn chỉnh cho bạn.</li>
                </ol>
              </Panel>
              
              <Panel header="Chỉnh sửa và Tùy biến kế hoạch" key="3">
                <Paragraph>
                  Sau khi AI tạo kế hoạch, bạn toàn quyền chỉnh sửa nó:
                </Paragraph>
                <ul className="ps-4">
                  <li><Text strong>Hoán đổi (Swap):</Text> Không thích món 'Cá hồi nướng' cho bữa tối?
                  Nhấn nút 'Swap' và AI sẽ đề xuất một món khác có lượng calo tương đương.</li>
                  <li><Text strong>Thay thế thủ công:</Text> Bạn có thể xóa một món ăn và
                  thêm vào công thức của riêng bạn hoặc một món bạn yêu thích từ 'Kho Món Ngon'.</li>
                  <li><Text strong>Lưu lại:</Text> Đừng quên lưu lại kế hoạch để sử dụng cho tuần sau!</li>
                </ul>
              </Panel>

              <Panel header="Khám phá 'Top Thực Đơn Xem Nhiều Nhất'" key="4">
                <Paragraph>
                  Nếu bạn cần cảm hứng, hãy truy cập trang <Text strong>Top Thực Đơn Xem Nhiều Nhất</Text>.
                  Đây là trang công khai (guest có thể xem) tổng hợp các kế hoạch bữa ăn
                  được cộng đồng yêu thích và lưu lại nhiều nhất.
                </Paragraph>
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

export default MealPlanner;