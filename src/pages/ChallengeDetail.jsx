import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/layout/SettingLayout";
import Logo from "../assets/icon.svg";
import "./style/ChallengeDetail.css";

const ChallengeDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [search, setSearch] = useState("");

  // Mock data - trong thực tế sẽ fetch từ API
  const challenge = {
    id: 1,
    title: "Trung thu trọn vị",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
    description: "Chúc mừng Tết trung thu",
    chefCount: "1 chủ bếp đãi thun gia",
    dishCount: "1 món",
    timeLeft: "Còn 7 ngày",
    duration: "27/09 - 07/10",
    hashtag: "#trungthutronvi",
    fullDescription: `
      Chào mừng các bạn đến với thử thách "Trung thu trọn vị"! 
      
      Hãy chia sẻ công thức món ăn yêu thích của bạn trong dịp Tết Trung thu. 
      Có thể là món truyền thống như bánh trung thu, chè, hoặc món sáng tạo 
      mang hương vị trung thu.
      
      Hãy kể câu chuyện và kỷ niệm đẹp của bạn về Tết Trung thu, sử dụng hashtag 
      #trungthutronvi để tham gia thử thách.
      
      Yêu cầu đăng bài:
      - Thời gian/chế biến đầy đủ
      - Danh sách nguyên liệu chi tiết
      - Ảnh sản phẩm đẹp
      - Ít nhất 2 ảnh quá trình chế biến với hướng dẫn từng bước
    `,
    prizes: [
      "Công thức có lời giới thiệu ấn tượng nhất",
      "Công thức ấn tượng nhất từ chủ bếp mới"
    ],
    prizeNote: "(Chủ bếp mới là người chưa hoặc ít tham gia các thử thách của M&M)",
    prizeItem: "Mỗi giải thưởng là một chiếc thớt gỗ MBM"
  };

  const submittedDishes = [
    {
      id: 1,
      title: "Bánh trung thu",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
      chef: "Chef Minh",
      likes: 15
    }
  ];

  return (
    <Layout>
      <div className="challenge-detail-page">
        {/* Logo */}
        <div className="challenge-detail-logo">
          <img 
            src={Logo} 
            alt="M&M Logo" 
            className="logo-image"
            onClick={() => navigate('/')}
          />
          <span className="logo-text" onClick={() => navigate('/')}>M&M</span>
        </div>

        {/* Header */}
        <div className="challenge-detail-header">
          <div className="search-container">
            <div className="search-box">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <i className="bi bi-search"></i>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="challenge-detail-content">
          {/* Challenge Banner */}
          <div className="challenge-banner">
            <img src={challenge.image} alt={challenge.title} />
            <div className="banner-overlay">
              <span className="banner-text">{challenge.description}</span>
            </div>
          </div>

          {/* Challenge Info Bar */}
          <div className="challenge-info-bar">
            <div className="info-item">
              <i className="bi bi-person"></i>
              <span>{challenge.chefCount}</span>
            </div>
            <div className="info-item">
              <i className="bi bi-egg-fried"></i>
              <span>{challenge.dishCount}</span>
            </div>
            <div className="info-item">
              <i className="bi bi-clock"></i>
              <span>{challenge.timeLeft}</span>
            </div>
          </div>

          {/* Challenge Title */}
          <h1 className="challenge-detail-title">{challenge.title}</h1>

          {/* Challenge Description */}
          <div className="challenge-description">
            <div className="description-text">
              {challenge.fullDescription.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
            
            <div className="challenge-details">
              <div className="detail-item">
                <strong>Thời gian diễn ra:</strong> {challenge.duration}
              </div>
              <div className="detail-item">
                <strong>Hashtag:</strong> {challenge.hashtag}
              </div>
            </div>

            <div className="prizes-section">
              <h3>Thử thách lần này sẽ có 2 giải thưởng nho nhỏ:</h3>
              <ul className="prizes-list">
                {challenge.prizes.map((prize, index) => (
                  <li key={index}>{prize}</li>
                ))}
              </ul>
              <p className="prize-note">{challenge.prizeNote}</p>
              <p className="prize-item">{challenge.prizeItem}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="challenge-actions">
            <button className="btn-submit">Gửi món tham gia</button>
            <button className="btn-share">Chia sẻ</button>
          </div>

          {/* Submitted Dishes */}
          <div className="submitted-dishes">
            <h2>{submittedDishes.length} món đã lên đăng tài</h2>
            <div className="dishes-grid">
              {submittedDishes.map((dish) => (
                <div key={dish.id} className="dish-card">
                  <img src={dish.image} alt={dish.title} />
                  <div className="dish-info">
                    <h4>{dish.title}</h4>
                    <p>by {dish.chef}</p>
                    <div className="dish-stats">
                      <i className="bi bi-heart"></i>
                      <span>{dish.likes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChallengeDetail;
