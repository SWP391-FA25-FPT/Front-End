import React, { useState, useMemo } from "react";
import { Row, Col, Empty } from "antd";
import AppLayout from "../components/layout/AppLayout";
import PageHeader from "../components/Challenge/PageHeader";
import StatsOverview from "../components/Challenge/StatsOverview";
import FilterBar from "../components/Challenge/FilterBar";
import ChallengeCard from "../components/Challenge/ChallengeCard";
import challengesData from "../data/challenges.json";
import "./style/Challenge.css";

const Challenge = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");

  // Filter challenges
  const filteredChallenges = useMemo(() => {
    let filtered = [...challengesData.challenges];

    // Filter by search
    if (search) {
      filtered = filtered.filter(
        (challenge) =>
          challenge.title.toLowerCase().includes(search.toLowerCase()) ||
          challenge.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by status
    if (status !== "all") {
      filtered = filtered.filter((challenge) => challenge.status === status);
    }

    // Filter by category
    if (category !== "all") {
      filtered = filtered.filter(
        (challenge) => challenge.category === category
      );
    }

    return filtered;
  }, [search, status, category]);

  return (
    <AppLayout>
      <div className="challenge-page-container">
        <PageHeader />

        <StatsOverview stats={challengesData.stats} />

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
            {filteredChallenges.length} Thử thách{" "}
            {status === "all"
              ? ""
              : status === "ongoing"
              ? "đang diễn ra"
              : status === "upcoming"
              ? "sắp diễn ra"
              : "đã kết thúc"}
          </h2>

          {filteredChallenges.length > 0 ? (
            <Row gutter={[24, 24]}>
              {filteredChallenges.map((challenge) => (
                <Col xs={24} sm={12} lg={8} xl={6} key={challenge.id}>
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
