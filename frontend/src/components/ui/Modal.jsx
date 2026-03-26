export function Modal({ open, title, children, onClose, className = '', closeLabel = 'Cerrar', showCloseButton = true }) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal-card ${className}`.trim()} onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          {showCloseButton ? (
            <button type="button" className="ghost-button" onClick={onClose}>
              {closeLabel}
            </button>
          ) : null}
        </div>
        {children}
      </div>
    </div>
  );
}
