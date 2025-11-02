import React, { useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import IngredientItem from "./IngredientItem";
import IngredientAddButtons from "./IngredientAddButtons";

const IngredientsForm = ({
  ingredients,
  onIngredientsChange,
  onAddIngredient,
  onAddSection,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Generate stable IDs for each ingredient
  // Use index as ID for simplicity - it works as long as we don't reorder before drag ends
  const ingredientsWithIds = useMemo(() => {
    return ingredients.map((ing, index) => ({
      ...ing,
      _id: `ingredient-${index}`,
    }));
  }, [ingredients]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = ingredientsWithIds.findIndex(
        (ing) => ing._id === active.id
      );
      const newIndex = ingredientsWithIds.findIndex(
        (ing) => ing._id === over.id
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const newIngredients = arrayMove(ingredientsWithIds, oldIndex, newIndex);
        // Remove _id before updating (don't save it to backend)
        const cleanedIngredients = newIngredients.map(({  ...rest }) => rest);
        onIngredientsChange(cleanedIngredients);
      }
    }
  };

  const handleUpdate = (id, value) => {
    const index = ingredientsWithIds.findIndex((ing) => ing._id === id);
    if (index !== -1) {
      const newIngredients = [...ingredients];
      newIngredients[index] = { ...newIngredients[index], text: value };
      onIngredientsChange(newIngredients);
    }
  };

  const handleRemove = (id) => {
    const index = ingredientsWithIds.findIndex((ing) => ing._id === id);
    if (index !== -1 && ingredients.length > 1) {
      const newIngredients = ingredients.filter((_, i) => i !== index);
      onIngredientsChange(newIngredients);
    }
  };

  const ingredientIds = ingredientsWithIds.map((ing) => ing._id);

  return (
    <div className="ingredients-form-container">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={ingredientIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="ingredients-list">
            {ingredientsWithIds.map((ingredient, index) => (
              <IngredientItem
                key={ingredient._id}
                id={ingredient._id}
                ingredient={ingredient}
                index={index}
                onUpdate={handleUpdate}
                onRemove={handleRemove}
                disabled={ingredients.length === 1}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <IngredientAddButtons
        onAddIngredient={onAddIngredient}
        onAddSection={onAddSection}
      />
    </div>
  );
};

export default IngredientsForm;

