const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  submitted: { label: 'Envoyée', bg: '#FFF3E0', color: '#FF7900' },
  viewed: { label: 'Consultée', bg: '#E8F5E9', color: '#32C832' },
  received: { label: 'Reçue', bg: '#E3F2FD', color: '#527EDB' },
}

const DEFAULT_CONFIG = { label: 'Inconnu', bg: '#F5F5F5', color: '#666666' }

export default function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? DEFAULT_CONFIG
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        background: config.bg,
        color: config.color,
        fontSize: 12,
        fontWeight: 600,
        fontFamily: 'Helvetica Neue, Arial, sans-serif',
        borderRadius: 0,
      }}
    >
      {config.label}
    </span>
  )
}
