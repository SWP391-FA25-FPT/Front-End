import React from "react";
import Layout from "../components/layout/AppLayout";
import ProfileForm from "../components/User/ProfileForm"; 
import "./style/ProfilePage.css"; 

const ProfilePage = () => {
  return (
    <Layout>
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
    </Layout>
  );
};

export default ProfilePage;
