/**
 * Convert nutrition data from backend format to frontend format
 * Backend format: { ENERC_KCAL, PROCNT, FAT, CHOCDF, FIBTG, SUGAR }
 * Frontend format: { calories, protein, carbs, fat, fiber, sugar }
 */
export function convertNutritionFormat(backendNutrition) {
  if (!backendNutrition || typeof backendNutrition !== "object") {
    return null;
  }

  const converted = {
    calories: Math.round(backendNutrition.ENERC_KCAL || 0),
    protein: Math.round((backendNutrition.PROCNT || 0) * 10) / 10, // Round to 1 decimal
    carbs: Math.round((backendNutrition.CHOCDF || 0) * 10) / 10,
    fat: Math.round((backendNutrition.FAT || 0) * 10) / 10,
    fiber: Math.round((backendNutrition.FIBTG || 0) * 10) / 10,
    sugar: Math.round((backendNutrition.SUGAR || 0) * 10) / 10,
  };

  // Return null if all values are 0 or undefined
  const hasAnyValue = Object.values(converted).some(val => val > 0);
  return hasAnyValue ? converted : null;
}

/**
 * Extract text from ingredients array
 * Input: [{ text: "250g bột" }, { text: "100ml nước" }]
 * Output: ["250g bột", "100ml nước"]
 */
export function getIngredientTexts(ingredients) {
  if (!Array.isArray(ingredients)) {
    return [];
  }

  return ingredients
    .map(ing => {
      // Support both { text: "..." } and { name: "...", amount: "..." } formats
      if (ing.text) {
        return ing.text.trim();
      }
      if (ing.name || ing.amount) {
        const parts = [ing.amount, ing.name].filter(Boolean);
        return parts.join(" ").trim();
      }
      return "";
    })
    .filter(text => text.length > 0);
}

