import { getActiveGoal } from "../apis/goal";
// import { getProfile } from "../apis/user";

/**
 * Get personalized context for AI based on user profile and goals
 */
export const getPersonalizedContext = async (user) => {
  if (!user) {
    return null;
  }

  try {
    const context = {
      profile: user.profile || {},
      hasProfile: false,
      activeGoal: null,
      hasGoal: false,
    };

    // Check if user has complete profile
    const profile = user.profile || {};
    context.hasProfile = !!(
      profile.weight &&
      profile.height &&
      profile.age &&
      profile.gender &&
      profile.workHabits
    );

    // Try to get active goal
    try {
      const goalRes = await getActiveGoal();
      if (goalRes.success && goalRes.data) {
        context.activeGoal = goalRes.data;
        context.hasGoal = true;
      }
    } catch {
      // No active goal, that's okay
      console.log("No active goal found");
    }

    return context;
  } catch (error) {
    console.error("Error getting personalized context:", error);
    return null;
  }
};

/**
 * Format nutrition data for display
 */
export const formatNutritionData = (data) => {
  if (!data) return null;

  return {
    calories: data.calories ? `${Math.round(data.calories)} kcal` : "N/A",
    protein: data.protein ? `${Math.round(data.protein)}g` : "N/A",
    carbs: data.carbs ? `${Math.round(data.carbs)}g` : "N/A",
    fat: data.fat ? `${Math.round(data.fat)}g` : "N/A",
    fiber: data.fiber ? `${Math.round(data.fiber)}g` : null,
    sugar: data.sugar ? `${Math.round(data.sugar)}g` : null,
  };
};

/**
 * Format progress data for display
 */
export const formatProgressData = (progress) => {
  if (!progress) return null;

  const percentage =
    progress.targetWeight && progress.currentWeight
      ? Math.round(
          ((progress.currentWeight - progress.startWeight) /
            (progress.targetWeight - progress.startWeight)) *
            100
        )
      : 0;

  return {
    currentWeight: progress.currentWeight
      ? `${progress.currentWeight} kg`
      : "N/A",
    targetWeight: progress.targetWeight ? `${progress.targetWeight} kg` : "N/A",
    startWeight: progress.startWeight ? `${progress.startWeight} kg` : "N/A",
    progress: `${percentage}%`,
    weightChange:
      progress.currentWeight && progress.startWeight
        ? `${(progress.currentWeight - progress.startWeight).toFixed(1)} kg`
        : "N/A",
  };
};

/**
 * Explain nutrition terms
 */
export const explainNutritionTerm = (term) => {
  const explanations = {
    BMR: "Tỷ lệ trao đổi chất cơ bản (BMR) là lượng calo cơ thể bạn đốt cháy khi nghỉ ngơi hoàn toàn.",
    TDEE: "Tổng năng lượng tiêu hao hàng ngày (TDEE) là tổng số calo bạn đốt cháy trong một ngày, bao gồm cả hoạt động thể chất.",
    Macro:
      "Macronutrients (Đại chất dinh dưỡng) bao gồm protein, carbs và fat - ba thành phần chính của chế độ ăn.",
    Protein:
      "Protein giúp xây dựng và sửa chữa cơ bắp, tăng cảm giác no và hỗ trợ trao đổi chất.",
    Carbs: "Carbohydrates cung cấp năng lượng chính cho cơ thể và não bộ.",
    Fat: "Chất béo lành mạnh cần thiết cho hấp thụ vitamin, sản xuất hormone và sức khỏe não bộ.",
    Calorie: "Calorie là đơn vị đo năng lượng. 1 kcal = 1000 cal.",
  };

  return explanations[term] || `Không có giải thích cho thuật ngữ "${term}"`;
};

/**
 * Generate personalized quick actions based on user context
 */
export const generatePersonalizedQuickActions = (context) => {
  const baseActions = [
    {
      icon: "📸",
      title: "Phân tích ảnh món ăn",
      desc: "Tải ảnh để phân tích dinh dưỡng",
      prompt:
        "Tôi muốn biết cách phân tích dinh dưỡng của món ăn từ ảnh. Bạn có thể hướng dẫn tôi không?",
    },
  ];

  if (!context) {
    return [
      ...baseActions,
      {
        icon: "📝",
        title: "Tạo thực đơn",
        desc: "Lên thực đơn theo nhu cầu",
        prompt:
          "Tôi muốn tạo thực đơn ăn uống lành mạnh cho 1 tuần. Bạn có thể giúp tôi không?",
      },
      {
        icon: "💚",
        title: "Tư vấn sức khỏe",
        desc: "Lời khuyên dinh dưỡng cá nhân",
        prompt:
          "Tôi muốn có lời khuyên về chế độ ăn uống để cải thiện sức khỏe. Bạn có thể tư vấn cho tôi không?",
      },
    ];
  }

  const personalizedActions = [...baseActions];

  // If user has allergies, suggest allergy-friendly recipes
  if (context.profile?.allergies && context.profile.allergies.length > 0) {
    personalizedActions.push({
      icon: "🚫",
      title: "Món ăn phù hợp dị ứng",
      desc: `Tìm món không chứa ${context.profile.allergies.join(", ")}`,
      prompt: `Tôi bị dị ứng với ${context.profile.allergies.join(
        ", "
      )}. Bạn có thể gợi ý món ăn phù hợp không?`,
    });
  }

  // If user has active goal
  if (context.hasGoal && context.activeGoal) {
    const goalType = context.activeGoal.goalType;
    if (goalType === "weight_loss") {
      personalizedActions.push({
        icon: "📉",
        title: "Thực đơn giảm cân",
        desc: "Thực đơn phù hợp mục tiêu giảm cân",
        prompt: `Tôi đang muốn giảm cân từ ${context.activeGoal.startWeight}kg xuống ${context.activeGoal.targetWeight}kg. Bạn có thể tạo thực đơn giúp tôi không?`,
      });
    } else if (goalType === "weight_gain") {
      personalizedActions.push({
        icon: "📈",
        title: "Thực đơn tăng cân",
        desc: "Thực đơn phù hợp mục tiêu tăng cân",
        prompt: `Tôi đang muốn tăng cân từ ${context.activeGoal.startWeight}kg lên ${context.activeGoal.targetWeight}kg. Bạn có thể tạo thực đơn giúp tôi không?`,
      });
    } else {
      personalizedActions.push({
        icon: "⚖️",
        title: "Thực đơn duy trì cân nặng",
        desc: "Thực đơn phù hợp mục tiêu duy trì",
        prompt: `Tôi muốn duy trì cân nặng hiện tại. Bạn có thể tạo thực đơn giúp tôi không?`,
      });
    }
  } else {
    // If no goal, suggest creating one
    personalizedActions.push({
      icon: "🎯",
      title: "Tạo mục tiêu dinh dưỡng",
      desc: "Đặt mục tiêu và theo dõi tiến độ",
      prompt:
        "Tôi muốn tạo mục tiêu dinh dưỡng. Bạn có thể hướng dẫn tôi không?",
    });
  }

  // If user has diet preference
  if (context.profile?.diet && context.profile.diet !== "none") {
    const dietNames = {
      vegan: "Thuần chay",
      vegetarian: "Chay",
      keto: "Keto",
      paleo: "Paleo",
      "gluten-free": "Không gluten",
    };
    personalizedActions.push({
      icon: "🥗",
      title: `Thực đơn ${dietNames[context.profile.diet]}`,
      desc: `Món ăn phù hợp chế độ ${dietNames[context.profile.diet]}`,
      prompt: `Tôi đang theo chế độ ăn ${
        dietNames[context.profile.diet]
      }. Bạn có thể gợi ý thực đơn phù hợp không?`,
    });
  }

  // Add general menu creation if not already added
  if (!personalizedActions.find((a) => a.title === "Tạo thực đơn")) {
    personalizedActions.push({
      icon: "📝",
      title: "Tạo thực đơn",
      desc: "Lên thực đơn theo nhu cầu",
      prompt:
        "Tôi muốn tạo thực đơn ăn uống lành mạnh cho 1 tuần. Bạn có thể giúp tôi không?",
    });
  }

  return personalizedActions;
};

/**
 * Detect intent from user message
 */
export const detectIntent = (message) => {
  const lowerMessage = message.toLowerCase();
  const intents = [];

  if (
    lowerMessage.includes("thực đơn") ||
    lowerMessage.includes("meal plan") ||
    lowerMessage.includes("menu")
  ) {
    intents.push("meal_plan");
  }

  if (
    lowerMessage.includes("tiến độ") ||
    lowerMessage.includes("progress") ||
    lowerMessage.includes("theo dõi")
  ) {
    intents.push("progress");
  }

  if (
    lowerMessage.includes("món ăn") ||
    lowerMessage.includes("recipe") ||
    lowerMessage.includes("công thức")
  ) {
    intents.push("recipe");
  }

  if (
    lowerMessage.includes("mục tiêu") ||
    lowerMessage.includes("goal") ||
    lowerMessage.includes("target")
  ) {
    intents.push("goal");
  }

  if (
    lowerMessage.includes("dinh dưỡng") ||
    lowerMessage.includes("nutrition") ||
    lowerMessage.includes("calo") ||
    lowerMessage.includes("calorie")
  ) {
    intents.push("nutrition");
  }

  if (
    lowerMessage.includes("giảm cân") ||
    lowerMessage.includes("tăng cân") ||
    lowerMessage.includes("weight")
  ) {
    intents.push("weight_management");
  }

  return intents;
};

/**
 * Generate suggested actions based on intent
 */
export const generateSuggestedActions = (intents) => {
  const actions = [];

  if (intents.includes("meal_plan")) {
    actions.push({
      label: "Tạo Meal Plan",
      path: "/mealplan",
      icon: "📝",
    });
  }

  if (intents.includes("progress")) {
    actions.push({
      label: "Xem Progress Tracking",
      path: "/progress",
      icon: "📊",
    });
  }

  if (intents.includes("recipe")) {
    actions.push({
      label: "Tìm Recipe",
      path: "/recipes",
      icon: "🍳",
    });
  }

  if (intents.includes("goal")) {
    actions.push({
      label: "Quản lý Mục tiêu",
      path: "/goals",
      icon: "🎯",
    });
  }

  if (intents.includes("nutrition")) {
    actions.push({
      label: "Phân tích Dinh dưỡng",
      path: "/nutrition",
      icon: "🥗",
    });
  }

  return actions;
};

/**
 * Extract structured data from AI response
 */
export const extractStructuredData = (content) => {
  // Try to find JSON in the response
  const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1]);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
    }
  }

  // Try to find table-like structures
  const tableMatch = content.match(/\|.*\|/);
  if (tableMatch) {
    return { type: "table", content: content };
  }

  return null;
};
