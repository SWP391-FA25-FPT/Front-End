import React from "react";
import { Card, ConfigProvider } from "antd";
import blank4x3 from "../../assets/blank4x3.png";

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
          className="position-relative overflow-hidden rounded-3 shadow border-0"
          cover={
            <div className="position-relative">
              <img
                alt={title}
                src={src || blank4x3}
                onError={(e) => {
                  e.target.src = blank4x3;
                }}
                className="h-48 w-100 object-fit-cover rounded-3"
              />
              <div className="position-absolute bottom-0 start-0 end-0 bg-gradient-to-top p-3" style={{background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'}}>
                <p className="text-white fw-semibold fs-6" style={{margin:"5px"}}>
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


