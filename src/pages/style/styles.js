export const ORANGE = '#ff7a00'
export const LIGHT_ORANGE = '#fff3e6'

export const styles = {
  page: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '24px 16px 80px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    margin: 0,
    color: ORANGE,
  },
  actionsRow: {
    display: 'flex',
    gap: 8,
  },
  primaryBtn: {
    background: ORANGE,
    color: '#fff',
    border: 'none',
    padding: '10px 14px',
    borderRadius: 8,
    cursor: 'pointer',
  },
  dangerBtn: {
    background: '#d9534f',
    color: '#fff',
    border: 'none',
    padding: '10px 14px',
    borderRadius: 8,
    cursor: 'pointer',
  },
  linkBtn: {
    background: 'transparent',
    color: ORANGE,
    border: `1px solid ${ORANGE}`,
    padding: '10px 14px',
    borderRadius: 8,
    cursor: 'pointer',
  },
  stack: {
    display: 'grid',
    gap: 16,
  },
  card: {
    border: `1px solid ${ORANGE}33`,
    borderRadius: 12,
    overflow: 'hidden',
    background: '#fff',
    boxShadow: '0 4px 14px rgba(0,0,0,0.06)'
  },
  mealHeader: {
    background: LIGHT_ORANGE,
    borderBottom: `1px solid ${ORANGE}33`,
    padding: '10px 14px',
  },
  mealTitle: {
    margin: 0,
    color: ORANGE,
  },
  tableWrap: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thLeft: {
    textAlign: 'left',
    padding: '10px 12px',
    borderBottom: '1px solid #eee',
    color: '#222',
    background: '#fafafa',
  },
  th: {
    textAlign: 'center',
    padding: '10px 12px',
    borderBottom: '1px solid #eee',
    color: '#222',
    background: '#fafafa',
  },
  tdLeft: {
    padding: '10px 12px',
    borderBottom: '1px solid #f2f2f2',
  },
  tdCenter: {
    padding: '10px 12px',
    textAlign: 'center',
    borderBottom: '1px solid #f2f2f2',
  },
  gramsInput: {
    width: 90,
    textAlign: 'right',
    padding: '6px 10px',
    borderRadius: 8,
    border: `1px solid ${ORANGE}66`,
    background: '#fff',
  },
  footerTotals: {
    position: 'sticky',
    bottom: 0,
    display: 'flex',
    gap: 8,
    background: '#fff',
    padding: 12,
    borderTop: '1px solid #eee',
  },
  totalPill: {
    background: LIGHT_ORANGE,
    color: '#222',
    padding: '8px 12px',
    borderRadius: 999,
    border: `1px solid ${ORANGE}33`,
  },
  empty: {
    textAlign: 'center',
    padding: '40px 0',
    color: '#666',
  }
}


