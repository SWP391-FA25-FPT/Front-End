import React, { useState } from "react";
import { FaUserShield, FaUser, FaEllipsisV } from "react-icons/fa";
import "../../pages/style/UserManagementAdmin.css";
import { Modal } from "antd";

const { confirm } = Modal;

export default function UserManagementModule() {
  const initialUsers = [
    { id: "USR001", name: "Nguyễn Văn A", role: "Admin", active: true },
    { id: "USR002", name: "Trần Thị B", role: "User", active: true },
    { id: "USR003", name: "Hoàng Văn C", role: "User", active: false },
    { id: "USR004", name: "Lê Thanh D", role: "User", active: true },
    { id: "USR005", name: "Nguyễn Thị E", role: "Admin", active: false },
    { id: "USR006", name: "Phạm Quốc F", role: "User", active: true },
    { id: "USR007", name: "Lê Minh G", role: "User", active: true },
    { id: "USR008", name: "Đặng Thanh H", role: "User", active: true },
    { id: "USR009", name: "Nguyễn Đức I", role: "Admin", active: true },
    { id: "USR010", name: "Huỳnh Lan K", role: "User", active: false },
  ];

  const [users, setUsers] = useState(initialUsers);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("Tất cả");
  const [openMenu, setOpenMenu] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [detailUser, setDetailUser] = useState(null);

  const openDetailModal = (user) => {
    setDetailUser(user);
    setIsUserModalOpen(true);
    setOpenMenu(null);
  };

  // 🔥 Xác nhận khóa/kích hoạt
  const toggleActive = (id) => {
    confirm({
      title: "Xác nhận thay đổi trạng thái",
      content: "Bạn có chắc muốn thay đổi trạng thái tài khoản này không?",
      okText: "Có",
      cancelText: "Hủy",
      centered: true,
      onOk() {
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
        );
        setOpenMenu(null);
      },
    });
  };

  // 🔥 Xác nhận xóa tài khoản
  const deleteUser = (id) => {
    confirm({
      title: "Xác nhận xóa tài khoản",
      content: "Hành động này không thể hoàn tác, bạn có chắc chắn muốn xóa?",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      centered: true,
      onOk() {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        setOpenMenu(null);
      },
    });
  };

  const getRoleUI = (role) => (role === "Admin" ? "Quản trị viên" : "Người dùng");

  const getRoleStyle = (role) =>
    role === "Admin"
      ? { class: "badge-role admin", icon: <FaUserShield size={14} /> }
      : { class: "badge-role user", icon: <FaUser size={14} /> };

  const filteredUsers = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "Tất cả" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="user-management-container">
      <h2 className="page-title">Quản lý người dùng</h2>

      {/* FILTER BAR */}
      <div className="user-filter-bar">
        <input
          type="text"
          placeholder="Tìm theo tên người dùng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
          <option value="Tất cả">Tất cả vai trò</option>
          <option value="Admin">Quản trị viên</option>
          <option value="User">Người dùng</option>
        </select>
      </div>

      {/* USER TABLE */}
      <table className="user-table">
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Họ và tên</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th className="text-end">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((u) => {
            const style = getRoleStyle(u.role);
            return (
              <tr key={u.id} className={selected.includes(u.id) ? "row-selected" : ""}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(u.id)}
                    onChange={() => toggleSelect(u.id)}
                  />
                </td>

                <td>{u.id}</td>
                <td className="fw-semibold">{u.name}</td>

                <td>
                  <span className={`badge ${style.class}`}>
                    {style.icon} &nbsp; {getRoleUI(u.role)}
                  </span>
                </td>

                <td>
                  <span className={`badge status ${u.active ? "active" : "inactive"}`}>
                    {u.active ? "Đang hoạt động" : "Bị vô hiệu hóa"}
                  </span>
                </td>

                <td className="text-end position-relative">
                  <button
                    className="btn-action"
                    onClick={() => setOpenMenu(openMenu === u.id ? null : u.id)}
                  >
                    <FaEllipsisV />
                  </button>

                  {openMenu === u.id && (
                    <div className="dropdown-action">
                      <p onClick={() => openDetailModal(u)}>Xem chi tiết</p>
                      <p onClick={() => toggleActive(u.id)}>
                        {u.active ? "Khóa tài khoản" : "Kích hoạt tài khoản"}
                      </p>
                      <p className="danger" onClick={() => deleteUser(u.id)}>Xóa tài khoản</p>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* MODAL CHI TIẾT */}
      <Modal
        title="Thông tin người dùng"
        open={isUserModalOpen}
        onCancel={() => setIsUserModalOpen(false)}
        footer={null}
        centered
      >
        {detailUser && (
          <div className="user-detail-modal">
            <p><strong>Mã người dùng:</strong> {detailUser.id}</p>
            <p><strong>Họ và tên:</strong> {detailUser.name}</p>
            <p><strong>Vai trò:</strong> {detailUser.role === "Admin" ? "Quản trị viên" : "Người dùng"}</p>
            <p><strong>Trạng thái:</strong> {detailUser.active ? "Đang hoạt động" : "Bị vô hiệu hóa"}</p>
            <p><strong>Email:</strong> {detailUser.name.toLowerCase().replace(/ /g, "")}@gmail.com</p>
            <p><strong>Ngày tạo tài khoản:</strong> 12/09/2025</p>

            <button
              className="btn btn-primary w-100 mt-3"
              onClick={() => setIsUserModalOpen(false)}
            >
              Đóng
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
