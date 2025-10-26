import React from "react";
import { Flex } from "antd";
import Logo from "../../assets/icon.svg";
const Index = ({ collapsed }) => {
  return (
    <React.Fragment>
      <Flex
        gap={8}
        align="center"
        justify="center"
        className="d-flex align-items-center justify-content-center h-100 py-2"
      >
        <img src={Logo} className={collapsed ? "w-8 h-8" : "w-10 h-10"} />
        {!collapsed && (
          <p
            className="fs-1 fw-bold m-0 d-flex align-items-center"
            style={{ color: "#000000", transform: "translateY(4px)" }}
          >
            M&M
          </p>
        )}
      </Flex>
    </React.Fragment>
  );
};

export default Index;
