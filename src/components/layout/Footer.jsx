import React from "react";
// Sửa lỗi cú pháp: _from_ thành from
import { Typography, Row, Col } from "antd";

// Thêm Row và Col để chia bố cục
const { Title, Text, Paragraph, Link } = Typography;

const Footer = () => {
  return (
    // Sử dụng React.Fragment để nội dung hòa vào Layout.Footer
    <React.Fragment>
<<<<<<< Updated upstream
      <Title level={3}>
        Về M&M
        <br />
        <Paragraph level={5}>
          Sứ mệnh của M&M là làm cho việc vào bếp vui hơn mỗi ngày, vì chúng tôi
          tin rằng nấu nướng là chìa khoá cho một cuộc sống hạnh phúc hơn và
          khoẻ mạnh hơn cho con người, cộng đồng, và hành tinh này. Chúng tôi
          muốn hỗ trợ các đầu bếp gia đình trên toàn thế giới để họ có thể giúp
          đỡ nhau qua việc chia sẻ các món ngon và kinh nghiệm nấu ăn của mình.
        </Paragraph>
        <Paragraph>
          Đăng ký gói Premium để truy cập các chức năng và quyền lợi dành riêng
          khác!
        </Paragraph>
      </Title>
      <Title level={3}>Cộng Đồng M&M</Title>
      <Title level={3}>Tìm hiểu Thêm</Title>
      <Text className="tw:text-center tw:flex tw:justify-center">
        M&M ©{new Date().getFullYear()} Created by M&M Team
      </Text>
=======
      {/* Chia bố cục 3 cột */}
      <Row gutter={[16, 24]} style={{ padding: "24px 0" }}>
        
        {/* Cột 1: Về M&M */}
        <Col xs={24} md={10}>
          <Title level={4}>Về M&M</Title>
          <Paragraph>
            Sứ mệnh của M&M là làm cho việc vào bếp vui hơn mỗi ngày, vì chúng tôi
            tin rằng nấu nướng là chìa khoá cho một cuộc sống hạnh phúc hơn và
            khoẻ mạnh hơn cho con người, cộng đồng, và hành tinh này. Chúng tôi
            muốn hỗ trợ các đầu bếp gia đình trên toàn thế giới để họ có thể giúp
            đỡ nhau qua việc chia sẻ các món ngon và kinh nghiệm nấu ăn của mình.
          </Paragraph>
          <Paragraph>
            Đăng ký gói Premium để truy cập các chức năng và quyền lợi dành riêng
            khác!
          </Paragraph>
        </Col>

        {/* Cột 2: Cộng Đồng */}
        <Col xs={12} md={7}>
          <Title level={4}>Cộng Đồng M&M</Title>
          <Paragraph>
            <Link href="#">Blog</Link>
          </Paragraph>
          <Paragraph>
            <Link href="#">Thử thách</Link>
          </Paragraph>
          <Paragraph>
            <Link href="#">Đối tác</Link>
          </Paragraph>
        </Col>

        {/* Cột 3: Tìm hiểu thêm */}
        <Col xs={12} md={7}>
          <Title level={4}>Tìm hiểu Thêm</Title>
          <Paragraph>
            <Link href="#">Điều khoản dịch vụ</Link>
          </Paragraph>
          <Paragraph>
            <Link href="#">Chính sách bảo mật</Link>
          </Paragraph>
          <Paragraph>
            <Link href="#">Hỗ trợ</Link>
          </Paragraph>
        </Col>
      </Row>

      {/* Dòng Copyright ở cuối */}
      <div style={{ textAlign: "center", padding: "12px 0", borderTop: "1px solid rgba(128, 128, 128, 0.2)" }}>
        <Text>
          M&M ©{new Date().getFullYear()} Created by M&M Team
        </Text>
      </div>
>>>>>>> Stashed changes
    </React.Fragment>
  );
};

export default Footer;

