import React from "react";
import { Layout, Typography, Row, Col, Divider } from "antd";

const { Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const AdminFooter = () => {
  return (
    <Footer
      style={{
        backgroundColor: "#f9f9f9",
        padding: "60px 80px",
        textAlign: "left",
      }}
    >
      <Row gutter={[48, 24]}>
        {/* Cột 1 */}
        <Col xs={24} sm={12} md={8}>
          <Title level={4} style={{ marginBottom: 16 }}>
            Meta Meal - Admin
          </Title>
          <Paragraph style={{ color: "#555" }}>
            Trang quản trị hệ thống <strong>M&M</strong> giúp đội ngũ vận hành
            kiểm soát nội dung, người dùng và thống kê doanh thu một cách dễ dàng.
          </Paragraph>
          <Paragraph style={{ color: "#555" }}>
            Hãy quản lý nền tảng của bạn thật hiệu quả để tạo ra trải nghiệm tốt nhất cho người dùng.
          </Paragraph>
        </Col>

        {/* Cột 2 */}
        <Col xs={24} sm={12} md={8}>
          <Title level={4} style={{ marginBottom: 16 }}>
            Liên Hệ Hỗ Trợ
          </Title>
          <Paragraph style={{ color: "#555" }}>
            - Email: support@metameal.app
            <br />
            - Hotline: 0123 456 789
            <br />
            - Truy cập mục <strong>Phản hồi người dùng</strong> trong menu để xem tất cả các góp ý.
          </Paragraph>
        </Col>

        {/* Cột 3 */}
        <Col xs={24} sm={12} md={8}>
          <Title level={4} style={{ marginBottom: 16 }}>
            Chính Sách & Tài Liệu
          </Title>
          <Paragraph style={{ color: "#555" }}>
            - Chính sách bảo mật dữ liệu
            <br />
            - Điều khoản sử dụng
            <br />
            - Quy định quản lý tài khoản & nội dung
          </Paragraph>
        </Col>
      </Row>

      <Divider />

      <Text
        type="secondary"
        style={{
          display: "block",
          textAlign: "center",
          fontSize: 13,
          marginTop: 12,
        }}
      >
        Meta Meal Admin ©{new Date().getFullYear()} — Managed by M&M Team
      </Text>
    </Footer>
  );
};

export default AdminFooter;
