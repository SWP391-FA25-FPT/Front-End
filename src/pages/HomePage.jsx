import React from "react";
import Layout from "../components/Layout/AppLayout";
import CardPopular from "../components/CardPopular/Index";
import Data from "../data/ListKey.json";
import "tailwindcss";
import { Typography } from "antd";
import { Container } from "react-bootstrap";

const { Title } = Typography;
const HomePage = () => {
  return (
    <React.Fragment>
      <Layout>
        <Container className="tw:py-4">
          <Title level={3}>Từ Khóa Thịnh Hành</Title>
          <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:lg:grid-cols-4 tw:gap-6 tw:py-2">
            {Data.map((item, index) => (
              <CardPopular key={index} title={item.name} src={item.image} />
            ))}
          </div>
          <Title level={3}>Món Bạn Mới Xem Gần Đây</Title>
          <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:lg:grid-cols-4 tw:gap-6 tw:py-2">
            {Data.map((item, index) => (
              <CardPopular key={index} title={item.name} src={item.image} />
            ))}
          </div>

        </Container>
      </Layout>
    </React.Fragment>
  );
};

export default HomePage;
