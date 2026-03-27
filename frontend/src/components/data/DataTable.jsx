import { Pencil, Trash2 } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge.jsx';

function renderCell(column, value) {
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
}) {
  return (
    <div className="table-card table-shell">
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              {selectable ? <th /> : null}
              {columns.map((column) => (
                <th key={column}>{column.replaceAll('_', ' ')}</th>
              ))}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row) => (
                <tr key={row.id}>
                  {selectable ? (
                    <td className="checkbox-cell">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row.id)}
                        onChange={() => onToggleSelect(row.id)}
                      />
                    </td>
                  ) : null}
                  {columns.map((column) => (
                    <td key={`${row.id}-${column}`}>{renderCell(column, row[column])}</td>
                  ))}
                  <td>
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
