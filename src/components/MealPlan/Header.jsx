import { styles } from '../../pages/style/styles'

export default function Header({ onGenerate, onDelete, onReset, loading = false }) {
  return (
    <header style={styles.header}>
      <h2 style={styles.title}>Meal Plan</h2>
      <div style={styles.actionsRow}>
        <button 
          className="meal-plan-btn primary" 
          onClick={onGenerate}
          disabled={loading}
        >
          {loading ? 'Đang tạo...' : 'Generate Meal Plan'}
        </button>
        <button 
          className="meal-plan-btn danger" 
          onClick={onDelete}
          disabled={loading}
        >
          Delete Meal Plan
        </button>
        <button 
          className="meal-plan-btn link" 
          onClick={onReset}
          disabled={loading}
        >
          Reset
        </button>
      </div>
    </header>
  )
}


