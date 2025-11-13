// src/pages/SettingsPage.jsx

import React, { useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { Link } from 'react-router-dom';
import {
  Card,
  List,
  Switch,
  Select,
  Button,
  Typography,
  Avatar,
  Radio,
  Space,
  Modal,
  Tag 
} from "antd";
import { Icon } from "@iconify/react";
import { useTheme } from "../context/ThemeContext";

const { Title, Text } = Typography;
const { Option } = Select;

// NOTE: Cần thêm CSS sau để tạo hiệu ứng hover:
/* .settings-list-item {
  transition: all 0.3s;
  cursor: pointer;
  border-radius: 8px; 
}
.settings-list-item:hover {
  background-color: var(--hover-color); 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05); 
}
*/

const SettingsPage = () => {
  const { themeMode, setThemeMode, accentColorName, setAccentColorName } =
    useTheme();

  // GIẢ ĐỊNH DỮ LIỆU CÁ NHÂN
  const [userEmail] = useState('user***@example.com');
  const [userPhone] = useState('098******123');
  
  // STATES MỚI CHO CHỨC NĂNG BỔ SUNG
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pinAndRecoveryEnabled, setPinAndRecoveryEnabled] = useState(true); 
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [commentPermissions, setCommentPermissions] = useState('all');
  // State mới cho tùy chọn OTP
  const [otpPreference, setOtpPreference] = useState('email'); 

  const handleThemeChange = (checked) => {
    setThemeMode(checked ? "dark" : "light");
  };

  const handleAccentChange = (e) => {
    setAccentColorName(e.target.value);
  };
  
  // CHỨC NĂNG MỚI: Xử lý Vô hiệu hóa
  const handleDeactivate = () => {
    Modal.confirm({
        title: 'Xác nhận Vô hiệu hóa Tài khoản',
        content: 'Bạn có chắc chắn muốn vô hiệu hóa tài khoản? Hồ sơ sẽ bị ẩn.',
        okText: 'Vô hiệu hóa',
        cancelText: 'Hủy',
        okButtonProps: { danger: true },
        onOk: () => console.log('Tài khoản đã vô hiệu hóa'),
    });
  };

  const openEditModal = (type) => {
      Modal.info({
          title: `Chỉnh sửa ${type === 'email' ? 'Email' : 'Số điện thoại'}`,
          content: `Mở Modal chỉnh sửa ${type} và xác minh OTP.`,
          okText: 'Đóng'
      });
  };

  return (
    <AppLayout>
      <div style={{ padding: "16px 24px" }}>
        <Title level={3} style={{ marginBottom: "24px" }}>
          Thiết Lập Hệ Thống
        </Title>

        {/* -------------------------------------------------------------------------------------------------- */}
        {/* CARD: Giao diện & Ngôn ngữ */}
        <Card title="Giao diện & Ngôn ngữ" style={{ marginBottom: 24 }}>
          <List itemLayout="horizontal">
            <List.Item
              className="settings-list-item" 
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
              className="settings-list-item" 
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
                    style={{ backgroundColor: "#E5E7EB" }}
                    icon={
                      <Icon icon="mdi:translate" style={{ color: "#4B5563" }} />
                    }
                  />
                }
                title="Ngôn ngữ"
              />
            </List.Item>

            <List.Item
              className="settings-list-item" 
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
        
        {/* -------------------------------------------------------------------------------------------------- */}
        {/* CARD: Tùy chọn Thông báo & OTP (ĐÃ THÊM EDIT EMAIL/SĐT) */}
        <Card title="Tùy chọn Thông báo & OTP" style={{ marginBottom: 24 }}>
             <List itemLayout="horizontal">
                {/* 1. Tùy chọn Kênh nhận OTP */}
                <List.Item
                    className="settings-list-item"
                    actions={[
                        <Select 
                            value={otpPreference} 
                            onChange={setOtpPreference} 
                            style={{ width: 150 }}
                        >
                          <Option value="email">Email đã đăng ký</Option>
                          <Option value="phone">SĐT đã xác minh</Option>
                          <Option value="app" disabled>Ứng dụng xác thực</Option>
                        </Select>
                    ]}
                >
                    <List.Item.Meta
                        avatar={
                            <Avatar
                                style={{ backgroundColor: "#E5E7EB" }}
                                icon={<Icon icon="mdi:message-text-outline" style={{ color: "#4B5563" }} />}
                            />
                        }
                        title="Kênh nhận Mã OTP"
                        description="Chọn phương thức ưu tiên nhận mã xác thực một lần."
                    />
                </List.Item>
                {/* 2. Chỉnh sửa Email */}
                <List.Item
                    className="settings-list-item"
                    actions={[
                        <Button type="link" onClick={() => openEditModal('email')}>
                            Chỉnh sửa
                        </Button>
                    ]}
                >
                    <List.Item.Meta
                        avatar={
                            <Avatar
                                style={{ backgroundColor: "#E5E7EB" }}
                                icon={<Icon icon="mdi:email-edit-outline" style={{ color: "#4B5563" }} />}
                            />
                        }
                        title="Email đăng ký"
                        description={userEmail}
                    />
                </List.Item>
                {/* 3. Chỉnh sửa SĐT */}
                 <List.Item
                    className="settings-list-item"
                    actions={[
                        <Button type="link" onClick={() => openEditModal('phone')}>
                            Chỉnh sửa
                        </Button>
                    ]}
                >
                    <List.Item.Meta
                        avatar={
                            <Avatar
                                style={{ backgroundColor: "#E5E7EB" }}
                                icon={<Icon icon="mdi:phone-edit-outline" style={{ color: "#4B5563" }} />}
                            />
                        }
                        title="Số điện thoại"
                        description={userPhone}
                    />
                </List.Item>
             </List>
        </Card>

        {/* -------------------------------------------------------------------------------------------------- */}
        {/* CARD: Tài khoản & Bảo mật (ĐÃ NÂNG CẤP UI ARROW) */}
        <Card title="Tài khoản & Bảo mật" style={{ marginBottom: 24 }}>
          <List itemLayout="horizontal">
            {/* LINK: Mã PIN & Khôi phục */}
            <List.Item
              className="settings-list-item"
              actions={[
                <Link to="/settings/security/pin-recovery"> 
                    <Button 
                        type="link" 
                        // SỬ DỤNG MŨI TÊN CHEVRON PHỔ BIẾN HƠN
                        icon={<Icon icon="mdi:chevron-right" style={{ fontSize: '20px' }} />}
                        style={{ padding: 0 }}
                    />
                </Link>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{ backgroundColor: "#E5E7EB" }}
                    icon={
                      <Icon icon="mdi:key-variant" style={{ color: "#4B5563" }} />
                    }
                  />
                }
                title={
                    <Space>
                        Mã PIN & Khôi phục
                        <Tag color={pinAndRecoveryEnabled ? "success" : "warning"}>
                            {pinAndRecoveryEnabled ? "Đã Thiết Lập" : "Cần Thiết Lập"}
                        </Tag>
                    </Space>
                }
                description="Thiết lập Mã PIN và Câu hỏi bí mật để tăng cường bảo mật."
              />
            </List.Item>
            
            {/* LINK: Đổi Mật Khẩu */}
            <List.Item
              className="settings-list-item"
              actions={[
                <Link to="/settings/security/change-password">
                    <Button 
                        type="link" 
                        // SỬ DỤNG MŨI TÊN CHEVRON
                        icon={<Icon icon="mdi:chevron-right" style={{ fontSize: '20px' }} />}
                        style={{ padding: 0 }}
                    />
                </Link>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{ backgroundColor: "#E5E7EB" }}
                    icon={
                      <Icon icon="mdi:lock-outline" style={{ color: "#4B5563" }} />
                    }
                  />
                }
                title="Đổi Mật Khẩu"
                description="Cập nhật mật khẩu thường xuyên để bảo mật tài khoản."
              />
            </List.Item>
            
             <List.Item
              className="settings-list-item"
              actions={[
                <Button 
                    type="link" 
                    // SỬ DỤNG MŨI TÊN CHEVRON
                    icon={<Icon icon="mdi:chevron-right" style={{ fontSize: '20px' }} />}
                    style={{ padding: 0 }}
                    disabled
                />
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{ backgroundColor: "#E5E7EB" }}
                    icon={
                      <Icon icon="mdi:devices" style={{ color: "#4B5563" }} />
                    }
                  />
                }
                title="Quản lý Phiên đăng nhập"
                description="Xem và đăng xuất khỏi các thiết bị đang hoạt động."
              />
            </List.Item>
          </List>
        </Card>
        
        {/* -------------------------------------------------------------------------------------------------- */}
        {/* CARD MỚI: Quyền riêng tư */}
        <Card title="Quyền riêng tư" style={{ marginBottom: 24 }}>
             <List itemLayout="horizontal">
                <List.Item
                    className="settings-list-item"
                    actions={[
                       <Select 
                            value={profileVisibility} 
                            onChange={setProfileVisibility} 
                            style={{ width: 120 }}
                        >
                          <Option value="public">Công khai</Option>
                          <Option value="private">Riêng tư</Option>
                        </Select>
                    ]}
                >
                    <List.Item.Meta
                        avatar={
                            <Avatar
                                style={{ backgroundColor: "#E5E7EB" }}
                                icon={<Icon icon="mdi:eye-outline" style={{ color: "#4B5563" }} />}
                            />
                        }
                        title="Hiển thị Hồ sơ"
                        description="Ai có thể xem công thức và hoạt động của bạn."
                    />
                </List.Item>
                 <List.Item
                    className="settings-list-item"
                    actions={[
                        <Select 
                            value={commentPermissions} 
                            onChange={setCommentPermissions} 
                            style={{ width: 120 }}
                        >
                          <Option value="all">Mọi người</Option>
                          <Option value="followers">Người theo dõi</Option>
                          <Option value="none">Không ai</Option>
                        </Select>
                    ]}
                >
                    <List.Item.Meta
                        avatar={
                            <Avatar
                                style={{ backgroundColor: "#E5E7EB" }}
                                icon={<Icon icon="mdi:comment-edit-outline" style={{ color: "#4B5563" }} />}
                            />
                        }
                        title="Quyền bình luận"
                        description="Ai có thể bình luận trên công thức của bạn."
                    />
                </List.Item>
                <List.Item
                    className="settings-list-item"
                    actions={[
                        <Button 
                            type="link" 
                            icon={<Icon icon="mdi:chevron-right" style={{ fontSize: '20px' }} />}
                            style={{ padding: 0 }}
                        />
                    ]}
                >
                    <List.Item.Meta
                        avatar={
                            <Avatar
                                style={{ backgroundColor: "#E5E7EB" }}
                                icon={<Icon icon="mdi:database-export-outline" style={{ color: "#4B5563" }} />}
                            />
                        }
                        title="Xuất dữ liệu"
                        description="Tải về bản sao tất cả dữ liệu tài khoản và công thức của bạn."
                    />
                </List.Item>
             </List>
        </Card>


        {/* -------------------------------------------------------------------------------------------------- */}
        {/* CARD: Khu vực nguy hiểm */}
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
              className="settings-list-item"
              actions={[<Button danger onClick={handleDeactivate}>Vô hiệu hóa</Button>]} 
            >
              <List.Item.Meta
                title="Vô hiệu hóa tài khoản"
                description="Tạm thời khóa tài khoản của bạn và ẩn hồ sơ. Có thể kích hoạt lại sau."
              />
            </List.Item>
            <List.Item
              className="settings-list-item"
              actions={[
                <Button type="primary" danger>
                  Xóa tài khoản
                </Button>,
              ]}
            >
              <List.Item.Meta
                title="Xóa vĩnh viễn tài khoản"
                description="Hành động này không thể hoàn tác, mọi dữ liệu sẽ bị xóa khỏi hệ thống."
              />
            </List.Item>
          </List>
        </Card>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;