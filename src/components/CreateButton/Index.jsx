import React from "react";
import { Button } from "antd";
import { Icon } from "@iconify/react";

const Index = () => {
  return (
    <React.Fragment>
      <Button type="primary" style={{backgroundColor:"#FFBA33"}}>
        <Icon icon="ic:baseline-plus" width="24" height="24" />
        Viết món mới
      </Button>
    </React.Fragment>
  );
};

export default Index;
