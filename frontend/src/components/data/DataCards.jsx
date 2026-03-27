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

function formatMoney(value) {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return displayValue(value);
  }

  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric);
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
          const paymentStatus = row.pagado_completo ? 'Pagado completo' : 'Pendiente';

          return (
            <article key={row.id} className="data-card note-card">
              <div className="note-card-topbar">
                <div className="note-card-select">
                  {selectable ? (
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row.id)}
                      onChange={() => onToggleSelect(row.id)}
                    />
                  ) : (
                    <span className="data-card-bullet" />
                  )}
                  <span className="note-card-kicker">Nota</span>
                </div>
                <div className="note-card-statuses">
                  <StatusBadge value={paymentStatus} />
                  <StatusBadge value={displayValue(row.activo)} />
                </div>
              </div>

              <div className="note-card-header">
                <div className="note-card-title-wrap">
                  <h3>{displayValue(row.folio)}</h3>
                  <p>{displayValue(row.cliente_nombre)}</p>
                </div>
                <div className="note-card-tags">
                  <span className="note-summary-pill">{displayValue(row.tipo_pago)}</span>
                  <span className="note-summary-pill strong">Verificaciones: {displayValue(row.resumen_verificaciones ?? '0')}</span>
                </div>
              </div>

              <div className="note-card-metrics">
                <div className="note-metric-card">
                  <span>Contrato</span>
                  <strong>{displayValue(row.fecha_contrato)}</strong>
                </div>
                <div className="note-metric-card">
                  <span>Vigencia</span>
                  <strong>{displayValue(row.fecha_vigencia)}</strong>
                </div>
                <div className="note-metric-card highlight">
                  <span>Anticipo</span>
                  <strong className={row.pagado_completo ? 'amount-paid' : 'amount-pending'}>{formatMoney(row.anticipo)}</strong>
                </div>
                <div className="note-metric-card wide">
                  <span>Verificentro</span>
                  <strong>{displayValue(row.verificentro_nombre)}</strong>
                </div>
                <div className="note-metric-card">
                  <span>Atendio</span>
                  <strong>{displayValue(row.atendio)}</strong>
                </div>
                <div className="note-metric-card">
                  <span>Reviso</span>
                  <strong>{displayValue(row.reviso)}</strong>
                </div>
              </div>

              {row.comentario ? <p className="note-card-comment">{row.comentario}</p> : null}

              <div className="note-card-footer">
                <div className="note-card-meta">
                  <span>Estatus de pago: {paymentStatus}</span>
                  <span>Metodo: {displayValue(row.tipo_pago)}</span>
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
