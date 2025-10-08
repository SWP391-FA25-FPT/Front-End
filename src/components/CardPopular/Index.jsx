import React from "react";
import { Card, ConfigProvider } from "antd";

const Index = ({ title, src }) => {
  return (
    <React.Fragment>
      <ConfigProvider
        theme={{
          components: {
            Card: {
              bodyPadding: 0,
            },
          },
        }}
      >
        <Card
          hoverable
          className="tw:relative tw:overflow-hidden tw:rounded-xl tw:shadow-md tw:border-none"
          cover={
            <div className="tw:relative">
              <img
                alt={title}
                src={src}
                className="tw:h-48 tw:w-full tw:object-cover tw:rounded-xl"
              />
              <div className="tw:absolute tw:bottom-0 tw:left-0 tw:right-0 tw:bg-gradient-to-t tw:from-black/70 tw:to-transparent tw:p-3">
                <p className="tw:text-white tw:font-semibold tw:text-base" style={{margin:"0"}}>
                  {title}
                </p>
              </div>
            </div>
          }
        />
      </ConfigProvider>
    </React.Fragment>
  );
};

export default Index;
