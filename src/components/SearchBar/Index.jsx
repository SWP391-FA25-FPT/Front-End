import React from "react";
import { Icon } from "@iconify/react";
import { Form, Input } from "antd";
import "tailwindcss";
const Index = () => {
  return (
    <React.Fragment>
      <Form name="search">
        <Input
          prefix={
            <Icon
              icon="mdi:magnify"
              width="24"
              height="24"
              className="text-yellow-400"
            />
          }
          placeholder="Tìm kiếm món ăn, thực đơn, công thức..."
          style={{ borderRadius: "16px", width: "400px", height: "40px" }}
        />
      </Form>
    </React.Fragment>
  );
};

export default Index;
