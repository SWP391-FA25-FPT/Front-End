import React, { useState } from "react";
import { Switch, Select, Slider, Input, Button, Upload, message } from "antd";
import { UploadOutlined, SaveOutlined } from "@ant-design/icons";
import "../../pages/style/SystemSettingAdmin.css";

export default function SystemSettingsModule() {
  const [settings, setSettings] = useState({
    systemName: "Meta Meal",
    timezone: "UTC+7",
    language: "vi",
    twoFactorAuth: false,
    lockThreshold: 5,
    sessionTimeout: 30,
    aiEnabled: true,
    aiCreativity: 0.7,
    aiDailyLimit: 15,
    notifyEmail: true,
    notifyFeedback: true,
    notifyPremium: true,
  });

  const [activeTab, setActiveTab] = useState("general"); 

  const updateSetting = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const saveSettings = () => {
    message.success("Đã lưu cài đặt thành công!");
  };

  return (
    <div className="system-settings-wrapper">
      {/* Sidebar menu */}
      <aside className="settings-sidebar">
        <h3>Cài đặt</h3>
        <ul>
          <li className={activeTab === "general" ? "active" : ""} onClick={() => setActiveTab("general")}>
            Giao diện hệ thống
          </li>
          <li className={activeTab === "security" ? "active" : ""} onClick={() => setActiveTab("security")}>
            Bảo mật & Đăng nhập
          </li>
          <li className={activeTab === "ai" ? "active" : ""} onClick={() => setActiveTab("ai")}>
            Cấu hình AI
          </li>
          <li className={activeTab === "notification" ? "active" : ""} onClick={() => setActiveTab("notification")}>
            Thông báo
          </li>
          <li className={activeTab === "backup" ? "active" : ""} onClick={() => setActiveTab("backup")}>
            Sao lưu hệ thống
          </li>
        </ul>
      </aside>

      {/* Content hiển thị theo tab */}
      <div className="system-settings-container">
        <h2 className="page-title">Cài đặt hệ thống</h2>

        {activeTab === "general" && (
          <div className="settings-card fade-in">
            <h3>Giao diện & Thông tin hệ thống</h3>

            <label>Tên hệ thống</label>
            <Input value={settings.systemName} onChange={(e) => updateSetting("systemName", e.target.value)} />

            <label>Logo hệ thống</label>
            <Upload showUploadList={false}>
              <Button icon={<UploadOutlined />}>Tải logo</Button>
            </Upload>

            <div className="settings-two-col">
              <div>
                <label>Múi giờ</label>
                <Select
                  value={settings.timezone}
                  onChange={(v) => updateSetting("timezone", v)}
                  options={[{ value: "UTC+7", label: "UTC+7 (Việt Nam)" }]}
                />
              </div>

              <div>
                <label>Ngôn ngữ</label>
                <Select
                  value={settings.language}
                  onChange={(v) => updateSetting("language", v)}
                  options={[
                    { value: "vi", label: "Tiếng Việt" },
                    { value: "en", label: "English" },
                  ]}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="settings-card fade-in">
            <h3>Bảo mật & Đăng nhập</h3>

            <div className="setting-row">
              <span>Xác thực hai bước (2FA)</span>
              <Switch checked={settings.twoFactorAuth} onChange={(v) => updateSetting("twoFactorAuth", v)} />
            </div>

            <label>Khoá tài khoản sau số lần nhập sai</label>
            <Input type="number" value={settings.lockThreshold} onChange={(e) => updateSetting("lockThreshold", e.target.value)} />

            <label>Thời gian hết phiên (phút)</label>
            <Select
              value={settings.sessionTimeout}
              onChange={(v) => updateSetting("sessionTimeout", v)}
              options={[
                { value: 15, label: "15 phút" },
                { value: 30, label: "30 phút" },
                { value: 60, label: "1 giờ" },
              ]}
            />
          </div>
        )}

        {activeTab === "ai" && (
          <div className="settings-card fade-in">
            <h3>Cấu hình AI</h3>

            <div className="setting-row">
              <span>Bật AI tự động đề xuất</span>
              <Switch checked={settings.aiEnabled} onChange={(v) => updateSetting("aiEnabled", v)} />
            </div>

            <label>Độ sáng tạo của AI</label>
            <Slider min={0} max={1} step={0.1} value={settings.aiCreativity} onChange={(v) => updateSetting("aiCreativity", v)} />

            <label>Giới hạn gợi ý AI / ngày</label>
            <Input type="number" value={settings.aiDailyLimit} onChange={(e) => updateSetting("aiDailyLimit", e.target.value)} />
          </div>
        )}

        {activeTab === "notification" && (
          <div className="settings-card fade-in">
            <h3>Thông báo & Nhắc nhở</h3>

            <div className="setting-row">
              <span>Thông báo Email</span>
              <Switch checked={settings.notifyEmail} onChange={(v) => updateSetting("notifyEmail", v)} />
            </div>

            <div className="setting-row">
              <span>Thông báo phản hồi mới</span>
              <Switch checked={settings.notifyFeedback} onChange={(v) => updateSetting("notifyFeedback", v)} />
            </div>

            <div className="setting-row">
              <span>Nhắc Premium sắp hết hạn</span>
              <Switch checked={settings.notifyPremium} onChange={(v) => updateSetting("notifyPremium", v)} />
            </div>
          </div>
        )}

        {activeTab === "backup" && (
          <div className="settings-card fade-in">
            <h3>Sao lưu hệ thống</h3>

            <Button type="default" icon={<UploadOutlined />}>
              Tải dữ liệu sao lưu
            </Button>
            <Button type="primary" danger className="ms-2">
              Khôi phục dữ liệu
            </Button>
          </div>
        )}

        <div className="settings-footer">
          <Button type="primary" icon={<SaveOutlined />} size="large" onClick={saveSettings}>
            Lưu cài đặt
          </Button>
        </div>
      </div>
    </div>
  );
}
