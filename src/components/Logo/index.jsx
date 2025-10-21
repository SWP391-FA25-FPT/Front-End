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
        className="tw:h-full tw:py-2"
      >
        <img src={Logo} className={collapsed ? "tw:size-8" : "tw:size-10"} />
        {!collapsed && (
          <p
            className="tw:text-3xl tw:font-bold tw:leading-none tw:flex tw:items-center"
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
