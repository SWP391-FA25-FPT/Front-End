import React from "react";
import SearchBar from "../SearchBar/Index";
import User from "../User/Index";
import CreateButton from "../CreateButton/Index";
import { Flex } from "antd";

const Header = () => {
  return (
    <React.Fragment>
      <Flex justify="center"  gap={"16px"} className="" >
        <SearchBar/>
        <Flex gap="16px" align="center" justify="space-between">
          <User />
          <CreateButton/>
        </Flex>
      </Flex>
    </React.Fragment>
  );
};

export default Header;
