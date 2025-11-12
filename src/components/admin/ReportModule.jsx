import { useState } from "react"
import { Table, Tag, Select, Button, Modal, Input } from "antd"
import { Icon } from "@iconify/react"
import "../../pages/style/ReportAdmin.css";

export default function ReportModule() {
  const [filterSeverity, setFilterSeverity] = useState(null)
  const [filterModule, setFilterModule] = useState(null)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [selectedReport, setSelectedReport] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // ==================================================================
  // MOCK DATA (20 REPORTS)
  // ==================================================================
  const reports = [
    { id: "RP001", title: "Lỗi thanh toán", module: "Thanh toán", user: "Uyên", date: "01/11/2025", severity: "Cao" },
    {
      id: "RP002",
      title: "AI phản hồi chậm",
      module: "Tư vấn AI",
      user: "Khánh Linh",
      date: "02/11/2025",
      severity: "Trung bình",
    },
    {
      id: "RP003",
      title: "Không load trang hồ sơ",
      module: "Hồ sơ người dùng",
      user: "Minh Triết",
      date: "03/11/2025",
      severity: "Thấp",
    },
    {
      id: "RP004",
      title: "Lỗi UI trên mobile",
      module: "Giao diện",
      user: "Ngọc Trinh",
      date: "03/11/2025",
      severity: "Thấp",
    },
    {
      id: "RP005",
      title: "Tự động đăng xuất",
      module: "Đăng nhập",
      user: "Lê Hân",
      date: "04/11/2025",
      severity: "Cao",
    },
    {
      id: "RP006",
      title: "Không gửi được email",
      module: "Email",
      user: "Thiên Ân",
      date: "04/11/2025",
      severity: "Trung bình",
    },
    {
      id: "RP007",
      title: "Upload hình thất bại",
      module: "Upload",
      user: "Mai Hương",
      date: "05/11/2025",
      severity: "Thấp",
    },
    {
      id: "RP008",
      title: "Không hiện đánh giá món",
      module: "Công thức",
      user: "Phúc",
      date: "05/11/2025",
      severity: "Trung bình",
    },
    {
      id: "RP009",
      title: "Search không hoạt động",
      module: "Tìm kiếm",
      user: "Vy",
      date: "05/11/2025",
      severity: "Cao",
    },
    {
      id: "RP010",
      title: "Không load gói Premium",
      module: "Thanh toán",
      user: "Quỳnh",
      date: "06/11/2025",
      severity: "Cao",
    },
    {
      id: "RP011",
      title: "Lỗi đăng nhập Google",
      module: "Đăng nhập",
      user: "Nam",
      date: "06/11/2025",
      severity: "Trung bình",
    },
    {
      id: "RP012",
      title: "Không lưu được chế độ ăn",
      module: "Theo dõi sức khoẻ",
      user: "Tài",
      date: "07/11/2025",
      severity: "Trung bình",
    },
    {
      id: "RP013",
      title: "Không xoá được công thức",
      module: "Công thức",
      user: "Linh",
      date: "07/11/2025",
      severity: "Thấp",
    },
    {
      id: "RP014",
      title: "Lỗi biểu đồ thống kê",
      module: "Dashboard",
      user: "Kiên",
      date: "08/11/2025",
      severity: "Cao",
    },
    { id: "RP015", title: "Font chữ bị lệch", module: "Giao diện", user: "Vy", date: "09/11/2025", severity: "Thấp" },
    {
      id: "RP016",
      title: "Gia hạn Premium lỗi",
      module: "Thanh toán",
      user: "Hùng",
      date: "09/11/2025",
      severity: "Cao",
    },
    {
      id: "RP017",
      title: "Không gửi được feedback",
      module: "Feedback",
      user: "Vy",
      date: "10/11/2025",
      severity: "Trung bình",
    },
    {
      id: "RP018",
      title: "Spam báo cáo",
      module: "Kiểm duyệt",
      user: "Ngọc Anh",
      date: "10/11/2025",
      severity: "Thấp",
    },
    {
      id: "RP019",
      title: "Crash khi công thức > 500",
      module: "Công thức",
      user: "Lộc",
      date: "11/11/2025",
      severity: "Cao",
    },
    {
      id: "RP020",
      title: "Không upload được avatar",
      module: "Hồ sơ người dùng",
      user: "Hòa",
      date: "11/11/2025",
      severity: "Trung bình",
    },
  ]

  // ==================================================================
  // FILTER + SEARCH
  // ==================================================================
  const filteredReports = reports.filter(
    (r) =>
      (!filterSeverity || r.severity === filterSeverity) &&
      (!filterModule || r.module === filterModule) &&
      (r.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        r.user.toLowerCase().includes(searchKeyword.toLowerCase())),
  )

  // ==================================================================
  // TABLE COLUMNS
  // ==================================================================
  const columns = [
    { title: "Mã báo cáo", dataIndex: "id", width: 120 },
    {
      title: "Vấn đề",
      dataIndex: "title",
      render: (title) => <strong>{title}</strong>,
    },
    { title: "Module", dataIndex: "module" },
    { title: "Người báo cáo", dataIndex: "user" },
    { title: "Ngày", dataIndex: "date", width: 120 },
    {
      title: "Mức độ",
      dataIndex: "severity",
      render: (sev) => <Tag color={sev === "Cao" ? "red" : sev === "Trung bình" ? "gold" : "blue"}>{sev}</Tag>,
    },
    {
      title: "",
      render: (_, record) => (
        <Button
          type="link"
          icon={<Icon icon="mdi:eye-outline" width="18" />}
          onClick={() => {
            setSelectedReport(record)
            setIsModalOpen(true)
          }}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ]

  return (
    <div className="report-admin-container">
      <h2 className="page-title">Báo cáo hệ thống</h2>

      {/* FILTER BAR */}
      <div className="report-filter-wrapper">
        <div className="report-filter-bar">
          <div className="search-box">
            <Icon icon="mdi:magnify" width="18" />
            <Input
              placeholder="Tìm theo tên lỗi hoặc người báo cáo..."
              allowClear
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>

          <Select
            placeholder="Lọc theo mức độ"
            allowClear
            onChange={(value) => setFilterSeverity(value)}
            style={{ width: 160, minWidth: 140 }}
            options={[
              { value: "Cao", label: "Cao" },
              { value: "Trung bình", label: "Trung bình" },
              { value: "Thấp", label: "Thấp" },
            ]}
          />

          <Select
            placeholder="Lọc theo module"
            allowClear
            onChange={(value) => setFilterModule(value)}
            style={{ width: 160, minWidth: 140 }}
            options={[...new Set(reports.map((r) => r.module))].map((m) => ({
              value: m,
              label: m,
            }))}
          />
        </div>
      </div>

      {/* TABLE */}
      <Table columns={columns} dataSource={filteredReports} rowKey="id" pagination={{ pageSize: 7 }} />

      {/* MODAL DETAILS */}
      <Modal open={isModalOpen} footer={null} onCancel={() => setIsModalOpen(false)} title="Chi tiết báo cáo">
        <p>
          <strong>Mã báo cáo:</strong> {selectedReport?.id}
        </p>
        <p>
          <strong>Vấn đề:</strong> {selectedReport?.title}
        </p>
        <p>
          <strong>Module:</strong> {selectedReport?.module}
        </p>
        <p>
          <strong>Người báo cáo:</strong> {selectedReport?.user}
        </p>
        <p>
          <strong>Ngày báo cáo:</strong> {selectedReport?.date}
        </p>
        <p>
          <strong>Mức độ nghiêm trọng:</strong> {selectedReport?.severity}
        </p>
      </Modal>
    </div>
  )
}
