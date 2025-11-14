import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spin, message, Card, Row, Col, Space, Popconfirm } from "antd";
import { 
  getChallengeById, 
  deleteChallenge,
  awardPrize
} from "../../apis/challenge";
import { Edit, Trash2, ArrowLeft, Users, FileText, Calendar, Award, Eye, ExternalLink } from "lucide-react";
import ChallengeFormModal from "./ChallengeFormModal";
import EntryDetailModal from "./EntryDetailModal";
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
  const [awarding, setAwarding] = useState(false);
  const [showEntryDetail, setShowEntryDetail] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

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

  const handleAwardPrize = async (entryId) => {
    try {
      setAwarding(true);
      const response = await awardPrize(id, entryId);
      if (response.success) {
        message.success("Trao giải thành công!");
        // Refresh challenge data
        const updatedResponse = await getChallengeById(id);
        if (updatedResponse.success) {
          setChallenge(updatedResponse.data);
        }
      }
    } catch (err) {
      console.error("Error awarding prize:", err);
      message.error(err.message || "Lỗi khi trao giải");
    } finally {
      setAwarding(false);
    }
  };

  // Calculate interaction score: (views + rating) / 2
  const calculateInteractionScore = (entry) => {
    const views = entry.views || 0;
    const rating = entry.rating || 0;
    return (views + rating) / 2;
  };

  // Sort entries by interaction score (highest first)
  const sortedEntries = challenge && challenge.entries
    ? [...challenge.entries].sort((a, b) => calculateInteractionScore(b) - calculateInteractionScore(a))
    : [];

  const handleViewEntryDetail = (entry) => {
    setSelectedEntry(entry);
    setShowEntryDetail(true);
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
        <Card 
          title={`Bài nộp (${challenge.entries?.length || 0})`}
          className="mb-4"
        >
          {challenge.entries && challenge.entries.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "50px" }}>STT</th>
                    <th style={{ width: "100px" }}>Hình ảnh</th>
                    <th>Món ăn</th>
                    <th>Cách nấu/Status</th>
                    <th>Người nộp</th>
                    <th style={{ width: "80px" }}>Rating</th>
                    <th style={{ width: "80px" }}>Views</th>
                    <th style={{ width: "100px" }}>Điểm tương tác</th>
                    <th>Ngày nộp</th>
                    <th style={{ width: "150px" }} className="text-end">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedEntries.map((entry, index) => {
                    const authorName = typeof entry.userId === 'object' 
                      ? entry.userId?.name || entry.author 
                      : entry.author;
                    const authorEmail = typeof entry.userId === 'object' 
                      ? entry.userId?.email 
                      : null;
                    const authorAvatar = typeof entry.userId === 'object' 
                      ? entry.userId?.avatar || entry.authorAvatar 
                      : entry.authorAvatar;
                    const recipeId = entry.recipeId?._id || entry.recipeId;
                    
                    return (
                      <tr key={entry._id || index}>
                        <td className="text-center">{index + 1}</td>
                        <td>
                          {entry.image ? (
                            <img
                              src={entry.image}
                              alt={entry.title}
                              className="rounded"
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <div
                              className="rounded d-flex align-items-center justify-content-center bg-light"
                              style={{
                                width: "60px",
                                height: "60px",
                              }}
                            >
                              <FileText size={24} className="text-muted" />
                            </div>
                          )}
                        </td>
                        <td>
                          <div>
                            <strong>{entry.title || "N/A"}</strong>
                            {entry.isPremium && (
                              <span className="badge bg-warning ms-2">Premium</span>
                            )}
                            {challenge.winnerEntryId?.toString() === entry._id?.toString() && (
                              <span className="badge bg-success ms-2">
                                🏆 Đã thắng giải
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div style={{ maxWidth: "200px" }}>
                            {entry.content ? (
                              <div 
                                style={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                }}
                                title={entry.content}
                              >
                                {entry.content}
                              </div>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            {authorAvatar && (
                              <img
                                src={authorAvatar}
                                alt={authorName}
                                className="rounded-circle me-2"
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  objectFit: "cover",
                                }}
                              />
                            )}
                            <div>
                              <div className="fw-medium">{authorName}</div>
                              {authorEmail && (
                                <small className="text-muted d-block">{authorEmail}</small>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-warning">
                            {entry.rating || 0}
                          </span>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-info">
                            {entry.views || 0}
                          </span>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-primary" style={{ fontSize: "0.9rem" }}>
                            {calculateInteractionScore(entry).toFixed(2)}
                          </span>
                        </td>
                        <td>{formatDate(entry.submittedAt)}</td>
                        <td className="text-end">
                          <Space>
                            <Button
                              type="default"
                              size="small"
                              icon={<Eye size={14} />}
                              onClick={() => handleViewEntryDetail(entry)}
                              title="Xem chi tiết"
                            >
                              Chi tiết
                            </Button>
                            {challenge.status === "ended" && (
                              challenge.winnerEntryId?.toString() === entry._id?.toString() ? (
                                <Button
                                  type="primary"
                                  size="small"
                                  icon={<Award size={14} />}
                                  disabled
                                  style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                                >
                                  🏆 Winner
                                </Button>
                              ) : (
                                <Popconfirm
                                  title="Xác nhận trao giải"
                                  description={`Trao giải cho bài nộp này?`}
                                  onConfirm={() => handleAwardPrize(entry._id)}
                                  okText="Xác nhận"
                                  cancelText="Hủy"
                                >
                                  <Button
                                    type="primary"
                                    size="small"
                                    icon={<Award size={14} />}
                                    loading={awarding}
                                    disabled={awarding || !!challenge.winnerEntryId}
                                  >
                                    Winner
                                  </Button>
                                </Popconfirm>
                              )
                            )}
                            {recipeId && (
                              <Button
                                type="link"
                                size="small"
                                icon={<ExternalLink size={14} />}
                                onClick={() => window.open(`/recipe/${recipeId}`, '_blank')}
                                title="Xem công thức"
                              >
                                Recipe
                              </Button>
                            )}
                          </Space>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-muted">
              <FileText size={48} className="mb-3 opacity-50" />
              <p>Chưa có bài nộp nào</p>
            </div>
          )}
        </Card>
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

      {/* Entry Detail Modal */}
      <EntryDetailModal
        entry={selectedEntry}
        visible={showEntryDetail}
        onClose={() => {
          setShowEntryDetail(false);
          setSelectedEntry(null);
        }}
      />
    </>
  );
};

export default AdminChallengeDetail;

