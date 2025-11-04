import React, { useState, useEffect } from "react";
import { Card, Input, Button, List, Avatar, message, Spin, Empty } from "antd";
import { Icon } from "@iconify/react";
import { useAuth } from "../../context/useAuth";
import {
  getCommentsByRecipeId,
  createComment,
  deleteComment,
} from "../../apis/comment";
import "./Recipe.css";

const { TextArea } = Input;

const RecipeComments = ({ recipeId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  useEffect(() => {
    fetchComments();
  }, [recipeId, pagination.page]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await getCommentsByRecipeId(recipeId, {
        page: pagination.page,
        limit: pagination.limit,
      });
      setComments(response.data);
      setPagination({
        ...pagination,
        total: response.pagination.total,
      });
    } catch (error) {
      console.error("Fetch comments error:", error);
      message.error(error.message || "Lỗi khi tải bình luận");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!user) {
      message.warning("Vui lòng đăng nhập để bình luận");
      return;
    }

    if (!commentText.trim()) {
      message.warning("Vui lòng nhập nội dung bình luận");
      return;
    }

    try {
      setSubmitting(true);
      const response = await createComment(recipeId, commentText.trim());
      message.success("Bình luận thành công");
      setCommentText("");
      // Add new comment to the beginning of the list
      setComments([response.data, ...comments]);
      setPagination({
        ...pagination,
        total: pagination.total + 1,
      });
    } catch (error) {
      console.error("Create comment error:", error);
      message.error(error.message || "Lỗi khi tạo bình luận");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      message.success("Xóa bình luận thành công");
      setComments(comments.filter((c) => c._id !== commentId));
      setPagination({
        ...pagination,
        total: pagination.total - 1,
      });
    } catch (error) {
      console.error("Delete comment error:", error);
      message.error(error.message || "Lỗi khi xóa bình luận");
    }
  };

  const loadMoreComments = () => {
    setPagination({
      ...pagination,
      page: pagination.page + 1,
    });
  };

  const canDelete = (comment) => {
    if (!user) return false;
    return comment.userId._id === user._id || user.role === "admin";
  };

  return (
    <Card title="Bình luận" style={{ marginBottom: "24px" }}>
      {/* Comment Input */}
      {user ? (
        <div style={{ marginBottom: "24px" }}>
          <TextArea
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Viết bình luận của bạn..."
            maxLength={500}
            showCount
          />
          <Button
            type="primary"
            onClick={handleSubmitComment}
            loading={submitting}
            style={{ marginTop: "12px" }}
            icon={<Icon icon="mdi:send" width="18" />}
          >
            Gửi bình luận
          </Button>
        </div>
      ) : (
        <div style={{ marginBottom: "24px", padding: "16px", background: "#f5f5f5", borderRadius: "8px" }}>
          Vui lòng đăng nhập để bình luận
        </div>
      )}

      {/* Comments List */}
      <Spin spinning={loading}>
        {comments.length === 0 ? (
          <Empty description="Chưa có bình luận nào" />
        ) : (
          <>
            <List
              itemLayout="horizontal"
              dataSource={comments}
              renderItem={(comment) => (
                <List.Item
                  key={comment._id}
                  actions={
                    canDelete(comment)
                      ? [
                          <Button
                            type="link"
                            danger
                            size="small"
                            onClick={() => handleDeleteComment(comment._id)}
                            icon={<Icon icon="mdi:delete" />}
                          >
                            Xóa
                          </Button>,
                        ]
                      : []
                  }
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={<Icon icon="mdi:account-circle" width="32" />}
                        style={{ backgroundColor: "#1890ff" }}
                      />
                    }
                    title={
                      <div>
                        <strong>{comment.userId?.name || comment.userId?.email || "Người dùng"}</strong>
                        <span style={{ marginLeft: "12px", fontSize: "12px", color: "#999" }}>
                          {new Date(comment.createdAt).toLocaleString("vi-VN")}
                        </span>
                      </div>
                    }
                    description={
                      <div style={{ fontSize: "14px", marginTop: "8px" }}>
                        {comment.text}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
            {pagination.total > comments.length && (
              <div style={{ textAlign: "center", marginTop: "16px" }}>
                <Button onClick={loadMoreComments} loading={loading}>
                  Xem thêm bình luận
                </Button>
              </div>
            )}
          </>
        )}
      </Spin>
    </Card>
  );
};

export default RecipeComments;

