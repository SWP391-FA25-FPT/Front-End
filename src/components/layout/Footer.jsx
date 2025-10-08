import React from "react";
import { Typography } from "antd";

const { Title, Text, Paragraph } = Typography;
const Footer = () => {
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};

export default Footer;
