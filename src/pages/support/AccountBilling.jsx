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
  { title: "Lên kế hoạch bữa ăn", link: "/support/meal-planner" },
  { title: "Thử thách & Cộng đồng", link: "/support/challenges-community" },
  { title: "Quyền riêng tư & Bảo mật", link: "/support/privacy-security" },
];

const AccountBilling = () => {
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

            <Title level={1} className="fw-bold display-6 mb-3">Tài khoản & Thanh toán</Title>
            <Paragraph type="secondary" style={{ fontSize: '16px' }}>
              Cập nhật lần cuối: 11/11/2025
            </Paragraph>
            <Paragraph style={{ fontSize: '16px' }} className="mb-4">
              Quản lý thông tin cá nhân, bảo mật và các gói đăng ký Premium của bạn.
            </Paragraph>
            <Alert 
              message="Yêu cầu Đăng nhập" 
              description="Tất cả các hành động trong mục này đều yêu cầu bạn phải đăng nhập vào tài khoản."
              type="warning"
              showIcon
              className="mb-4"
            />

            {/* ----- Nội dung Collapse ----- */}
            <Collapse defaultActiveKey={['1']} accordion size="large" className="support-collapse">
              <Panel header="Cập nhật Hồ sơ cá nhân (Profile)" key="1">
                <Paragraph>
                  Hồ sơ cá nhân là nơi lưu trữ các thông tin cơ bản và mục tiêu của bạn.
                  Bạn có thể truy cập trang <Text code>/user/:id/edit</Text> (hoặc <Text code>Thiết Lập</Text>) để:
                </Paragraph>
                <ul className="ps-4">
                  <li>Thay đổi Ảnh đại diện (Avatar).</li>
                  <li>Cập nhật Tên hiển thị (Username).</li>
                  <li>Cập nhật lại các chỉ số cơ thể (Cân nặng, Chiều cao).</li>
                  <li>Thiết lập lại Mục tiêu dinh dưỡng (TDEE, Macros) nếu mục tiêu của bạn thay đổi.</li>
                </ul>
              </Panel>

              <Panel header="Bảo mật và Đổi mật khẩu" key="2">
                <Paragraph>
                  Để đảm bảo an toàn cho tài khoản, bạn nên đổi mật khẩu định kỳ.
                </Paragraph>
                <ul className="ps-4">
                  <li><Text strong>Đổi mật khẩu:</Text> Trong trang <Text code>/user/:id/edit</Text>,
                  tìm tab 'Bảo mật' hoặc 'Đổi mật khẩu'. Bạn sẽ cần nhập mật khẩu cũ và mật khẩu mới.</li>
                  <li><Text strong>Quên mật khẩu:</Text> Nếu bạn quên mật khẩu, hãy đăng xuất và
                  sử dụng tính năng 'Quên mật khẩu' (Forgot Password) tại trang Đăng nhập.
                  Chúng tôi sẽ gửi một liên kết đặt lại mật khẩu về email của bạn.</li>
                </ul>
              </Panel>
              
              <Panel header="Quản lý Gói đăng ký (Subscription)" key="3">
                <Paragraph>
                  Trang <Text code>/subscription</Text> là nơi bạn quản lý các gói thanh toán Premium.
                </Paragraph>
                <ul className="ps-4">
                  <li><Text strong>Nâng cấp:</Text> Chọn gói (hàng tháng/hàng năm) và tiến hành thanh toán.</li>
                  <li><Text strong>Xem chi tiết gói:</Text> Xem ngày gia hạn tiếp theo, số tiền đã thanh toán.</li>
                  <li><Text strong>Hủy gói:</Text> Bạn có thể hủy gói Premium bất cứ lúc nào.
                  Bạn sẽ vẫn được sử dụng các tính năng Premium cho đến ngày hết hạn của chu kỳ đã thanh toán.</li>
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

export default AccountBilling;