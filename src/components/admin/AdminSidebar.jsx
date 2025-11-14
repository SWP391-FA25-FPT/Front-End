import React, { useMemo } from "react";
import { Container } from "react-bootstrap";
import { Button, ConfigProvider, Menu } from "antd";
import { Icon } from "@iconify/react";
import Logo from "../Logo/Logo";
import { useNavigate, useLocation } from "react-router-dom";
import "../SideBar/index.css";

const { SubMenu } = Menu;
export default function AdminSidebar({ collapsed, toggleCollapsed }) {
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ xác định mục đang active
    const selectedKey = useMemo(() => {
        const path = location.pathname;
        // Check exact paths first
        if (path === "/admin" || path === "/admin/") return "admin-dashboard";
        if (path === "/admin/dashboard") return "admin-dashboard";
        if (path === "/admin/content-moderation/recipes" || path === "/admin/content-moderation") return "admin-content-recipes";
        if (path === "/admin/content-moderation/blogs") return "admin-content-blogs";
        if (path === "/admin/payment") return "admin-payment";
        if (path === "/admin/statistics") return "admin-statistics";
        if (path === "/admin/report") return "admin-report";
        if (path === "/admin/feedback") return "admin-feedback";
        if (path === "/admin/users") return "admin-users";
        if (path === "/admin/system-settings") return "admin-system-setting";
        // Legacy path support
        if (path === "/admin/setting") return "admin-system-setting";
        return "";
    }, [location.pathname]);

    // ✅ danh sách menu admin
    const adminItems = [
        {
            key: "admin-dashboard",
            icon: <Icon icon="mdi:view-dashboard-outline" width="24" height="24" />,
            label: "Bảng Điều Khiển",
            onClick: () => navigate("/admin/dashboard"),
        },
        {
            key: "admin-content",
            icon: <Icon icon="mdi:camera-outline" width="24" height="24" />,
            label: "Kiểm Duyệt Nội Dung",
            children: [
                {
                    key: "admin-content-recipes",
                    icon: <Icon icon="mdi:food-variant-outline" width="20" height="20" />,
                    label: "Recipes",
                    onClick: () => navigate("/admin/content-moderation/recipes"),
                },
                {
                    key: "admin-content-blogs",
                    icon: <Icon icon="mdi:newspaper-variant-outline" width="20" height="20" />,
                    label: "Blogs",
                    onClick: () => navigate("/admin/content-moderation/blogs"),
                },
            ],
        },
        {
            key: "admin-payment",
            icon: <Icon icon="mdi:credit-card-outline" width="24" height="24" />,
            label: "Gói & Thanh Toán",
            onClick: () => navigate("/admin/payment"),
        },
        {
            key: "admin-statistics",
            icon: <Icon icon="mdi:chart-box-outline" width="24" height="24" />,
            label: "Thống Kê Hệ Thống",
            onClick: () => navigate("/admin/statistics"),
        },
        {
            key: "admin-report",
            icon: <Icon icon="mdi:flag-outline" width="24" height="24" />,
            label: "Báo Cáo Hệ Thống",
            onClick: () => navigate("/admin/report"),
        },
        {
            key: "admin-feedback",
            icon: <Icon icon="mdi:comment-outline" width="24" height="24" />,
            label: "Phản Hồi Người Dùng",
            onClick: () => navigate("/admin/feedback"),
        },
        {
            key: "admin-users",
            icon: <Icon icon="mdi:account-group-outline" width="24" height="24" />,
            label: "Quản Lý Người Dùng",
            onClick: () => navigate("/admin/users"),
        },
        {
            key: "admin-system-setting",
            icon: <Icon icon="mdi:cog-outline" width="24" height="24" />,
            label: "Cài đặt hệ thống",
            onClick: () => navigate("/admin/system-settings"),
        },

    ];

    return (
        <ConfigProvider
            theme={{
                components: {
                    Menu: {
                        itemColor: "#69758fff",
                        itemHoverColor: "#D97706",
                        itemHoverBg: "#FFF8E1",
                        itemSelectedBg: "#FEF3C7",
                        itemSelectedColor: "#F59E0B",
                        itemActiveBg: "#FDE68A",
                        colorPrimary: "#F59E0B",
                    },
                },
                token: {
                    fontSize: 16,
                },
            }}
        >
            <Container
                className={
                    "d-flex flex-column align-items-center gap-4 p-2 sidebar-scroll-container"
                }
            >
                {/* Logo + nút thu nhỏ giống y Index.jsx */}
                <div className="d-flex align-items-center justify-content-center w-100 position-relative">
                    <Logo collapsed={collapsed} />

                    {!collapsed && (
                        <Button
                            onClick={toggleCollapsed}
                            type="button"
                            className="position-absolute end-0"
                            size="small"
                        >
                            <Icon icon="mingcute:arrows-left-line" width="24" height="24" />
                        </Button>
                    )}
                </div>

                {collapsed && (
                    <Button onClick={toggleCollapsed} type="button" className="mb-1" size="small">
                        <Icon icon="mingcute:arrows-right-line" width="24" height="24" />
                    </Button>
                )}

                {/* Menu Admin */}
                <Menu
                    selectedKeys={selectedKey ? [selectedKey] : []}
                    mode="inline"
                    inlineCollapsed={collapsed}
                    style={{ border: "none" }}
                >
                    {adminItems.map((item) => {
                        if (item.children) {
                            return (
                                <SubMenu
                                    key={item.key}
                                    icon={item.icon}
                                    title={item.label}
                                >
                                    {item.children.map((child) => (
                                        <Menu.Item
                                            key={child.key}
                                            icon={child.icon}
                                            onClick={child.onClick}
                                        >
                                            {child.label}
                                        </Menu.Item>
                                    ))}
                                </SubMenu>
                            );
                        }
                        return (
                            <Menu.Item
                                key={item.key}
                                icon={item.icon}
                                onClick={item.onClick}
                            >
                                {item.label}
                            </Menu.Item>
                        );
                    })}
                </Menu>
            </Container>
        </ConfigProvider>
    );
}
