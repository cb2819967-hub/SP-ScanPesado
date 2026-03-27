import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Building2, ClipboardList, LoaderCircle, SearchCheck, Truck } from 'lucide-react';
import { dashboardApi } from '../services/api.js';
import { StatusBadge } from '../components/ui/StatusBadge.jsx';
import { useAuth } from '../utils/auth.js';

function MetricCard({ icon, label, value, accent, onClick }) {
  return (
    <button type="button" className={`dashboard-metric-card ${accent}`} onClick={onClick}>
      <div className="dashboard-metric-icon">{icon}</div>
      <div>
        <div className="dashboard-metric-value">{value}</div>
        <div className="dashboard-metric-label">{label}</div>
      </div>
    </button>
  );
}

function QuickCard({ icon, title, subtitle, accent, onClick }) {
  return (
    <button type="button" className={`dashboard-quick-card ${accent}`} onClick={onClick}>
      <div className="dashboard-metric-icon">{icon}</div>
      <div>
        <div className="dashboard-quick-title">{title}</div>
        <div className="dashboard-quick-subtitle">{subtitle}</div>
      </div>
    </button>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setError('');

      try {
        const [statsData, verificaciones] = await Promise.all([dashboardApi.stats(), dashboardApi.verificaciones()]);
        if (!active) return;
        setStats(statsData);
        setRecent(verificaciones.slice(0, 5));
      } catch (loadError) {
        if (!active) return;
        setError(loadError.message || 'No se pudo cargar el dashboard.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const approval = useMemo(() => {
    const aprobadas = stats?.aprobadas ?? 0;
    const reprobadas = stats?.reprobadas ?? 0;
    const pendientes = stats?.pendientes ?? 0;
    const total = aprobadas + reprobadas + pendientes;
    const percent = total > 0 ? Math.round((aprobadas / total) * 100) : 0;
    const circumference = 251.32;
    const dashValue = (percent / 100) * circumference;

    return { aprobadas, reprobadas, pendientes, percent, circumference, dashValue };
  }, [stats]);

  return (
    <div className="page-stack dashboard-page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h2>Resumen general del sistema</h2>
          <p className="page-subtitle">Estado operativo, verificaciones recientes y accesos directos.</p>
        </div>
      </section>

      {loading ? (
        <section className="dashboard-feedback loading">
          <LoaderCircle size={18} className="spin-icon" />
          <span>Cargando dashboard...</span>
        </section>
      ) : null}

      {error ? (
        <section className="dashboard-feedback error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </section>
      ) : null}

      <section className="dashboard-metrics">
        <MetricCard icon={<Building2 size={22} />} label="Clientes" value={stats?.clientes ?? 0} accent="blue" onClick={() => navigate('/dashboard/clientes')} />
        <MetricCard icon={<Truck size={22} />} label="Unidades" value={stats?.vehiculos ?? 0} accent="green" onClick={() => navigate('/dashboard/vehiculos')} />
        <MetricCard icon={<ClipboardList size={22} />} label="Notas activas" value={stats?.notas ?? 0} accent="orange" onClick={() => navigate('/dashboard/notas')} />
        <MetricCard icon={<SearchCheck size={22} />} label="Evaluaciones" value={stats?.verificaciones ?? 0} accent="purple" onClick={() => navigate('/dashboard/verificaciones')} />
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-panel">
          <div className="dashboard-panel-head">
            <div className="pnt">Inspecciones recientes</div>
            <div className="pns">Ultimas verificaciones registradas</div>
          </div>

          <div className="dashboard-table-wrap">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Folio</th>
                  <th>Unidad</th>
                  <th>Tecnico</th>
                  <th>Fecha</th>
                  <th>Resultado</th>
                </tr>
              </thead>
              <tbody>
                {recent.length ? (
                  recent.map((row) => (
                    <tr key={row.id}>
                      <td>{row.folio || 'N/D'}</td>
                      <td>{row.unidad || 'N/D'}</td>
                      <td>{row.tecnico || 'N/D'}</td>
                      <td>{row.fecha || 'N/D'}</td>
                      <td>
                        <StatusBadge value={row.resultado || 'N/D'} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="dashboard-empty-cell">
                      No hay datos recientes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className="dashboard-panel dashboard-panel-side">
          <div className="dashboard-panel-head center">
            <div className="pnt">Tasa de aprobacion</div>
            <div className="pns">Verificaciones del periodo</div>
          </div>

          <div className="dashboard-donut">
            <svg width="120" height="120" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="13" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#16a34a"
                strokeWidth="13"
                strokeDasharray={`${approval.dashValue} ${approval.circumference}`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="dashboard-donut-label">{approval.percent}%</div>
          </div>

          <div className="dashboard-approval-rows">
            <div className="dashboard-approval-row">
              <span>Aprobadas</span>
              <strong>{approval.aprobadas}</strong>
            </div>
            <div className="dashboard-approval-row">
              <span>Reprobadas</span>
              <strong>{approval.reprobadas}</strong>
            </div>
            <div className="dashboard-approval-row">
              <span>Pendientes</span>
              <strong>{approval.pendientes}</strong>
            </div>
          </div>
        </article>
      </section>

      <section className="page-header dashboard-secondary-header">
        <div>
          <h2>Vistas avanzadas</h2>
          <p className="page-subtitle">Accesos directos a los modulos con mas movimiento.</p>
        </div>
      </section>

      <section className="dashboard-quick-grid">
        <QuickCard icon={<Truck size={22} />} title="Vehiculos" subtitle="Historial por unidad" accent="green" onClick={() => navigate('/dashboard/vehiculos')} />
        {user?.rol === 'ADMIN' ? (
          <QuickCard icon={<ClipboardList size={22} />} title="Transacciones" subtitle="Cobros y seguimiento" accent="orange" onClick={() => navigate('/dashboard/transacciones')} />
        ) : (
          <QuickCard icon={<ClipboardList size={22} />} title="Reportes" subtitle="Mis evaluaciones y trazabilidad" accent="orange" onClick={() => navigate('/dashboard/reportes')} />
        )}
        <QuickCard
          icon={<SearchCheck size={22} />}
          title="Notas"
          subtitle={user?.rol === 'ADMIN' ? 'Resumen general de notas' : 'Verificaciones y seguimiento'}
          accent="purple"
          onClick={() => navigate(user?.rol === 'ADMIN' ? '/dashboard/notas' : '/dashboard/verificaciones')}
        />
      </section>
    </div>
  );
}
