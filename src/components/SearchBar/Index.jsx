import React, { useState, useCallback, useRef } from "react";
import { Icon } from "@iconify/react";
import { Form, Input } from "antd";
import { trackSearch } from "../../apis/analytics";

const Index = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState("");
  const debounceTimerRef = useRef(null);

  // Debounce function để tránh gọi API quá nhiều
  const debounceTrackSearch = useCallback((value) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (value && value.trim().length > 0) {
        // Track search keyword
        trackSearch(value.trim());
        
        // Callback để parent component xử lý search
        if (onSearch) {
          onSearch(value.trim());
        }
      }
    }, 800); // Đợi 800ms sau khi user ngừng gõ
  }, [onSearch]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    debounceTrackSearch(value);
  };

  const handlePressEnter = (e) => {
    const value = e.target.value;
    if (value && value.trim().length > 0) {
      // Clear debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      // Track immediately
      trackSearch(value.trim());
      
      // Execute search
      if (onSearch) {
        onSearch(value.trim());
      }
    }
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
