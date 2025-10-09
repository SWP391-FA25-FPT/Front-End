import { styles } from '../../pages/style/styles'

export default function MealRow({ item, onChangeGrams }) {
  const ratio = item.grams / 100
  const rowCals = Math.round(item.cals * ratio)
  const rowP = Math.round(item.proteins * ratio)
  const rowC = Math.round(item.carbs * ratio)
  const rowF = Math.round(item.fats * ratio)

  return (
    <tr>
      <td style={styles.tdLeft}>{item.food}</td>
      <td style={styles.tdCenter}>
        <input
          type="number"
          min={0}
          value={item.grams}
          onChange={(e) => onChangeGrams(Number(e.target.value))}
          style={styles.gramsInput}
        />
      </td>
      <td style={styles.tdCenter}>{rowCals}</td>
      <td style={styles.tdCenter}>{rowP}</td>
      <td style={styles.tdCenter}>{rowC}</td>
      <td style={styles.tdCenter}>{rowF}</td>
    </tr>
  )
}


