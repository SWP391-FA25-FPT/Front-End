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
      <div style={{ padding: "16px 24px" }}>
        <Title level={3} style={{ marginBottom: "24px" }}>
          Thiết Lập Hệ Thống
        </Title>

        <Card title="Giao diện & Ngôn ngữ" style={{ marginBottom: 24 }}>
          <List itemLayout="horizontal">
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
                    // NOTE: THÊM NỀN SÁNG CHO AVATAR
                    style={{ backgroundColor: "#E5E7EB" }}
                    icon={
                      <Icon
                        icon="mdi:theme-light-dark"
                        style={{ color: "#4B5563" }}
                      />
                    }
                  />
                }
                title="Chế độ Sáng/Tối"
                description="Bật/tắt giao diện tối cho toàn hệ thống"
              />
            </List.Item>

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
                    // NOTE: THÊM NỀN SÁNG CHO AVATAR
                    style={{ backgroundColor: "#E5E7EB" }}
                    icon={
                      <Icon
                        icon="mdi:translate"
                        style={{ color: "#4B5563" }}
                      />
                    }
                  />
                }
                title="Ngôn ngữ"
              />
            </List.Item>

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
                    // NOTE: THÊM NỀN SÁNG CHO AVATAR
                    style={{ backgroundColor: "#E5E7EB" }}
                    icon={
                      <Icon
                        icon="mdi:palette-outline"
                        style={{ color: "#4B5563" }}
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

        <Card title="Tài khoản & Bảo mật" style={{ marginBottom: 24 }}>
          <List itemLayout="horizontal">
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
                    // NOTE: THÊM NỀN SÁNG CHO AVATAR
                    style={{ backgroundColor: "#E5E7EB" }}
                    icon={
                      <Icon
                        icon="mdi:email-outline"
                        style={{ color: "#4B5563" }}
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
                    // NOTE: THÊM NỀN SÁNG CHO AVATAR
                    style={{ backgroundColor: "#E5E7EB" }}
                    icon={
                      <Icon
                        icon="mdi:lock-outline"
                        style={{ color: "#4B5563" }}
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
        >
          <List itemLayout="horizontal">
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