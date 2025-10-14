import React from "react";
import { Card, ConfigProvider } from "antd";

const Index = ({ title, description, src }) => {
  return (
    <React.Fragment>
      <ConfigProvider>
        <Card 
        hoverable
          cover={
            <img 
              src={src} 
              alt={title} 
              style={{
                height: '200px',
                width: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            />
          }
          style={{
            height: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
          styles={{
            body: {
              flex: 'none',
              display: 'flex',
              flexDirection: 'column',
              padding: '16px',
              height: 'auto'
            }
          }}
        >
          <Card.Meta 
            title={
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                lineHeight: '1.4',
                marginBottom: description ? '8px' : '0',
                wordWrap: 'break-word',
                whiteSpace: 'normal',
                overflow: 'visible',
                height: 'auto'
              }}>
                {title}
              </div>
            }
            description={
              description ? (
                <div style={{
                  fontSize: '14px',
                  lineHeight: '1.4',
                  color: '#666',
                  wordWrap: 'break-word',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {description}
                </div>
              ) : null
            }
          />
        </Card>
      </ConfigProvider>
    </React.Fragment>
  );
};

export default Index;
