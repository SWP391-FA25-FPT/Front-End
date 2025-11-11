// src/pages/SettingsPage.jsx

import React, { useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import {
  Card,
  List,
  Switch,
  Select,
  Button,
  Typography,
  Divider,
  Avatar,
  Radio,
  Space,
} from "antd";
import { Icon } from "@iconify/react";
import { useTheme } from "../context/ThemeContext"; 

const { Title, Text } = Typography;
const { Option } = Select;

// Định nghĩa CSS cần override
const SettingsOverrideCSS = `
    /* BUỘC ĐƯỜNG KẺ CHUYỂN MÀU */
    .settings-list.ant-list > .ant-list-item {
        background: transparent !important; 
        /* Tăng cường selector để đảm bảo border color được áp dụng */
        border-color: var(--color-border-secondary) !important;
        border-block-end-color: var(--color-border-secondary) !important;
    }
    
    /* Xóa đường kẻ cuối cùng */
    .settings-list.ant-list > .ant-list-item:last-child {
        border-block-end: none !important;
    }
`;

const SettingsPage = () => {
  const { themeMode, setThemeMode, accentColorName, setAccentColorName } =
    useTheme();

  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleThemeChange = (checked) => {
    setThemeMode(checked ? "dark" : "light");
  };

  const handleAccentChange = (e) => {
    setAccentColorName(e.target.value);
  };

  return (
    <AppLayout>
        {/* FIX CÚ PHÁP: Sử dụng thẻ style chuẩn của HTML/React */}
        <style dangerouslySetInnerHTML={{ __html: SettingsOverrideCSS }} />
        
      <div style={{ padding: "16px 24px" }}>
        <Title level={3} style={{ marginBottom: "24px" }}>
          Thiết Lập Hệ Thống
        </Title>

        {/* CARD 1: Giao diện & Ngôn ngữ */}
        <Card 
            title="Giao diện & Ngôn ngữ" 
            style={{ 
                marginBottom: 24, 
                borderRadius: '12px',
                // FIX: Buộc Card sử dụng biến màu nền đã inject
                backgroundColor: 'var(--color-bg-elevated)', 
            }} 
        >
          <List 
                itemLayout="horizontal"
                className="settings-list" // THÊM CLASS ĐỂ TẠO SELECTOR MẠNH
                // FIX: Ép background list trong suốt
                style={{ backgroundColor: 'transparent' }} 
            >
            <List.Item
              actions={[
                <Switch
                  checked={themeMode === "dark"}
                  onChange={handleThemeChange}
                  checkedChildren={<Icon icon="mdi:moon-waning-crescent" />}
                  unCheckedChildren={<Icon icon="mdi:white-balance-sunny" />}
                />,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    // FIX: Đảm bảo Avatar icon cũng đổi màu theo theme
                    style={{ 
                        backgroundColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : "#E5E7EB" 
                    }}
                    icon={
                      <Icon
                        icon="mdi:theme-light-dark"
                        style={{ color: themeMode === 'dark' ? '#F3F4F6' : "#4B5563" }}
                      />
                    }
                  />
                }
                title="Chế độ Sáng/Tối"
                description="Bật/tắt giao diện tối cho toàn hệ thống"
              />
            </List.Item>
            
            {/* Ngôn ngữ */}
            <List.Item
              actions={[
                <Select defaultValue="vi" style={{ width: 120 }} disabled>
                  <Option value="vi">Tiếng Việt</Option>
                  <Option value="en">English</Option>
                </Select>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{ backgroundColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : "#E5E7EB" }}
                    icon={
                      <Icon
                        icon="mdi:translate"
                        style={{ color: themeMode === 'dark' ? '#F3F4F6' : "#4B5563" }}
                      />
                    }
                  />
                }
                title="Ngôn ngữ"
              />
            </List.Item>

            {/* Màu nhấn (Accent Color) */}
            <List.Item
              actions={[
                <Radio.Group
                  value={accentColorName}
                  onChange={handleAccentChange}
                  buttonStyle="solid"
                >
                  <Radio.Button value="amber">Vàng</Radio.Button>
                  <Radio.Button value="green">Xanh</Radio.Button>
                  <Radio.Button value="blue">Lam</Radio.Button>
                </Radio.Group>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{ backgroundColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : "#E5E7EB" }}
                    icon={
                      <Icon
                        icon="mdi:palette-outline"
                        style={{ color: themeMode === 'dark' ? '#F3F4F6' : "#4B5563" }}
                      />
                    }
                  />
                }
                title="Màu nhấn (Accent Color)"
                description="Thay đổi màu chủ đạo của các nút và link"
              />
            </List.Item>
          </List>
        </Card>

        {/* CARD 2: Tài khoản & Bảo mật */}
        <Card 
            title="Tài khoản & Bảo mật" 
            style={{ 
                marginBottom: 24, 
                borderRadius: '12px',
                // FIX: Buộc Card sử dụng biến màu nền đã inject
                backgroundColor: 'var(--color-bg-elevated)', 
            }}
        >
          <List 
                itemLayout="horizontal"
                className="settings-list" // THÊM CLASS ĐỂ TẠO SELECTOR MẠNH
                // FIX: Ép background list trong suốt
                style={{ backgroundColor: 'transparent' }}
            >
            <List.Item
              actions={[
                <Switch
                  checked={emailNotifications}
                  onChange={setEmailNotifications}
                />,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{ backgroundColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : "#E5E7EB" }}
                    icon={
                      <Icon
                        icon="mdi:email-outline"
                        style={{ color: themeMode === 'dark' ? '#F3F4F6' : "#4B5563" }}
                      />
                    }
                  />
                }
                title="Thông báo qua Email"
                description="Nhận email khi có bình luận hoặc cập nhật mới"
              />
            </List.Item>
            <List.Item
              actions={[<Button type="link">Đổi mật khẩu</Button>]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{ backgroundColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : "#E5E7EB" }}
                    icon={
                      <Icon
                        icon="mdi:lock-outline"
                        style={{ color: themeMode === 'dark' ? '#F3F4F6' : "#4B5563" }}
                      />
                    }
                  />
                }
                title="Mật khẩu"
                description="Chưa đổi mật khẩu trong 3 tháng"
              />
            </List.Item>
          </List>
        </Card>

        {/* CARD 3: Khu vực nguy hiểm */}
        <Card
          title={
            <Space>
              <Icon
                icon="mdi:alert-circle-outline"
                style={{ color: "#DC2626" }}
              />
              <span style={{ color: "#DC2626" }}>Khu vực nguy hiểm</span>
            </Space>
          }
          // FIX: Buộc Card sử dụng biến màu nền đã inject
          style={{ marginBottom: 24, borderRadius: '12px', backgroundColor: 'var(--color-bg-elevated)' }} 
        >
          <List 
                itemLayout="horizontal"
                className="settings-list" // THÊM CLASS ĐỂ TẠO SELECTOR MẠNH
                // FIX: Ép background list trong suốt
                style={{ backgroundColor: 'transparent' }}
            >
            <List.Item
              actions={[<Button danger>Vô hiệu hóa</Button>]}
            >
              <List.Item.Meta
                title="Vô hiệu hóa tài khoản"
                description="Tạm thời khóa tài khoản của bạn và ẩn hồ sơ."
              />
            </List.Item>
            <List.Item
              actions={[
                <Button type="primary" danger>
                  Xóa tài khoản
                </Button>,
              ]}
            >
              <List.Item.Meta
                title="Xóa vĩnh viễn tài khoản"
                description="Hành động này không thể hoàn tác."
              />
            </List.Item>
          </List>
        </Card>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;