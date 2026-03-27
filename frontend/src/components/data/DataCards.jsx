import { FileText, Pencil, Trash2 } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge.jsx';

function prettify(label) {
  return label.replaceAll('_', ' ');
}

function displayValue(value) {
  if (value === true) return 'Activo';
  if (value === false) return 'Inactivo';
  return value ?? 'N/D';
}

export function DataCards({
  rows,
  columns,
  selectable,
  selectedIds,
  onToggleSelect,
  onEdit,
  onDelete,
  onGeneratePdf,
  disableEdit,
  disableDelete,
  variant,
}) {
  if (!rows.length) {
    return <div className="table-card cards-empty">No hay registros para mostrar.</div>;
  }

  return (
    <div className="cards-grid">
      {rows.map((row) => {
        if (variant === 'notas') {
          return (
            <article key={row.id} className="data-card note-card">
              <div className="data-card-top">
                {selectable ? (
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(row.id)}
                    onChange={() => onToggleSelect(row.id)}
                  />
                ) : (
                  <span className="data-card-bullet" />
                )}
                <StatusBadge value={displayValue(row.activo)} />
              </div>

              <div className="data-card-head">
                <h3>{displayValue(row.folio)}</h3>
                <p>{displayValue(row.cliente_nombre)}</p>
              </div>

              <div className="note-card-badge-row">
                <span className="note-summary-pill">Verificaciones: {displayValue(row.resumen_verificaciones ?? '0 Registradas')}</span>
              </div>

              <div className="data-card-lines note-card-lines">
                <div className="data-card-line">
                  <span>Contrato</span>
                  <strong>{displayValue(row.fecha_contrato)}</strong>
                </div>
                <div className="data-card-line">
                  <span>Vigencia</span>
                  <strong>{displayValue(row.fecha_vigencia)}</strong>
                </div>
                <div className="data-card-line">
                  <span>Anticipo</span>
                  <strong className={row.pagado_completo ? 'amount-paid' : 'amount-pending'}>{displayValue(row.anticipo)}</strong>
                </div>
                <div className="data-card-line">
                  <span>Verificentro</span>
                  <strong>{displayValue(row.verificentro_nombre)}</strong>
                </div>
                <div className="data-card-line">
                  <span>Tipo de pago</span>
                  <strong>{displayValue(row.tipo_pago)}</strong>
                </div>
                <div className="data-card-line">
                  <span>Estatus</span>
                  <strong>{row.pagado_completo ? 'Pagado completo' : 'Anticipo / pendiente'}</strong>
                </div>
              </div>

              {row.comentario ? <p className="note-card-comment">{row.comentario}</p> : null}

              <div className="note-card-footer">
                <div className="note-card-meta">
                  <span>Atendió: {displayValue(row.atendio)}</span>
                  <span>Revisó: {displayValue(row.reviso)}</span>
                </div>
                <div className="data-card-actions">
                  <button type="button" className="secondary-button compact" onClick={() => onGeneratePdf(row)}>
                    <FileText size={14} />
                    PDF
                  </button>
                  {!disableEdit ? (
                    <button type="button" className="primary-button compact primary-square" onClick={() => onEdit(row)}>
                      <Pencil size={14} />
                    </button>
                  ) : null}
                  {!disableDelete ? (
                    <button type="button" className="secondary-button compact danger-soft" onClick={() => onDelete(row.id)}>
                      <Trash2 size={14} />
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
          );
        }

        const [titleField, subtitleField, ...detailFields] = columns;
        const badgeValue = row.activo !== undefined ? row.activo : row.resultado ?? row.dictamen ?? row.estatus_envio ?? row.pagado;

        return (
          <article key={row.id} className="data-card">
            <div className="data-card-top">
              {selectable ? (
                <input
                  type="checkbox"
                  checked={selectedIds.includes(row.id)}
                  onChange={() => onToggleSelect(row.id)}
                />
              ) : (
                <span className="data-card-bullet" />
              )}
              <StatusBadge value={displayValue(badgeValue)} />
            </div>

            <div className="data-card-head">
              <h3>{displayValue(row[titleField])}</h3>
              {subtitleField ? <p>{displayValue(row[subtitleField])}</p> : null}
            </div>

            <div className="data-card-lines">
              {detailFields.slice(0, 4).map((field) => (
                <div key={`${row.id}-${field}`} className="data-card-line">
                  <span>{prettify(field)}</span>
                  <strong>{displayValue(row[field])}</strong>
                </div>
              ))}
            </div>

            <div className="data-card-actions">
              {!disableEdit ? (
                <button type="button" className="secondary-button compact" onClick={() => onEdit(row)}>
                  <Pencil size={14} />
                  Editar
                </button>
              ) : null}
              {!disableDelete ? (
                <button type="button" className="secondary-button compact danger-soft" onClick={() => onDelete(row.id)}>
                  <Trash2 size={14} />
                  Eliminar
                </button>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
