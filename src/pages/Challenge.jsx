import React, { useState, useEffect } from "react";
import { Row, Col, Empty, Spin, message } from "antd";
import AppLayout from "../components/layout/AppLayout";
import PageHeader from "../components/Challenge/PageHeader";
import FilterBar from "../components/Challenge/FilterBar";
import ChallengeCard from "../components/Challenge/ChallengeCard";
import { getAllChallenges } from "../apis/challenge";
import "./style/Challenge.css";

const Challenge = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch challenges
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch challenges with filters
        const params = {};
        if (search) params.search = search;
        if (status !== "all") params.status = status;
        if (category !== "all") params.category = category;

        const challengesResponse = await getAllChallenges(params);

        if (challengesResponse.success) {
          setChallenges(challengesResponse.data || []);
        }
      } catch (err) {
        console.error("Error fetching challenges:", err);
        setError(err.message || "Lỗi khi tải dữ liệu thử thách");
        message.error(err.message || "Lỗi khi tải dữ liệu thử thách");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, status, category]);

  if (loading) {
    return (
      <AppLayout>
        <div className="challenge-page-container">
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <Spin size="large" />
            <p style={{ marginTop: "16px" }}>Đang tải dữ liệu...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="challenge-page-container">
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <p style={{ color: "#ff4d4f" }}>{error}</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="challenge-page-container">
        <PageHeader />

        <FilterBar
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          category={category}
          setCategory={setCategory}
        />

        <div className="challenges-section">
          <h2 className="section-title">
            {challenges.length} Thử thách{" "}
            {status === "all"
              ? ""
              : status === "ongoing"
              ? "đang diễn ra"
              : status === "upcoming"
              ? "sắp diễn ra"
              : "đã kết thúc"}
          </h2>

          {challenges.length > 0 ? (
            <Row gutter={[24, 24]}>
              {challenges.map((challenge) => (
                <Col xs={24} sm={12} lg={8} xl={6} key={challenge._id}>
                  <ChallengeCard challenge={challenge} />
                </Col>
              ))}
            </Row>
          ) : (
            <Empty
              description="Không tìm thấy thử thách nào phù hợp"
              style={{ marginTop: "48px" }}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Challenge;
