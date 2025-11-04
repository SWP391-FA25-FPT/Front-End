import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Input, Button } from "antd";
import { Icon } from "@iconify/react";
import "./Recipe.css";

const IngredientItem = ({
  id,
  ingredient,
  index,
  onUpdate,
  onRemove,
  disabled,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleChange = (e) => {
    onUpdate(id, e.target.value);
  };

  const handleRemoveClick = () => {
    if (!disabled) {
      onRemove(id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`ingredient-item ${isDragging ? "dragging" : ""}`}
    >
      <div className="ingredient-item-content">
        <div
          className="ingredient-drag-handle"
          {...attributes}
          {...listeners}
        >
          <Icon icon="mdi:drag" width={20} height={20} />
        </div>
        <Input
          value={ingredient.text || ""}
          onChange={handleChange}
          placeholder={`Nguyên liệu ${index + 1}`}
          className="ingredient-input"
        />
        <Button
          type="text"
          danger
          icon={<Icon icon="mdi:delete" width={18} height={18} />}
          onClick={handleRemoveClick}
          disabled={disabled}
          className="ingredient-remove-btn"
        />
      </div>
    </div>
  );
};

export default IngredientItem;

