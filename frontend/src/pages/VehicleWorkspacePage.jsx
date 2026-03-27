import { useEffect, useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EntityForm } from '../components/forms/EntityForm.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { EvaluationForm } from '../components/evaluations/EvaluationForm.jsx';
import { MODULES } from '../config/modules.js';
import { evaluationApi, lookupApi, moduleApi } from '../services/api.js';
import { useAuth } from '../utils/auth.js';

function toVerificationOption(row) {
  return {
    value: row.id,
    label: `${row.materia} | ${row.folio || 'S/F'} | ${row.fecha || 'Sin fecha'}`,
  };
}

function formatLookupOption(source, item) {
  if (source === 'clientes') return { value: item.id, label: item.razon_social };
  if (source === 'cedis') return { value: item.id, label: item.nombre };
  if (source === 'regiones') return { value: item.id, label: item.nombre };
  return { value: item.id, label: item.nombre ?? item.id };
}

function toVehicleFormData(row) {
  if (!row) {
    return null;
  }

  return {
    ...row,
    clienteId: row.cliente_id ?? '',
    cedisId: row.cedis_id ?? '',
    activo: row.activo ?? true,
  };
}

export function VehicleWorkspacePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const vehicleModule = useMemo(() => MODULES.find((module) => module.key === 'vehiculos'), []);
  const [vehicles, setVehicles] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [vehicleLookups, setVehicleLookups] = useState({});
  const [historyRows, setHistoryRows] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingEvaluation, setEditingEvaluation] = useState(null);
  const [vehicleFormOpen, setVehicleFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [vehicleSubmitting, setVehicleSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [error, setError] = useState('');

  const isAdmin = user?.rol === 'ADMIN';

  async function loadBase() {
    setLoading(true);
    setError('');
    try {
      const [vehicleRows, verificationRows, clientRows, cedisRows, regionRows] = await Promise.all([
        moduleApi.list('/vehiculos'),
        moduleApi.list('/verificaciones'),
        lookupApi.clientes(),
        lookupApi.cedis(),
        lookupApi.regiones(),
      ]);
      setVehicles(vehicleRows);
      setVerifications(verificationRows);
      setVehicleLookups({
        clientes: clientRows.map((item) => formatLookupOption('clientes', item)),
        cedis: cedisRows.map((item) => formatLookupOption('cedis', item)),
        regiones: regionRows.map((item) => formatLookupOption('regiones', item)),
      });
    } catch (loadError) {
      setError(loadError.message || 'No se pudo cargar la vista de unidades.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBase();
  }, []);

  const regions = useMemo(
    () => [...new Set(vehicles.map((row) => row.region_nombre).filter((value) => value && value !== 'N/A'))],
    [vehicles],
  );
  const clients = useMemo(
    () => [...new Set(vehicles.map((row) => row.cliente_nombre).filter((value) => value && value !== 'N/A'))],
    [vehicles],
  );

  const filteredVehicles = useMemo(
    () =>
      vehicles.filter((row) => {
        const matchesSearch =
          search.trim() === '' ||
          [row.placa, row.serie, row.cedis_nombre, row.region_nombre].some((value) =>
            String(value ?? '')
              .toLowerCase()
              .includes(search.toLowerCase()),
          );
        const matchesRegion = regionFilter === 'all' || row.region_nombre === regionFilter;
        const matchesClient = clientFilter === 'all' || row.cliente_nombre === clientFilter;
        return matchesSearch && matchesRegion && matchesClient;
      }),
    [clientFilter, regionFilter, search, vehicles],
  );

  async function openHistory(vehicle) {
    setSelectedVehicle(vehicle);
    setHistoryOpen(true);
    setEditingEvaluation(null);
    try {
      const rows = await evaluationApi.byVehiculo(vehicle.id);
      setHistoryRows(isAdmin ? rows : rows.filter((item) => item.id_tecnico === user.id));
    } catch (loadError) {
      setHistoryRows([]);
      setError(loadError.message || 'No se pudo cargar el historial.');
    }
  }

  function openNewEvaluation(vehicle) {
    setSelectedVehicle(vehicle);
    setEditingEvaluation(null);
    setHistoryOpen(false);
    setFormOpen(true);
  }

  function openVehicleForm(vehicle = null) {
    setEditingVehicle(vehicle);
    setVehicleFormOpen(true);
  }

  async function saveVehicle(values) {
    setVehicleSubmitting(true);
    setError('');
    const payload = {
      placa: values.placa,
      serie: values.serie,
      tipo: values.tipo,
      cliente: { id: Number(values.clienteId) },
      cedis: { id: Number(values.cedisId) },
      activo: values.activo ?? true,
    };

    try {
      if (editingVehicle?.id) {
        await moduleApi.update('/vehiculos', editingVehicle.id, payload);
      } else {
        await moduleApi.create('/vehiculos', payload);
      }
      setVehicleFormOpen(false);
      setEditingVehicle(null);
      await loadBase();
    } catch (saveError) {
      setError(saveError.message || 'No se pudo guardar el vehiculo.');
    } finally {
      setVehicleSubmitting(false);
    }
  }

  async function deleteVehicle(id) {
    try {
      setError('');
      await moduleApi.remove('/vehiculos', id);
      setDeleteCandidate(null);
      await loadBase();
    } catch (deleteError) {
      setError(deleteError.message || 'No se pudo eliminar el vehiculo.');
    }
  }

  async function saveEvaluation(values) {
    setSubmitting(true);
    setError('');
    const payload = Object.fromEntries(
      Object.entries({
        ...values,
        idTecnico: editingEvaluation?.id_tecnico ?? user.id,
        activo: true,
      }).filter(([, value]) => value !== '' && value !== undefined && value !== null),
    );

    try {
      if (editingEvaluation?.id) {
        await evaluationApi.update(editingEvaluation.id, payload);
      } else {
        await evaluationApi.create(payload);
      }
      setFormOpen(false);
      setEditingEvaluation(null);
      if (selectedVehicle) {
        await openHistory(selectedVehicle);
      }
    } catch (saveError) {
      setError(saveError.message || 'No se pudo guardar la evaluacion.');
    } finally {
      setSubmitting(false);
    }
  }

  const verificationOptions = useMemo(
    () => verifications.filter((row) => row.vehiculo_id === selectedVehicle?.id).map(toVerificationOption),
    [selectedVehicle, verifications],
  );

  function openVerificationFromHistory(row) {
    if (!row.id_verificacion) {
      return;
    }
    setHistoryOpen(false);
    navigate('/dashboard/verificaciones', { state: { openVerificationId: row.id_verificacion } });
  }

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">{isAdmin ? 'Vista 1' : 'Tecnico'}</p>
          <h2>{isAdmin ? 'Unidades y evaluaciones' : 'Mi tablero de unidades'}</h2>
          <p className="page-subtitle">
            {isAdmin
              ? 'Consulta vehiculos con region, historial de evaluaciones y edicion tecnica.'
              : 'Consulta tus unidades, revisa tu historial y registra nuevas evaluaciones.'}
          </p>
        </div>
        <button type="button" className="primary-button" onClick={() => openVehicleForm()}>
          <Plus size={16} />
          Nuevo vehiculo
        </button>
      </section>

      {error ? <section className="error-banner page-error-banner">{error}</section> : null}

      <section className="toolbar toolbar-card toolbar-rich">
        <div className="toolbar-filters">
          <label className="search-box">
            <Search size={16} />
            <input type="text" placeholder="Buscar por placa, serie, CEDIS o region..." value={search} onChange={(event) => setSearch(event.target.value)} />
          </label>
          <label className="toolbar-select">
            <select value={clientFilter} onChange={(event) => setClientFilter(event.target.value)}>
              <option value="all">Todos los clientes</option>
              {clients.map((client) => (
                <option key={client} value={client}>
                  {client}
                </option>
              ))}
            </select>
          </label>
          <label className="toolbar-select">
            <select value={regionFilter} onChange={(event) => setRegionFilter(event.target.value)}>
              <option value="all">Todas las regiones</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="toolbar-actions">
          <button
            type="button"
            className="ghost-button"
            onClick={() => {
              setSearch('');
              setClientFilter('all');
              setRegionFilter('all');
            }}
          >
            Limpiar filtros
          </button>
        </div>
      </section>

      <section className="table-card table-shell">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Placa</th>
                <th>Serie</th>
                <th>CEDIS</th>
                <th>Region</th>
                <th>Cliente</th>
                <th>Verificaciones</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.length ? (
                filteredVehicles.map((vehicle) => {
                  const verificationCount = verifications.filter((row) => row.vehiculo_id === vehicle.id).length;
                  return (
                    <tr key={vehicle.id}>
                      <td>{vehicle.placa}</td>
                      <td>{vehicle.serie}</td>
                      <td>{vehicle.cedis_nombre}</td>
                      <td>{vehicle.region_nombre}</td>
                      <td>{vehicle.cliente_nombre}</td>
                      <td>{verificationCount}</td>
                      <td>
                        <div className="action-row">
                          <button type="button" className="secondary-button compact" onClick={() => openHistory(vehicle)}>
                            Historial
                          </button>
                          <button type="button" className="secondary-button compact" onClick={() => openVehicleForm(vehicle)}>
                            Editar
                          </button>
                          <button type="button" className="secondary-button compact" onClick={() => openNewEvaluation(vehicle)} disabled={!verificationCount}>
                            Nueva evaluacion
                          </button>
                          <button type="button" className="ghost-button compact danger-button" onClick={() => setDeleteCandidate(vehicle.id)}>
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="table-empty">
                    {loading ? 'Cargando unidades...' : 'No hay unidades para mostrar.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Modal open={historyOpen} title={selectedVehicle ? `Historial ${selectedVehicle.placa}` : 'Historial'} onClose={() => setHistoryOpen(false)}>
        <div className="history-stack">
          {historyRows.length ? (
            historyRows.map((row) => (
              <article
                key={row.id}
                className={`history-card ${row.id_verificacion ? 'clickable' : ''}`.trim()}
                onClick={() => openVerificationFromHistory(row)}
                onKeyDown={(event) => {
                  if ((event.key === 'Enter' || event.key === ' ') && row.id_verificacion) {
                    event.preventDefault();
                    openVerificationFromHistory(row);
                  }
                }}
                role={row.id_verificacion ? 'button' : undefined}
                tabIndex={row.id_verificacion ? 0 : undefined}
              >
                <div className="history-card-head">
                  <div>
                    <strong>{row.folio_verificacion || 'Sin folio'}</strong>
                    <p>{row.fecha_captura || 'Sin fecha de captura'}</p>
                  </div>
                  <span className="history-card-hint">{row.id_verificacion ? 'Abrir en verificaciones' : 'Sin verificacion'}</span>
                </div>
                <div className="history-card-grid">
                  <div>
                    <span>Materia</span>
                    <strong>{row.materia || 'N/D'}</strong>
                  </div>
                  <div>
                    <span>Dictamen</span>
                    <strong>{row.dictamen || 'PENDIENTE'}</strong>
                  </div>
                  <div>
                    <span>Nota</span>
                    <strong>{row.nota_folio || 'N/D'}</strong>
                  </div>
                  <div>
                    <span>Comentarios</span>
                    <strong>{row.comentarios || 'Sin comentarios'}</strong>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="table-empty">No hay evaluaciones registradas para esta unidad.</div>
          )}
        </div>
      </Modal>

      <Modal
        open={vehicleFormOpen}
        title={editingVehicle?.id ? 'Editar vehiculo' : 'Nuevo vehiculo'}
        onClose={() => {
          setVehicleFormOpen(false);
          setEditingVehicle(null);
        }}
      >
        <EntityForm
          module={vehicleModule}
          lookupOptions={vehicleLookups}
          initialData={toVehicleFormData(editingVehicle)}
          onSubmit={saveVehicle}
          submitting={vehicleSubmitting}
          onCancel={() => {
            setVehicleFormOpen(false);
            setEditingVehicle(null);
          }}
        />
      </Modal>

      <Modal open={Boolean(deleteCandidate)} title="Confirmar eliminacion" onClose={() => setDeleteCandidate(null)}>
        <div className="confirm-box">
          <p>Seguro que deseas eliminar este vehiculo?</p>
          <div className="confirm-actions">
            <button type="button" className="ghost-button" onClick={() => setDeleteCandidate(null)}>
              Cancelar
            </button>
            <button type="button" className="primary-button danger-button" onClick={() => deleteVehicle(deleteCandidate)}>
              Eliminar
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={formOpen} title={editingEvaluation?.id ? 'Editar evaluacion' : 'Nueva evaluacion'} onClose={() => setFormOpen(false)}>
        <EvaluationForm
          initialData={editingEvaluation}
          verificationOptions={verificationOptions}
          onSubmit={saveEvaluation}
          submitting={submitting}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>
    </div>
  );
}
