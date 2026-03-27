import { Pencil, Trash2 } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge.jsx';

function formatMoney(value) {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return value ?? 'N/D';
  }

  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric);
}

function renderCell(column, value, variant) {
  if (typeof value === 'boolean') {
    if (column === 'activo') {
      return <StatusBadge value={value ? 'Activo' : 'Inactivo'} />;
    }

    if (column === 'pagado') {
      return <StatusBadge value={value ? 'Pagado' : 'No pagado'} />;
    }

    if (column === 'pendiente') {
      return <StatusBadge value={value ? 'Pendiente' : 'Sin pendiente'} />;
    }

    return value ? 'Si' : 'No';
  }

  if (typeof value === 'string' && ['APROBADO', 'PENDIENTE', 'REPROBADO', 'ENTREGADO', 'ENVIADO', 'INCIDENCIA'].includes(value)) {
    return <StatusBadge value={value} />;
  }

  if (variant === 'transacciones' && ['precio'].includes(column)) {
    return <span className="table-money">{formatMoney(value)}</span>;
  }

  return value ?? 'N/D';
}

export function DataTable({
  rows,
  columns,
  selectable,
  selectedIds,
  onToggleSelect,
  onEdit,
  onDelete,
  disableEdit,
  disableDelete,
  variant = 'default',
}) {
  return (
    <div className={`table-card table-shell table-shell-${variant}`}>
      <div className={`table-scroll table-scroll-${variant}`}>
        <table className={`data-table data-table-${variant}`}>
          <thead>
            <tr>
              {selectable ? <th className="sticky-column sticky-column-checkbox" /> : null}
              {columns.map((column, index) => (
                <th
                  key={column}
                  className={
                    variant === 'transacciones' && index < 2
                      ? `sticky-column sticky-column-${index + 1}`
                      : undefined
                  }
                >
                  {column.replaceAll('_', ' ')}
                </th>
              ))}
              <th className={variant === 'transacciones' ? 'sticky-column sticky-column-actions' : undefined}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row) => (
                <tr key={row.id}>
                  {selectable ? (
                    <td className={variant === 'transacciones' ? 'checkbox-cell sticky-column sticky-column-checkbox' : 'checkbox-cell'}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row.id)}
                        onChange={() => onToggleSelect(row.id)}
                      />
                    </td>
                  ) : null}
                  {columns.map((column, index) => (
                    <td
                      key={`${row.id}-${column}`}
                      className={
                        variant === 'transacciones' && index < 2
                          ? `sticky-column sticky-column-${index + 1}`
                          : undefined
                      }
                    >
                      {renderCell(column, row[column], variant)}
                    </td>
                  ))}
                  <td className={variant === 'transacciones' ? 'sticky-column sticky-column-actions' : undefined}>
                    <div className="action-row">
                      {!disableEdit ? (
                        <button type="button" className="icon-button" onClick={() => onEdit(row)} aria-label="Editar">
                          <Pencil size={16} />
                        </button>
                      ) : null}
                      {!disableDelete ? (
                        <button type="button" className="icon-button danger" onClick={() => onDelete(row.id)} aria-label="Eliminar">
                          <Trash2 size={16} />
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (selectable ? 2 : 1)} className="table-empty">
                  No hay registros para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
