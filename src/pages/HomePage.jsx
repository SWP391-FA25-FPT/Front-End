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
            <div className="row g-4 py-2">
              {Data.slice(0, 8).map((item, index) => (
                <div key={index} className="col-12 col-sm-6 col-lg-3">
                  <CardPopular title={item.name} src={item.image} />
                </div>
              ))}
            </div>

            <Title level={3}>Món Bạn Mới Xem Gần Đây</Title>
            <div className="row g-4 py-2">
              {RecentData.slice(0, 6).map((item, index) => (
                <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
                  <CardRecent
                    title={item.title}
                    src={item.image}
                    avatar={item.avatar}
                    userName={item.userName}
                  />
                </div>
              ))}
            </div>
            <Title level={3}>Gói Premium</Title>
            <div className="row g-4 py-2">
              {ListPremium.premiumFeatures.slice(0, 5).map((item, index) => (
                <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
                  <Card
                    title={item.title}
                    src={item.image}
                    description={item.description}
                  />
                </div>
              ))}
            </div>
            <Title level={3}>Từ khóa Bạn Mới Xem Gần Đây</Title>
            <div className="row g-4 py-2">
              {Data.slice(0, 6).map((item, index) => (
                <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
                  <Card
                    title={item.name}
                    src={item.image}
                  />
                </div>
              ))}
            </div>
          </Space>
        </Container>
      </Layout>
    </React.Fragment>
  );
};

export default HomePage;
