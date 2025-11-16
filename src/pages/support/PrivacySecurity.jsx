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
  { title: "Tài khoản & Thanh toán", link: "/support/account-billing" },
  { title: "Thử thách & Cộng đồng", link: "/support/challenges-community" },
];

const PrivacySecurity = () => {
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

            <Title level={1} className="fw-bold display-6 mb-3">Quyền riêng tư & Bảo mật</Title>
            <Paragraph type="secondary" style={{ fontSize: '16px' }}>
              Cập nhật lần cuối: 11/11/2025
            </Paragraph>
            <Paragraph style={{ fontSize: '16px' }} className="mb-4">
              Sự tin tưởng của bạn là ưu tiên hàng đầu của chúng tôi.
              M&M cam kết bảo vệ thông tin cá nhân và dữ liệu sức khỏe của bạn.
            </Paragraph>

            {/* ----- Nội dung Collapse ----- */}
            <Collapse defaultActiveKey={['1']} accordion size="large" className="support-collapse">
              <Panel header="Cam kết của chúng tôi" key="1">
                <Paragraph>
                  M&M cam kết tuân thủ các quy định nghiêm ngặt nhất về bảo mật dữ liệu.
                  Chúng tôi sử dụng mã hóa (encryption) cho cả dữ liệu khi truyền tải (in-transit)
                  và khi lưu trữ (at-rest) để đảm bảo thông tin của bạn luôn an toàn.
                </Paragraph>
              </Panel>

              <Panel header="Dữ liệu chúng tôi thu thập" key="2">
                <Paragraph>
                  Để cung cấp dịch vụ cá nhân hóa, chúng tôi cần thu thập một số thông tin:
                </Paragraph>
                <ul className="ps-4">
                  <li><Text strong>Thông tin bạn cung cấp:</Text> Tên, email, mật khẩu (đã mã hóa),
                  và tất cả dữ liệu từ khảo sát (cân nặng, chiều cao, mục tiêu...).</li>
                  <li><Text strong>Dữ liệu bạn tạo ra:</Text> Nhật ký bữa ăn, công thức bạn tạo,
                  bài blog bạn viết, bình luận, và dữ liệu cân nặng bạn cập nhật.</li>
                  <li><Text strong>Thông tin thanh toán (Premium):</Text> Chúng tôi KHÔNG lưu trữ
                  thông tin thẻ tín dụng của bạn. Tất cả thanh toán được xử lý an toàn
                  thông qua một đối tác cổng thanh toán tuân thủ PCI.</li>
                </ul>
              </Panel>
              
              <Panel header="Cách chúng tôi sử dụng (và KHÔNG sử dụng) dữ liệu" key="3">
                <Paragraph>
                  <Text strong>Chúng tôi SỬ DỤNG dữ liệu để:</Text>
                </Paragraph>
                <ul className="ps-4 mb-3">
                  <li>Cá nhân hóa mục tiêu calo và macros cho bạn.</li>
                  <li>Đề xuất công thức, kế hoạch bữa ăn phù hợp.</li>
                  <li>Phân tích và hiển thị tiến độ của bạn (trên biểu đồ).</li>
                </ul>
                <Paragraph>
                  <Text strong>Chúng tôi KHÔNG BAO GIỜ:</Text>
                </Paragraph>
                <ul className="ps-4">
                  <li>Bán thông tin cá nhân hoặc dữ liệu sức khỏe của bạn cho các
                  bên quảng cáo hoặc bên thứ ba.</li>
                  <li>Chia sẻ dữ liệu của bạn mà không có sự đồng ý rõ ràng của bạn.</li>
                </ul>
              </Panel>
              
              <Panel header="Quyền của bạn" key="4">
                <Paragraph>
                  Bạn có toàn quyền kiểm soát dữ liệu của mình:
                </Paragraph>
                <ul className="ps-4">
                  <li><Text strong>Quyền truy cập & chỉnh sửa:</Text> Bạn có thể xem và
                  chỉnh sửa thông tin hồ sơ của mình bất cứ lúc nào tại trang <Text code>/user/:id/edit</Text>.</li>
                  <li><Text strong>Quyền xóa bỏ:</Text> Bạn có quyền yêu cầu xóa hoàn toàn
                  tài khoản và tất cả dữ liệu liên quan. Vui lòng liên hệ bộ phận hỗ trợ
                  (trang <Text code>/support</Text>) để thực hiện việc này.</li>
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

export default PrivacySecurity;