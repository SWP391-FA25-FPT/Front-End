import React from "react";
import Layout from "../components/layout/AppLayout";
import CardPopular from "../components/CardPopular/Index";
import CardRecent from "../components/CardRecent/Index";
import Card from "../components/Card/Index";
import Data from "../data/ListKey.json";
import RecentData from "../data/recentKey.json";
import ListPremium from "../data/ListPremium.json";
import { Typography, Space } from "antd";
import { Container } from "react-bootstrap";

const { Title } = Typography;
const HomePage = () => {
  return (
    <React.Fragment>
      <Layout>
        <Container className="py-4">
          <Space direction="vertical" size="middle">
            <Title level={3}>Từ Khóa Thịnh Hành</Title>
            <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:lg:grid-cols-4 tw:gap-6 tw:py-2">
              {Data.slice(0, 8).map((item, index) => (
                <CardPopular key={index} title={item.name} src={item.image} />
              ))}
            </div>

            <Title level={3}>Món Bạn Mới Xem Gần Đây</Title>
            <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:md:grid-cols-3 tw:lg:grid-cols-4 tw:xl:grid-cols-6 tw:gap-6 tw:py-2">
              {RecentData.slice(0, 6).map((item, index) => (
                <CardRecent
                  key={index}
                  title={item.title}
                  src={item.image}
                  avatar={item.avatar}
                  userName={item.userName}
                />
              ))}
            </div>
            <Title level={3}>Gói Premium</Title>
            <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:md:grid-cols-3 tw:lg:grid-cols-4 tw:xl:grid-cols-5 tw:gap-6 tw:py-2">
              {ListPremium.premiumFeatures.slice(0, 5).map((item, index) => (
                <Card
                  key={index}
                  title={item.title}
                  src={item.image}
                  description={item.description}
                />
              ))}
            </div>
            <Title level={3}>Từ khóa Bạn Mới Xem Gần Đây</Title>
            <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:md:grid-cols-3 tw:lg:grid-cols-4 tw:xl:grid-cols-6 tw:gap-6 tw:py-2">
              {Data.slice(0, 6).map((item, index) => (
                <Card
                  key={index}
                  title={item.name}
                  src={item.image}
                />
              ))}
            </div>
          </Space>
        </Container>
      </Layout>
    </React.Fragment>
  );
};

export default HomePage;
