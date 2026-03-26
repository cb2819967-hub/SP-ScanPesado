export function StatusBadge({ value }) {
  const normalized = String(value ?? '').toLowerCase();
  const variant =
    normalized.includes('aprob') || normalized === 'true'
      ? 'success'
      : normalized.includes('reprob') || normalized.includes('false')
        ? 'danger'
        : normalized.includes('pend')
          ? 'warning'
          : 'neutral';

  return <span className={`status-badge ${variant}`}>{String(value)}</span>;
}
