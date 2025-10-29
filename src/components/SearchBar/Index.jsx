import React, { useState, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Form, Input } from "antd";
import { trackSearch } from "../../apis/analytics";

const Index = ({ onSearch, autoNavigate = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState("");
  const debounceTimerRef = useRef(null);

  // Hàm xử lý search chính
  const performSearch = useCallback((keyword) => {
    const trimmedKeyword = keyword.trim();
    
    if (trimmedKeyword.length === 0) return;
    
    // Track search keyword
    trackSearch(trimmedKeyword);
    
    // Ưu tiên: Custom callback nếu có
    if (onSearch) {
      onSearch(trimmedKeyword);
      return;
    }
    
    // Mặc định: Auto navigate đến trang search
    if (autoNavigate) {
      // Nếu đang ở trang search, update URL query
      if (location.pathname === '/search') {
        navigate(`/search?q=${encodeURIComponent(trimmedKeyword)}`, { replace: true });
      } else {
        // Nếu ở trang khác, navigate đến trang search
        navigate(`/search?q=${encodeURIComponent(trimmedKeyword)}`);
      }
    }
  }, [onSearch, autoNavigate, navigate, location]);

  // Debounce function để tránh gọi API quá nhiều khi typing
  const debounceSearch = useCallback((value) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (value && value.trim().length > 0) {
        // Chỉ track, không search ngay khi typing
        trackSearch(value.trim());
      }
    }, 800); // Đợi 800ms sau khi user ngừng gõ
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    // Chỉ debounce track, không search
    debounceSearch(value);
  };

  const handlePressEnter = (e) => {
    const value = e.target.value;
    
    // Clear debounce timer khi Enter
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Execute search immediately
    performSearch(value);
  };

  return (
    <React.Fragment>
      <Form name="search">
        <Input
          prefix={
            <Icon
              icon="mdi:magnify"
              width="24"
              height="24"
              className="text-yellow-400"
            />
          }
          placeholder="Tìm kiếm món ăn, thực đơn, công thức..."
          style={{ borderRadius: "16px", width: "400px", height: "40px" }}
          value={searchValue}
          onChange={handleChange}
          onPressEnter={handlePressEnter}
        />
      </Form>
    </React.Fragment>
  );
};

export default Index;

