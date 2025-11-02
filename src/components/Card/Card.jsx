import React from "react";
import { Card, ConfigProvider } from "antd";
import blank4x3 from "../../assets/blank4x3.png";

const Index = ({ title, description, src }) => {
  return (
    <React.Fragment>
      <ConfigProvider>
        <Card 
        hoverable
          cover={
            <img 
              src={src || blank4x3} 
              alt={title}
              onError={(e) => {
                e.target.src = blank4x3;
              }}
              style={{
                height: '200px',
                width: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            />
          }
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
          styles={{
            body: {
              flex: '1',
              display: 'flex',
              flexDirection: 'column',
              padding: '16px',
              minHeight: '140px'
            }
          }}
        >
          <Card.Meta 
            title={
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                lineHeight: '1.4',
                marginBottom: '8px',
                wordWrap: 'break-word',
                whiteSpace: 'normal',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                height: '44px',
                minHeight: '44px'
              }}>
                {title}
              </div>
            }
            description={
              description ? (
                <div style={{
                  fontSize: '14px',
                  lineHeight: '1.5',
                  color: '#666',
                  wordWrap: 'break-word',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  height: '63px',
                  minHeight: '63px'
                }}>
                  {description}
                </div>
              ) : (
                <div style={{ height: '63px', minHeight: '63px' }}></div>
              )
            }
          />
        </Card>
      </ConfigProvider>
    </React.Fragment>
  );
};

export default Index;


