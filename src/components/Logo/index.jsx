import React from "react";
import { Flex } from "antd";
import Logo from "../../assets/icon.svg";
const Index = ({ collapsed }) => {
  return (
    <React.Fragment>
      <Flex gap={10} align="center" justify="center">
        <img src={Logo} className={collapsed ? "tw:size-8" : "tw:size-10"} />
        {!collapsed && (
          <>
            <p className="tw:text-4xl tw:font-bold ">M&M</p>
            <div className="tw:relative tw:size-0.5">
              <div className="tw:bg-amber-600 tw:w-2 tw:h-2 tw:rounded-3xl tw:relative tw:bottom-0 tw:right-0" />
            </div>
          </>
        )}
      </Flex>
    </React.Fragment>
  );
};

export default Index;
