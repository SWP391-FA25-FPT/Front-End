import apiHelper from "../utils/apiHelper";

export const calculateNutrition = async (ingredients = []) => {
  return await apiHelper.post("/api/nutrition/calc", { ingredients });
};

export default {
  calculateNutrition,
};


