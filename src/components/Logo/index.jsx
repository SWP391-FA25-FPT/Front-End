import React from "react";
import { Flex } from "antd";
import Logo from "../../assets/icon.svg";
const Index = ({ collapsed }) => {
  return (
    <React.Fragment>
      <Flex gap={10} align="center" justify="center" className="d-flex align-items-center justify-content-center logo-container">
        <img src={Logo} className={collapsed ? "w-8 h-8" : "w-10 h-10"} />
        {!collapsed && (
          <p className="fs-1 fw-bold m-0">M&M</p>
        )}
      </Flex>
    </React.Fragment>
  );
};

export default Index;
