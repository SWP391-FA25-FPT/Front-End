import { styles } from '../../pages/style/styles'

export default function Header({ onGenerate, onDelete, onReset }) {
  return (
    <header style={styles.header}>
      <h2 style={styles.title}>Meal Plan</h2>
      <div style={styles.actionsRow}>
        <button className="meal-plan-btn primary" onClick={onGenerate}>Generate Meal Plan</button>
        <button className="meal-plan-btn danger" onClick={onDelete}>Delete Meal Plan</button>
        <button className="meal-plan-btn link" onClick={onReset}>Reset</button>
      </div>
    </header>
  )
}


