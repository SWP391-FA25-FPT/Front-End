import React, { useState, useEffect, useCallback } from "react";
import { Card, Rate, Button, message, Statistic, Row, Col, Progress } from "antd";
import { Icon } from "@iconify/react";
import { useAuth } from "../../context/useAuth";
import {
  getRatingsByRecipeId,
  createOrUpdateRating,
  deleteUserRating,
} from "../../apis/rating";
import "./Recipe.css";

const RecipeRating = ({ recipeId, onRatingUpdate }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ratingData, setRatingData] = useState({
    averageRating: 0,
    totalRatings: 0,
    userRating: null,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [hoverValue, setHoverValue] = useState(0);

  const fetchRatings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getRatingsByRecipeId(recipeId);
      const parsedData = response?.data ?? response;
      setRatingData(parsedData);
      setHoverValue(0);
      if (onRatingUpdate) {
        onRatingUpdate(parsedData);
      }
    } catch (error) {
      console.error("Fetch ratings error:", error);
      message.error(error.message || "Lỗi khi tải đánh giá");
    } finally {
      setLoading(false);
    }
  }, [recipeId, onRatingUpdate]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  const handleRatingChange = async (value) => {
    if (!value || value < 1 || value > 5) {
      message.warning("Vui lòng chọn mức từ 1 đến 5 sao");
      return;
    }
    if (!user) {
      message.warning("Vui lòng đăng nhập để đánh giá");
      return;
    }

    try {
      setSubmitting(true);
      const response = await createOrUpdateRating(recipeId, value);
      message.success(
        response.message ||
          (ratingData.userRating ? "Cập nhật đánh giá thành công" : "Đánh giá thành công")
      );
      await fetchRatings();
    } catch (error) {
      console.error("Rating error:", error);
      message.error(error.message || "Lỗi khi đánh giá");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClearRating = async () => {
    if (!ratingData.userRating) return;

    try {
      setSubmitting(true);
      const response = await deleteUserRating(recipeId);
      message.success(response.message || "Xóa đánh giá thành công");
      await fetchRatings();
    } catch (error) {
      console.error("Clear rating error:", error);
      message.error(error.message || "Lỗi khi xóa đánh giá");
    } finally {
      setSubmitting(false);
    }
  };

  const calculatePercentage = (count) => {
    if (ratingData.totalRatings === 0) return 0;
    return Math.round((count / ratingData.totalRatings) * 100);
  };

  return (
    <Card title="Đánh giá" style={{ marginBottom: "24px" }} loading={loading}>
      <Row gutter={[24, 24]}>
        {/* Left: Overall Rating */}
        <Col xs={24} md={10}>
          <div style={{ textAlign: "center" }}>
            <Statistic
              title="Đánh giá trung bình"
              value={ratingData.averageRating}
              precision={1}
              suffix="/ 5"
              valueStyle={{ fontSize: "48px", color: "#faad14" }}
            />
            <Rate
              disabled
              allowHalf
              value={ratingData.averageRating}
              style={{ fontSize: "24px", marginTop: "8px" }}
            />
            <div style={{ marginTop: "8px", color: "#999" }}>
              {ratingData.totalRatings} đánh giá
            </div>
          </div>
        </Col>

        {/* Right: Rating Distribution */}
        <Col xs={24} md={14}>
          <div>
            {[5, 4, 3, 2, 1].map((star) => (
              <div
                key={star}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <span style={{ width: "40px", textAlign: "right", marginRight: "8px" }}>
                  {star} <Icon icon="mdi:star" width="14" color="#faad14" />
                </span>
                <Progress
                  percent={calculatePercentage(ratingData.ratingDistribution[star])}
                  showInfo={false}
                  strokeColor="#faad14"
                  style={{ flex: 1, marginRight: "8px" }}
                />
                <span style={{ width: "40px", color: "#999" }}>
                  {ratingData.ratingDistribution[star]}
                </span>
              </div>
            ))}
          </div>
        </Col>
      </Row>

      {/* User Rating Section */}
      {user && (
        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            background: "#fafafa",
            borderRadius: "8px",
          }}
        >
          <div style={{ marginBottom: "12px" }}>
            <strong>Đánh giá của bạn:</strong>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Rate
              value={ratingData.userRating || hoverValue}
              onChange={handleRatingChange}
              onHoverChange={setHoverValue}
              allowClear={false}
              disabled={submitting}
              style={{ fontSize: "28px" }}
            />
            {ratingData.userRating && (
              <Button
                size="small"
                danger
                onClick={handleClearRating}
                loading={submitting}
                icon={<Icon icon="mdi:close" />}
              >
                Xóa đánh giá
              </Button>
            )}
          </div>
          {hoverValue > 0 && !ratingData.userRating && (
            <div style={{ marginTop: "8px", color: "#999" }}>
              {hoverValue === 1 && "Rất tệ"}
              {hoverValue === 2 && "Tệ"}
              {hoverValue === 3 && "Bình thường"}
              {hoverValue === 4 && "Tốt"}
              {hoverValue === 5 && "Tuyệt vời"}
            </div>
          )}
        </div>
      )}

      {!user && (
        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            background: "#f5f5f5",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          Vui lòng đăng nhập để đánh giá công thức này
        </div>
      )}
    </Card>
  );
};

export default RecipeRating;

