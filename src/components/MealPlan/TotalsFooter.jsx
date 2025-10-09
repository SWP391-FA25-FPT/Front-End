import { styles } from '../../pages/style/styles'

export default function TotalsFooter({ totals }) {
  return (
    <footer style={styles.footerTotals}>
      <div style={styles.totalPill}>Cals: <b>{totals.cals}</b></div>
      <div style={styles.totalPill}>Proteins: <b>{totals.proteins}g</b></div>
      <div style={styles.totalPill}>Carbs: <b>{totals.carbs}g</b></div>
      <div style={styles.totalPill}>Fats: <b>{totals.fats}g</b></div>
    </footer>
  )
}


