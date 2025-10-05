import { styles } from '../style/styles'

export default function Header({ onGenerate, onDelete, onReset }) {
  return (
    <header style={styles.header}>
      <h2 style={styles.title}>Meal Plan</h2>
      <div style={styles.actionsRow}>
        <button style={styles.primaryBtn} onClick={onGenerate}>Generate Meal Plan</button>
        <button style={styles.dangerBtn} onClick={onDelete}>Delete Meal Plan</button>
        <button style={styles.linkBtn} onClick={onReset}>Reset</button>
      </div>
    </header>
  )
}


