import React from 'react';
import { Link } from 'react-router-dom';
import { sendRequest, acceptRequest, declineRequest, unfriend } from '../../apis/friendApi'; 
import { message } from "antd"; // Sử dụng Antd message

const FriendActionButton = ({ status, targetUserId, requestId, onActionSuccess }) => {

  // SỬA: HÀM NÀY ĐÃ ĐƯỢC FIX ĐỂ XỬ LÝ LỖI 400 ĐÃ TỒN TẠI YÊU CẦU
  const handleSendRequest = async () => {
    try {
      const response = await sendRequest(targetUserId); 
      console.log("Lời mời đã được gửi thành công:", response.data);
      onActionSuccess(); // Tải lại data để status chuyển thành 'pending_sent'
      message.success("Đã gửi lời mời kết bạn!");
    } catch (error) {
      console.error("Error sending request", error.response?.data || error);
      
      const responseData = error.response?.data;
      const errorMessage = responseData?.error || responseData?.message || 'Lỗi không xác định';
      
      if (error.response?.status === 400 && (errorMessage.includes("Đã gửi lời mời") || errorMessage.includes("đã là bạn") || errorMessage.includes("Bạn không thể kết bạn với chính mình"))) {
          onActionSuccess(); // Buộc tải lại data để cập nhật UI
          message.warning(`Thông báo: ${errorMessage}. Đang cập nhật trạng thái...`);
      } else {
          message.error(`Lỗi khi gửi lời mời: ${errorMessage}`);
      }
    }
  };

  const handleAccept = async () => {
    try {
      await acceptRequest(requestId);
      onActionSuccess(); 
      message.success("Đã chấp nhận kết bạn!");
    } catch (error) {
      console.error("Error accepting request", error);
      message.error("Lỗi khi chấp nhận");
    }
  };

  const handleDecline = async () => {
    try {
      await declineRequest(requestId);
      onActionSuccess(); 
      message.info("Đã từ chối/hủy lời mời.");
    } catch (error) {
      console.error("Error declining request", error);
      message.error("Lỗi khi từ chối/hủy");
    }
  };

  const handleUnfriend = async () => {
    // SỬ DỤNG MODAL CỦA ANTD HOẶC TỰ TẠO MODAL thay vì window.confirm
    // Tạm thời dùng window.confirm nếu không có modal component
    if (window.confirm('Bạn có chắc muốn hủy kết bạn với người này?')) {
      try {
        await unfriend(targetUserId);
        onActionSuccess(); 
        message.success("Đã hủy kết bạn thành công.");
      } catch (error) {
        console.error("Error unfriending", error);
        message.error("Lỗi khi hủy kết bạn");
      }
    }
  };

  switch (status) {
    case 'self':
      return (
        <Link to={`/user/${targetUserId}/edit`} className="btn btn-outline-primary">
          Chỉnh sửa hồ sơ
        </Link>
      );
    // TRẠNG THÁI 1: CHƯA LÀM GÌ
    case 'none':
      return (
        <button onClick={handleSendRequest} className="btn btn-primary">
          ➕ Thêm bạn bè
        </button>
      );
    // TRẠNG THÁI 2: ĐÃ GỬI LỜI MỜI (YÊU CẦU: HIỆN "HỦY YÊU CẦU")
    case 'pending_sent':
      return (
        // Sender dùng handleDecline để hủy yêu cầu
        <button onClick={handleDecline} className="btn btn-warning text-white">
          Hủy yêu cầu
        </button>
      );
    // TRẠNG THÁI 3: ĐÃ NHẬN LỜI MỜI
    case 'pending_received':
      return (
        <div className="d-flex gap-2"> 
          <button onClick={handleAccept} className="btn btn-success">✅ Chấp nhận</button>
          <button onClick={handleDecline} className="btn btn-outline-danger">❌ Từ chối</button>
        </div>
      );
    // TRẠNG THÁI 4: ĐÃ LÀ BẠN BÈ
    case 'friends':
      return (
        <div className="d-flex align-items-center gap-2">
            <span className="badge text-bg-success py-2 px-3 fs-6">
                🤝 Bạn bè
            </span>
            <button onClick={handleUnfriend} className="btn btn-sm btn-outline-danger" title="Hủy kết bạn">
                💔
            </button>
        </div>
      );
    default:
      // Hiển thị nút loading nhỏ nếu status là null/undefined
      return <Spin size="small" />; 
  }
};

export default FriendActionButton;