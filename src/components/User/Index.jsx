import React from "react";
import Dropdown from "antd/es/dropdown/dropdown";

const items = [
  {
    key: "1",
    label: "Profile",
  },
  {
    key: "2",
    label: "Settings",
  },
];

const Index = () => {
  return (
    <React.Fragment>
      <Dropdown trigger={["click"]} menu={{items}}>
        <a>
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="user"
            className="tw:w-10 tw:h-10 tw:rounded-full"
          />
        </a>
      </Dropdown>
    </React.Fragment>
  );
};

export default Index;
