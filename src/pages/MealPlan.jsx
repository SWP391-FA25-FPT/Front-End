import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { styles } from './style/styles'
import Header from './component/Header'
import MealSection from './component/MealSection'
import TotalsFooter from './component/TotalsFooter'
import { DEFAULT_MEALS } from './data/mealData'


function multiplyByGrams(baseValue, grams) {
  return (baseValue * grams) / 100;
}

export default function MealPlan() {
  const [meals, setMeals] = useState(DEFAULT_MEALS);
  const navigate = useNavigate();

  const totals = useMemo(() => {
    let cals = 0, proteins = 0, carbs = 0, fats = 0;
    meals.forEach((meal) => {
      meal.items.forEach((it) => {
        const ratio = it.grams / 100;
        cals += it.cals * ratio;
        proteins += it.proteins * ratio;
        carbs += it.carbs * ratio;
        fats += it.fats * ratio;
      });
    });
    return {
      cals: Math.round(cals),
      proteins: Math.round(proteins),
      carbs: Math.round(carbs),
      fats: Math.round(fats),
    };
  }, [meals]);

  function updateGrams(mealIndex, itemIndex, grams) {
    setMeals((prev) => {
      const next = [...prev];
      const meal = { ...next[mealIndex] };
      const items = [...meal.items];
      items[itemIndex] = { ...items[itemIndex], grams };
      meal.items = items;
      next[mealIndex] = meal;
      return next;
    });
  }

  function generatePlan() {
    // Simple randomization of grams for demo purposes
    setMeals((prev) => prev.map((m) => ({
      ...m,
      items: m.items.map((it) => ({
        ...it,
        grams: Math.max(20, Math.min(300, Math.round(it.grams * (0.7 + Math.random() * 0.8))))
      }))
    })));
  }

  function deletePlan() {
    setMeals([]);
  }

  function resetPlan() {
    setMeals(DEFAULT_MEALS);
  }

  return (
    <div style={styles.page}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ padding: '0.5rem 1rem', background: '#f97316', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          ← Back
        </button>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Meal Plan</h2>
      </div>
      <Header onGenerate={generatePlan} onDelete={deletePlan} onReset={resetPlan} />

      {meals.length === 0 ? (
        <div style={styles.empty}>No meals. Click "Generate Meal Plan" or "Reset".</div>
      ) : (
        <div style={styles.stack}>
          {meals.map((meal, mi) => (
            <MealSection
              key={meal.name}
              meal={meal}
              onUpdateItem={(ii, grams) => updateGrams(mi, ii, grams)}
            />
          ))}
        </div>
      )}

      <TotalsFooter totals={totals} />
    </div>
  );
}
 
