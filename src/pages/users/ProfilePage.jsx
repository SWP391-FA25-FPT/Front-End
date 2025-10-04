import React from "react";
import ProfileForm from "../../components/users/ProfileForm"; 
import "../style/ProfilePage.css"; 

const ProfilePage = () => {
  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <ProfileForm />
    </div>
  );
};

export default ProfilePage;
