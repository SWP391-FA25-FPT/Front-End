import React, { useState, useEffect } from 'react';
import {
  Layout,
  Typography,
  Card,
  Tabs,
  List,
  Avatar,
  Button,
  Space,
  Empty,
  Spin,
  Tooltip, // NOTE: Đã xóa Tooltip khỏi import (nếu bạn không dùng nữa)
} from 'antd';
import { Icon } from '@iconify/react';

const { Title } = Typography;
const { TabPane } = Tabs;

// --- DỮ LIỆU GIẢ (MOCK DATA) ---
const MOCK_NOTIFICATIONS = [
  { 
    id: 1, 
    icon: 'mdi:file-document-outline', 
    title: 'Cập nhật tài liệu', 
    description: 'Tài liệu "Món Nháp" đã được cập nhật.',
    color: '#1D4ED8',
    bgColor: '#DBEAFE',
    read: false,
    date: '2025-11-06T10:30:00Z',
  },
  { 
    id: 2, 
    icon: 'mdi:trophy-outline', 
    title: 'Thử thách mới!', 
    description: 'Bạn đã tham gia "Thử thách 7 ngày Keto".',
    color: '#059669',
    bgColor: '#D1FAE5',
    read: false,
    date: '2025-11-05T14:00:00Z',
  },
  { 
    id: 3, 
    icon: 'mdi:comment-outline', 
    title: 'Bình luận mới', 
    description: 'Khoale đã bình luận về món "Cá Hồi Nướng".',
    color: '#D97706',
    bgColor: '#FEF3C7',
    read: true,
    date: '2025-11-04T09:15:00Z',
  },
];
// ---------------------------------

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // TODO: Gọi API (fetch) để lấy thông báo từ back-end
    setTimeout(() => {
      setNotifications(MOCK_NOTIFICATIONS);
      setLoading(false);
    }, 1000);
  }, []);

  // === PHẦN DÀNH CHO BACK-END (ĐÃ SỬA) ===
  const handleMarkAsRead = (id) => {
    // 1. Kiểm tra xem đã đọc chưa, nếu rồi thì không làm gì
    const item = notifications.find(n => n.id === id);
    if (item && item.read) {
      console.log(`Notification ${id} is already read.`);
      return; // Không gọi API hay set state
    }

    // 2. Cập nhật UI ngay lập tức
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    
    // 3. TODO: Gửi request lên back-end để cập nhật
    console.log(`Marked notification ${id} as read (API call)`);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    console.log('Marked all as read (API call)');
  };
  // ---------------------------------

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') {
      return !n.read;
    }
    return true;
  });

  const markAllButton = (
    <Button
      type="link"
      onClick={handleMarkAllAsRead}
      disabled={loading || notifications.every(n => n.read)}
    >
      Đánh dấu tất cả là đã đọc
    </Button>
  );

  return (
    <div style={{ padding: '16px 24px' }}>
      <Card
        title={<Title level={3}>Trung tâm thông báo</Title>}
        extra={markAllButton}
        style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}
      >
        <Tabs activeKey={filter} onChange={(key) => setFilter(key)}>
          <TabPane tab={`Tất cả (${notifications.length})`} key="all" />
          <TabPane
            tab={`Chưa đọc (${notifications.filter(n => !n.read).length})`}
            key="unread"
          />
        </Tabs>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Empty description="Bạn không có thông báo nào" />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={filteredNotifications}
            renderItem={(item) => (
                <List.Item
                onClick={() => handleMarkAsRead(item.id)}
                style={{ 
                  opacity: item.read ? 0.6 : 1,
                  cursor: item.read ? 'default' : 'pointer'
                }} 
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      icon={<Icon icon={item.icon} />}
                      style={{
                        backgroundColor: item.bgColor,
                        color: item.color,
                      }}
                    />
                  }
                  title={
                    <span style={{ fontWeight: item.read ? 400 : 600 }}>
                      {item.title}
                    </span>
                  }
                  description={item.description}
                />
                <div style={{ color: '#9CA3AF', fontSize: '12px' }}>
                  {new Date(item.date).toLocaleDateString('vi-VN')}
                </div>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default NotificationPage;