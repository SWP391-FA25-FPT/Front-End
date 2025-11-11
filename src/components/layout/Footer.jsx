import React from "react";
import { Layout, Typography, Row, Col, Divider } from "antd";

const { Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const AppFooter = () => {
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
            Về M&M
          </Title>
          <Paragraph style={{ color: "#555" }}>
            Sứ mệnh của <strong>M&M</strong> là làm cho việc vào bếp vui hơn mỗi
            ngày, vì chúng tôi tin rằng nấu nướng là chìa khoá cho một cuộc sống
            hạnh phúc hơn và khoẻ mạnh hơn cho con người, cộng đồng và hành tinh.
          </Paragraph>
          <Paragraph style={{ color: "#555" }}>
            Đăng ký gói <strong>Premium</strong> để truy cập các chức năng và
            quyền lợi dành riêng khác!
          </Paragraph>
        </Col>

        {/* Cột 2 */}
        <Col xs={24} sm={12} md={8}>
          <Title level={4} style={{ marginBottom: 16 }}>
            Cộng Đồng M&M
          </Title>
          <Paragraph style={{ color: "#555" }}>
            - Tham gia nhóm Facebook để chia sẻ công thức.
            <br />
            - Theo dõi Instagram để cập nhật món mới.
            <br />
            - Gửi góp ý và ý tưởng của bạn cho chúng tôi.
          </Paragraph>
        </Col>

        {/* Cột 3 */}
        <Col xs={24} sm={12} md={8}>
          <Title level={4} style={{ marginBottom: 16 }}>
            Tìm Hiểu Thêm
          </Title>
          <Paragraph style={{ color: "#555" }}>
            - Giới thiệu đội ngũ M&M.
            <br />
            - Chính sách bảo mật & điều khoản sử dụng.
            <br />
            - Liên hệ hợp tác và hỗ trợ khách hàng.
          </Paragraph>
        </Col>
      </Row>

      <Divider />

      {/* Dòng cuối */}
      <Text
        type="secondary"
        style={{
          display: "block",
          textAlign: "center",
          fontSize: 13,
          marginTop: 12,
        }}
      >
        M&M ©{new Date().getFullYear()} — Created by M&M Team
      </Text>
    </Footer>
  );
};

export default AppFooter;
