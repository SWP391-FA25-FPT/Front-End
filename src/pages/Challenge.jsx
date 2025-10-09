import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/AppLayout";
import "./style/Challenge.css";

const Challenge = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const challenges = [
    {
      id: 1,
      title: "Trung thu trọn vị",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      description: "Chúc mừng Tết trung thu",
      chefCount: "1 chủ bếp đãi thun gia",
      dishCount: "1 món",
      timeLeft: "Còn 7 ngày",
      duration: "27/09 - 07/10",
      hashtag: "#trungthutronvi"
    },
    {
      id: 2,
      title: "Món ngon cuối tuần",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
      description: "Chia sẻ món ăn yêu thích",
      chefCount: "5 chủ bếp tham gia",
      dishCount: "3 món",
      timeLeft: "Còn 3 ngày",
      duration: "20/09 - 30/09",
      hashtag: "#monngoncuoituan"
    },
    {
      id: 3,
      title: "Healthy Breakfast",
      image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=300&fit=crop",
      description: "Bữa sáng lành mạnh",
      chefCount: "8 chủ bếp tham gia",
      dishCount: "5 món",
      timeLeft: "Còn 5 ngày",
      duration: "25/09 - 05/10",
      hashtag: "#healthybreakfast"
    }
  ];

  const filteredChallenges = challenges.filter(challenge =>
    challenge.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="challenge-page">
        {/* Header with Search */}
        <div className="challenge-header">
          <div className="header-content">
            {/* Search */}
            <div className="search-container">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Tìm kiếm thử thách..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <i className="bi bi-search"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="challenge-content">
          <h1 className="challenge-title">
            {filteredChallenges.length} Thử thách đang diễn ra
          </h1>

          <div className="challenges-grid">
            {filteredChallenges.map((challenge) => (
              <div 
                key={challenge.id} 
                className="challenge-card"
                onClick={() => navigate(`/challenge/${challenge.id}`)}
              >
                <div className="challenge-image">
                  <img src={challenge.image} alt={challenge.title} />
                  <div className="challenge-overlay">
                    <span className="challenge-description">{challenge.description}</span>
                  </div>
                </div>
                <div className="challenge-info">
                  <h3>{challenge.title}</h3>
                  <div className="challenge-stats">
                    <div className="stat-item">
                      <i className="bi bi-person"></i>
                      <span>{challenge.chefCount}</span>
                    </div>
                    <div className="stat-item">
                      <i className="bi bi-egg-fried"></i>
                      <span>{challenge.dishCount}</span>
                    </div>
                    <div className="stat-item">
                      <i className="bi bi-clock"></i>
                      <span>{challenge.timeLeft}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredChallenges.length === 0 && (
            <div className="no-challenges">
              <p>Không tìm thấy thử thách phù hợp.</p>
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default Challenge;
