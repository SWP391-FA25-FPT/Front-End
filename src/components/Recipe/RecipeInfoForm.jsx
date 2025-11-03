import React from "react";
import { Form, Input, Button, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;

export default function RecipeInfoForm({
  title,
  setTitle,
  description,
  setDescription,
  ingredients,
  setIngredients,
}) {
  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "" }]);
  };

  return (
    <div className="recipe-section">
      <h3 className="section-title">Thông tin món ăn</h3>
      <Form layout="vertical">
        <Form.Item label="Tên món ăn" required>
          <Input
            placeholder="Nhập tên món..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Mô tả ngắn gọn">
          <TextArea
            rows={3}
            placeholder="Giới thiệu ngắn về món ăn..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>

        <h4 className="sub-section">Nguyên liệu</h4>
        {ingredients.map((ing, index) => (
          <Row gutter={8} key={index}>
            <Col span={14}>
              <Input
                placeholder="Tên nguyên liệu"
                value={ing.name}
                onChange={(e) => {
                  const newIngs = [...ingredients];
                  newIngs[index].name = e.target.value;
                  setIngredients(newIngs);
                }}
              />
            </Col>
            <Col span={10}>
              <Input
                placeholder="Số lượng (vd: 200g, 2 quả...)"
                value={ing.quantity}
                onChange={(e) => {
                  const newIngs = [...ingredients];
                  newIngs[index].quantity = e.target.value;
                  setIngredients(newIngs);
                }}
              />
            </Col>
          </Row>
        ))}

        <Button
          icon={<PlusOutlined />}
          onClick={handleAddIngredient}
          className="add-btn"
        >
          Thêm nguyên liệu
        </Button>
      </Form>
    </div>
  );
}
