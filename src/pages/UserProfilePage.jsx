import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom"; 
import { getProfile } from "../apis/user"; // Giả định getProfile trả về friendshipStatus
import FriendActionButton from "../components/User/FriendActionButton";
import Layout from "../components/layout/Applayout"; // Giả định Applayout là layout chính
import { useAuth } from "../context/useAuth"; 
import { createOrGetConversation } from "../services/messageService";
import { message } from "antd"; // Sử dụng Antd message thay vì alert

// Component loading/error
const LoadingComponent = () => <div>Đang tải hồ sơ...</div>;
const ErrorComponent = ({ msg }) => <div>Lỗi: {msg}</div>;

const UserProfilePage = () => {
  const { userId } = useParams(); 
  const navigate = useNavigate();
  const { user: loggedInUser, isAuthenticated } = useAuth(); 

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({});
  const [recipes, setRecipes] = useState([]);
  
  // STATE CỐT LÕI CHO NÚT BẤM
  const [friendStatus, setFriendStatus] = useState('none'); // 'none', 'pending_sent', 'pending_received', 'friends'
  const [friendRequestId, setFriendRequestId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfile = useCallback(async () => {
    if (!userId) {
      setError("Không tìm thấy người dùng");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getProfile(userId); 

      if (data?.user) {
        setProfile(data.user);
        setStats(data.stats || {});
        setRecipes(data.recipes || []); 
        setError(null);
        
        // Lấy trạng thái bạn bè từ API (Quan trọng để nút hoạt động)
        setFriendStatus(data.user.friendshipStatus || 'none'); 
        setFriendRequestId(data.user.friendshipRequestId);
        
      } else {
        setError("Không thể tải hồ sơ người dùng");
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError(err.message || "Lỗi máy chủ");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // HÀM XỬ LÝ NHẮN TIN (LOGIC TẠO CONVERSATION ĐÃ ĐƯỢC CẬP NHẬT)
  const handleMessage = async () => {
    if (!isAuthenticated()) {
        message.warn("Vui lòng đăng nhập để nhắn tin.");
        return;
    }
    if (loggedInUser._id === userId) {
        message.warn("Không thể nhắn tin với chính mình.");
        return;
    }

    try {
        // 1. Gọi API tạo/lấy Conversation
        // Giả định createOrGetConversation(recipientId) thực hiện POST /messages { recipientId: targetId }
        const response = await createOrGetConversation(profile._id); 
        
        // SỬA: Lấy ID từ response.conversation._id để khớp với cấu trúc backend
        const conversationId = response?.conversation?._id || response?._id; 
        
        if (!conversationId) {
             throw new Error("Không nhận được ID cuộc trò chuyện từ server.");
        }
        
        // 2. CHUYỂN HƯỚNG ĐẾN TRANG TIN NHẮN (MESSAGE PAGE)
        // Truyền ID conversation để MessagesPage tự mở cuộc trò chuyện này
        navigate(`/messages?id=${conversationId}`); 

    } catch (error) {
        console.error("Lỗi khi tạo/lấy conversation:", error);
        // Cố gắng lấy thông báo lỗi từ server
        const serverMessage = error.response?.data?.message || error.message || 'Không thể khởi tạo cuộc trò chuyện.';
        
        // Nếu có lỗi 4xx, hiển thị thông báo cụ thể
        if (error.response?.status === 403 || error.response?.status === 400 || error.response?.status === 404) {
            message.error(`Lỗi: ${serverMessage}`);
        } else {
            message.error(`Lỗi hệ thống: ${serverMessage}`);
        }
    }
  };


  if (loading) {
    return <Layout><LoadingComponent /></Layout>;
  }

  if (error || !profile) {
    return <Layout><ErrorComponent msg={error || "Không tìm thấy hồ sơ"} /></Layout>;
  }

  // Lấy avatar
  const avatarUrl = profile.profile?.profileImageUrl || `https://placehold.co/150x150/c0c0c0/ffffff?text=${profile.name?.charAt(0) || 'U'}`;

  // LOGIC RENDER NÚT HÀNH ĐỘNG (THEO YÊU CẦU BỐ CỤC)
  const renderActionButtons = () => {
    if (!loggedInUser || friendStatus === null) return null; 

    const isOwnProfile = loggedInUser._id === userId;

    if (isOwnProfile) {
      // 1. CHỦ HỒ SƠ: Nút Chỉnh sửa
      return (
        <Link to={`/user/${userId}/edit`} className="btn btn-outline-primary">
          Chỉnh sửa hồ sơ
        </Link>
      );
    } 

    // 2. NGƯỜI DÙNG KHÁC: Nút Bạn bè + Nhắn tin
    return (
      <div className="d-flex gap-2 align-items-center">
        {/* Nút 1: Kết bạn / Hủy yêu cầu / Bạn bè */}
        <FriendActionButton 
          status={friendStatus} 
          targetUserId={profile._id}
          requestId={friendRequestId}
          onActionSuccess={fetchUserProfile} // QUAN TRỌNG: Gọi lại API để cập nhật trạng thái
        />
        
        {/* Nút 2: Nhắn tin */}
        <button 
            onClick={handleMessage} 
            className="btn btn-info text-white" 
        >
            ✉️ Gửi tin nhắn
        </button>
        
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mt-5">
        
        {/* BỐ CỤC GIỐNG FILE PROFILEPAGE/USERPROFILEPAGE GỐC */}
        <div className="row align-items-center p-4 bg-light rounded-3 shadow-sm">
          <div className="col-md-2 text-center">
            <img 
              src={avatarUrl} 
              alt={profile.name}
              className="rounded-circle img-fluid"
              style={{ width: '150px', height: '150px', objectFit: 'cover', border: '4px solid white' }}
            />
          </div>
          <div className="col-md-6">
            <h2 className="fw-bold display-5">{profile.name}</h2>
            <p className="text-muted fs-4">@{profile.username}</p>
            
            <div className="d-flex gap-4 mt-3">
              <span><strong>{stats.friends || 0}</strong> bạn bếp</span>
              <span><strong>{stats.followers || 0}</strong> người quan tâm</span>
              <span><strong>{stats.recipes || 0}</strong> món đã đăng</span>
            </div>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            {profile && renderActionButtons()}
          </div>
        </div>

        {/* (Phần tabs... giữ nguyên) */}
        <div className="mt-5">
          <ul className="nav nav-tabs nav-fill fs-5">
            <li className="nav-item">
              <a className="nav-link active" href="#!">Món đã đăng</a>
            </li>
          </ul>
          
          <div className="tab-content p-4 border border-top-0">
            <div className="tab-pane fade show active">
              {recipes.length === 0 ? (
                <div className="text-center p-5">
                  <p className="text-muted">Chưa có món nào được chia sẻ.</p>
                </div>
              ) : (
                <div className="row g-4">
                  {recipes.map(recipe => (
                    <div className="col-md-4" key={recipe._id}>
                      <div className="card h-100">
                        <img src={recipe.image} className="card-img-top" alt={recipe.name} style={{height: '200px', objectFit: 'cover'}} />
                        <div className="card-body">
                          <h5 className="card-title">{recipe.name}</h5>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfilePage;