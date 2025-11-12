import React, { useState } from "react";
import { Table, Tag, Select, Button, Modal } from "antd";
import { Icon } from "@iconify/react";
import "../../pages/style/PaymentAdmin.css";

export default function PaymentModule() {
  const [filters, setFilters] = useState({ status: null, type: null });
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ======================
  // 🔥 MOCK DATA (20 USER PREMIUM)
  // ======================
  const [data] = useState([
    // Monthly
    { id: "SUB001", name: "Uyên Phương", email: "uyen@gmail.com", plan: "Cơ bản", type: "Monthly", price: "0đ / tháng", status: "Active", nextPayment: "Miễn phí" },
    { id: "SUB002", name: "Ngọc Hân", email: "han@gmail.com", plan: "Cao cấp", type: "Monthly", price: "99.000đ / tháng", status: "Pending", nextPayment: "Chờ thanh toán" },
    { id: "SUB003", name: "Minh Triết", email: "triet@gmail.com", plan: "Chuyên nghiệp", type: "Monthly", price: "199.000đ / tháng", status: "Active", nextPayment: "02/12/2025" },
    { id: "SUB004", name: "Tuấn Lộc", email: "loc@gmail.com", plan: "Cao cấp", type: "Monthly", price: "99.000đ / tháng", status: "Expired", nextPayment: "Hết hạn" },
    { id: "SUB005", name: "Hồng Vy", email: "vy@gmail.com", plan: "Chuyên nghiệp", type: "Monthly", price: "199.000đ / tháng", status: "Active", nextPayment: "18/11/2025" },

    // Annual
    { id: "SUB006", name: "Lê Ngọc Anh", email: "ngocanh@gmail.com", plan: "Cao cấp - Hàng năm", type: "Annual", price: "990.000đ / năm", status: "Active", nextPayment: "11/2026" },
    { id: "SUB007", name: "Trần Quốc Hùng", email: "hung@gmail.com", plan: "Cao cấp - Hàng năm", type: "Annual", price: "990.000đ / năm", status: "Pending", nextPayment: "Chờ thanh toán" },
    { id: "SUB008", name: "Khánh Linh", email: "linh@gmail.com", plan: "Chuyên nghiệp - Hàng năm", type: "Annual", price: "1.990.000đ / năm", status: "Active", nextPayment: "05/2026" },
    { id: "SUB009", name: "Thành Đạt", email: "dat@gmail.com", plan: "Chuyên nghiệp - Hàng năm", type: "Annual", price: "1.990.000đ / năm", status: "Expired", nextPayment: "Hết hạn" },
    { id: "SUB010", name: "Thiên Ân", email: "anbui@gmail.com", plan: "Chuyên nghiệp - Hàng năm", type: "Annual", price: "1.990.000đ / năm", status: "Pending", nextPayment: "Chờ xác nhận" },

    // More monthly & annual users
    { id: "SUB011", name: "Quốc Việt", email: "viet@gmail.com", plan: "Cao cấp", type: "Monthly", price: "99.000đ / tháng", status: "Active", nextPayment: "20/12/2025" },
    { id: "SUB012", name: "Mai Trâm", email: "tram@gmail.com", plan: "Cơ bản", type: "Monthly", price: "0đ / tháng", status: "Active", nextPayment: "Miễn phí" },
    { id: "SUB013", name: "Diễm Quỳnh", email: "quynh@gmail.com", plan: "Chuyên nghiệp", type: "Monthly", price: "199.000đ / tháng", status: "Expired", nextPayment: "Hết hạn" },
    { id: "SUB014", name: "Hữu Phúc", email: "phuc@gmail.com", plan: "Cao cấp - Hàng năm", type: "Annual", price: "990.000đ / năm", status: "Active", nextPayment: "03/2026" },
    { id: "SUB015", name: "Ngọc Trinh", email: "trinh@gmail.com", plan: "Cơ bản", type: "Monthly", price: "0đ / tháng", status: "Active", nextPayment: "Miễn phí" },
    { id: "SUB016", name: "Trung Kiên", email: "kien@gmail.com", plan: "Chuyên nghiệp", type: "Monthly", price: "199.000đ / tháng", status: "Pending", nextPayment: "Chờ thanh toán" },
    { id: "SUB017", name: "Mai Hương", email: "huong@gmail.com", plan: "Cao cấp", type: "Monthly", price: "99.000đ / tháng", status: "Active", nextPayment: "09/12/2025" },
    { id: "SUB018", name: "Hữu Tài", email: "tai@gmail.com", plan: "Chuyên nghiệp - Hàng năm", type: "Annual", price: "1.990.000đ / năm", status: "Active", nextPayment: "06/2026" },
    { id: "SUB019", name: "Minh Tâm", email: "tam@gmail.com", plan: "Cơ bản", type: "Monthly", price: "0đ / tháng", status: "Active", nextPayment: "Miễn phí" },
    { id: "SUB020", name: "Hải Nam", email: "hainam@gmail.com", plan: "Chuyên nghiệp - Hàng năm", type: "Annual", price: "1.990.000đ / năm", status: "Expired", nextPayment: "Hết hạn" },
  ]);

  // ======================
  // ✅ FILTERING
  // ======================
  const filteredData = data.filter((item) => {
    if (filters.status && item.status !== filters.status) return false;
    if (filters.type && item.type !== filters.type) return false;
    return true;
  });

  // ======================
  // ✅ TABLE COLUMNS
  // ======================
  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Tên người dùng", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },

    {
      title: "Gói đăng ký",
      dataIndex: "plan",
      render: (_, record) => (
        <Tag
          color={
            record.plan.includes("Chuyên nghiệp") ? "orange" :
            record.plan.includes("Cao cấp") ? "blue" :
            record.plan.includes("Cơ bản") ? "green" :
            "default"
          }
        >
          {record.plan}
        </Tag>
      ),
    },

    {
      title: "Loại gói",
      dataIndex: "type",
      render: (type) => (
        <Tag color={type === "Annual" ? "purple" : "cyan"}>
          {type === "Annual" ? "Hàng năm" : "Hàng tháng"}
        </Tag>
      ),
    },

    { title: "Giá", dataIndex: "price" },

    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => (
        <Tag
          color={
            status === "Active"
              ? "green"
              : status === "Pending"
              ? "gold"
              : "volcano"
          }
        >
          {status}
        </Tag>
      ),
    },

    {
      title: "",
      render: (_, record) => (
        <Button
          type="text"
          icon={<Icon icon="mdi:eye-outline" width="18" />}
          onClick={() => {
            setSelectedUser(record);
            setIsModalOpen(true);
          }}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <h2 style={{ fontWeight: 700, marginBottom: 16 }}>Quản lý gói & Thanh toán</h2>

      {/* ✅ FILTER BAR */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <Select
          placeholder="Lọc theo trạng thái"
          allowClear
          onChange={(v) => setFilters({ ...filters, status: v })}
          options={[
            { value: "Active", label: "Active" },
            { value: "Pending", label: "Pending" },
            { value: "Expired", label: "Expired" },
          ]}
        />

        <Select
          placeholder="Lọc theo loại gói"
          allowClear
          onChange={(v) => setFilters({ ...filters, type: v })}
          options={[
            { value: "Monthly", label: "Hàng tháng" },
            { value: "Annual", label: "Hàng năm" },
          ]}
        />
      </div>

      {/* ✅ TABLE */}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 7 }}
      />

      {/* ✅ MODAL DETAIL */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        title="Chi tiết thanh toán"
      >
        <p><strong>Người dùng:</strong> {selectedUser?.name}</p>
        <p><strong>Email:</strong> {selectedUser?.email}</p>
        <p><strong>Gói:</strong> {selectedUser?.plan}</p>
        <p><strong>Giá:</strong> {selectedUser?.price}</p>
        <p><strong>Trạng thái:</strong> {selectedUser?.status}</p>
        <p><strong>Thanh toán tiếp theo:</strong> {selectedUser?.nextPayment}</p>
      </Modal>
    </div>
  );
}
