import React from "react";
import { Flex } from "antd";
import Logo from "../../assets/icon.svg";

const Index = ({ collapsed }) => {
  return (
    <React.Fragment>
      <Flex gap={10} align="center" justify="center">
        <img src={Logo} className={collapsed ? "size-8" : "size-10"} />
        {!collapsed && (
          <>
            <p className="text-4xl font-bold ">M&M</p>
            <div className="relative size-0.5">
              <div className="bg-amber-600 w-2 h-2 rounded-3xl relative bottom-0 right-0" />
            </div>
          </>
        )}
      </Flex>
    </React.Fragment>
  );
};

export default Index;
