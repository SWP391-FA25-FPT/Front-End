import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spin, message, Card, Row, Col, Space, Popconfirm } from "antd";
import { 
  getChallengeById, 
  deleteChallenge
} from "../../apis/challenge";
import { Edit, Trash2, ArrowLeft, Users, FileText, Calendar, Award } from "lucide-react";
import ChallengeFormModal from "./ChallengeFormModal";
import "../../pages/style/AdminChallengeDetail.css";

const AdminChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getChallengeById(id);
        if (response.success) {
          setChallenge(response.data);
        } else {
          setError("Không tìm thấy thử thách");
          message.error("Không tìm thấy thử thách");
        }
      } catch (err) {
        console.error("Error fetching challenge:", err);
        setError(err.message || "Lỗi khi tải dữ liệu thử thách");
        message.error(err.message || "Lỗi khi tải dữ liệu thử thách");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchChallenge();
    }
  }, [id]);

  const handleEdit = () => {
    setEditingChallenge(challenge);
    setShowFormModal(true);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteChallenge(id);
      message.success("Xóa thử thách thành công!");
      navigate("/admin/challenges");
    } catch (err) {
      console.error("Error deleting challenge:", err);
      message.error(err.message || "Lỗi khi xóa thử thách");
    } finally {
      setDeleting(false);
    }
  };

  const handleFormSuccess = () => {
    setShowFormModal(false);
    setEditingChallenge(null);
    // Refresh challenge data
    const fetchChallenge = async () => {
      try {
        const response = await getChallengeById(id);
        if (response.success) {
          setChallenge(response.data);
          message.success("Cập nhật thử thách thành công!");
        }
      } catch (err) {
        console.error("Error refreshing challenge:", err);
      }
    };
    fetchChallenge();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      ongoing: { class: "badge bg-success", text: "Đang diễn ra" },
      upcoming: { class: "badge bg-info", text: "Sắp diễn ra" },
      ended: { class: "badge bg-secondary", text: "Đã kết thúc" },
    };
    const config = statusConfig[status] || statusConfig.upcoming;
    return <span className={config.class}>{config.text}</span>;
  };

  if (loading) {
    return (
      <div style={{ padding: 100, textAlign: "center" }}>
        <Spin size="large" />
        <p style={{ marginTop: "16px" }}>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div style={{ padding: 100, textAlign: "center" }}>
        <p style={{ color: "#ff4d4f" }}>{error || "Không tìm thấy thử thách"}</p>
        <Button onClick={() => navigate("/admin/challenges")} style={{ marginTop: 16 }}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="admin-challenge-detail">
        {/* Header Actions */}
        <div className="admin-challenge-header mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <Button
              type="text"
              icon={<ArrowLeft size={18} />}
              onClick={() => navigate("/admin/challenges")}
            >
              Quay lại quản lý thử thách
            </Button>
            <Space>
              <Button
                type="primary"
                icon={<Edit size={16} />}
                onClick={handleEdit}
              >
                Chỉnh sửa
              </Button>
              <Popconfirm
                title="Xác nhận xóa"
                description="Bạn có chắc chắn muốn xóa thử thách này?"
                onConfirm={handleDelete}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <Button
                  danger
                  icon={<Trash2 size={16} />}
                  loading={deleting}
                >
                  Xóa
                </Button>
              </Popconfirm>
            </Space>
          </div>
        </div>

        {/* Challenge Banner */}
        {challenge.image && (
          <div className="admin-challenge-banner mb-4">
            <img
              src={challenge.image}
              alt={challenge.title}
              className="w-100"
              style={{
                height: "300px",
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />
          </div>
        )}

        {/* Stats Cards */}
        <Row gutter={[16, 16]} className="mb-4">
          <Col xs={24} sm={12} md={6}>
            <Card>
              <div className="text-center">
                <Calendar size={24} className="mb-2 text-primary" />
                <div className="mb-1 text-muted small">Trạng thái</div>
                <div>{getStatusBadge(challenge.status)}</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <div className="text-center">
                <Users size={24} className="mb-2 text-success" />
                <div className="mb-1 text-muted small">Người tham gia</div>
                <div className="h4 mb-0 fw-bold">
                  {challenge.participants?.length || challenge.participantsCount || 0}
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <div className="text-center">
                <FileText size={24} className="mb-2 text-info" />
                <div className="mb-1 text-muted small">Bài nộp</div>
                <div className="h4 mb-0 fw-bold">
                  {challenge.entries?.length || challenge.entriesCount || 0}
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <div className="text-center">
                <Award size={24} className="mb-2 text-warning" />
                <div className="mb-1 text-muted small">Giải thưởng</div>
                <div className="h4 mb-0 fw-bold">
                  {challenge.prizes?.length || 0}
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Challenge Info */}
        <Card title="Thông tin thử thách" className="mb-4">
          <div className="mb-3">
            <h4 className="fw-bold">{challenge.title}</h4>
            <span className="badge bg-info me-2">{challenge.category}</span>
            {getStatusBadge(challenge.status)}
          </div>
          
          <div className="mb-3">
            <strong>Mô tả:</strong>
            <p className="mt-2">{challenge.description}</p>
          </div>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <div className="mb-2">
                <strong>Ngày bắt đầu:</strong> {formatDate(challenge.startDate)}
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="mb-2">
                <strong>Ngày kết thúc:</strong> {formatDate(challenge.endDate)}
              </div>
            </Col>
            {challenge.host && (
              <Col xs={24} md={12}>
                <div className="mb-2">
                  <strong>Người tổ chức:</strong> {challenge.host.name || "N/A"}
                </div>
              </Col>
            )}
            <Col xs={24} md={12}>
              <div className="mb-2">
                <strong>Ngày tạo:</strong> {formatDate(challenge.createdAt)}
              </div>
            </Col>
          </Row>

          {challenge.hashtags && challenge.hashtags.length > 0 && (
            <div className="mt-3">
              <strong>Hashtags:</strong>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {challenge.hashtags.map((tag, index) => (
                  <span key={index} className="badge bg-primary">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Requirements */}
        {challenge.requirements && challenge.requirements.length > 0 && (
          <Card title="Yêu cầu tham gia" className="mb-4">
            <ul>
              {challenge.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </Card>
        )}

        {/* Prizes */}
        {challenge.prizes && challenge.prizes.length > 0 && (
          <Card title="Giải thưởng" className="mb-4">
            <Row gutter={[16, 16]}>
              {challenge.prizes.map((prize, index) => (
                <Col xs={24} sm={12} md={8} key={index}>
                  <Card size="small" className="text-center">
                    <Award size={32} className="mb-2 text-warning" />
                    <h5>{prize.rank || `Giải ${index + 1}`}</h5>
                    <p className="mb-0">{prize.description || prize.name || "N/A"}</p>
                  </Card>
                </Col>
              ))}
            </Row>
            {challenge.prizeDetails && (
              <div className="mt-3">
                {challenge.prizeDetails.note && (
                  <p><strong>Ghi chú:</strong> {challenge.prizeDetails.note}</p>
                )}
                {challenge.prizeDetails.items && (
                  <p><strong>Chi tiết:</strong> {challenge.prizeDetails.items}</p>
                )}
              </div>
            )}
          </Card>
        )}

        {/* Participants */}
        {challenge.participants && challenge.participants.length > 0 && (
          <Card title={`Người tham gia (${challenge.participants.length})`} className="mb-4">
            <div className="d-flex flex-wrap gap-2">
              {challenge.participants.map((participant, index) => (
                <span key={index} className="badge bg-success">
                  {typeof participant === 'object' ? participant.name || participant.email : participant}
                </span>
              ))}
            </div>
          </Card>
        )}

        {/* Entries */}
        {challenge.entries && challenge.entries.length > 0 && (
          <Card title={`Bài nộp (${challenge.entries.length})`} className="mb-4">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Người nộp</th>
                    <th>Tiêu đề</th>
                    <th>Likes</th>
                    <th>Ngày nộp</th>
                  </tr>
                </thead>
                <tbody>
                  {challenge.entries.map((entry, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        {typeof entry.userId === 'object' 
                          ? entry.userId?.name || entry.author 
                          : entry.author}
                      </td>
                      <td>{entry.title || "N/A"}</td>
                      <td>{entry.likes?.length || 0}</td>
                      <td>{formatDate(entry.submittedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {/* Edit Modal */}
      {showFormModal && (
        <ChallengeFormModal
          challenge={editingChallenge}
          onClose={() => {
            setShowFormModal(false);
            setEditingChallenge(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}
    </>
  );
};

export default AdminChallengeDetail;

