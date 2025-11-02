import React, { useState } from "react";
import { Row, Col, message } from "antd";
import AppLayout from "../components/layout/AppLayout";
import RecipeHeader from "../components/Recipe/RecipeHeader";
import RecipeInfoForm from "../components/Recipe/RecipeInfoForm";
import RecipeStepsForm from "../components/Recipe/RecipeStepsForm";
import RecipeActions from "../components/Recipe/RecipeActions";
import RecipeSuccessModal from "../components/Recipe/RecipeSuccessModal";
import "./style/CreateRecipe.css";

const CreateRecipe = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);
  const [steps, setSteps] = useState([{ description: "", image: null }]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) {
      message.error("Vui lòng nhập tên món ăn!");
      return;
    }
    message.success("Công thức đã được lưu!");
    setIsModalOpen(true);
  };

  return (
    <AppLayout>
      <div className="create-recipe-container">
        <RecipeHeader />
        <Row gutter={[32, 32]}>
          <Col xs={24} lg={12}>
            <RecipeInfoForm
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              ingredients={ingredients}
              setIngredients={setIngredients}
            />
          </Col>
          <Col xs={24} lg={12}>
            <RecipeStepsForm steps={steps} setSteps={setSteps} />
          </Col>
        </Row>
        <RecipeActions onSubmit={handleSubmit} />
      </div>
      <RecipeSuccessModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </AppLayout>
  );
};

export default CreateRecipe;
