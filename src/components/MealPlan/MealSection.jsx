import { styles } from '../../pages/style/styles'
import MealRow from './MealRow'

export default function MealSection({ meal, onUpdateItem }) {
  return (
    <section style={styles.card}>
      <div style={styles.mealHeader}>
        <h3 style={styles.mealTitle}>{meal.name}</h3>
      </div>
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.thLeft}>Foods</th>
              <th style={styles.th}>Qte (g)</th>
              <th style={styles.th}>Cals</th>
              <th style={styles.th}>Proteins (g)</th>
              <th style={styles.th}>Carbs (g)</th>
              <th style={styles.th}>Fats (g)</th>
            </tr>
          </thead>
          <tbody>
            {meal.items.map((it, ii) => (
              <MealRow
                key={it.food}
                item={it}
                onChangeGrams={(grams) => onUpdateItem(ii, grams)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}


