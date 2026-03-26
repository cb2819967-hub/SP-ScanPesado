import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="empty-state">
      <h2>Ruta no encontrada</h2>
      <p>La vista solicitada no existe dentro de la nueva SPA.</p>
      <Link to="/dashboard" className="primary-button">
        Volver al dashboard
      </Link>
    </div>
  );
}
