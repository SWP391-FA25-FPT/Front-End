import React from "react";
import User from "../User/User.jsx";
import CreateButton from "../CreateButton/CreateButton.jsx";
import { Flex } from "antd";

const Header = () => {
  return (
    <React.Fragment>
      <Flex justify="center" align="center" gap={"16px"}>
        <Flex gap="16px" align="center" justify="space-between">
          <User />
          <CreateButton />
        </Flex>
      </Flex>
    </React.Fragment>
  );
};

export default Header;
