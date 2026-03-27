import { useEffect, useState } from 'react';
import { DataTable } from '../components/data/DataTable.jsx';
import { lookupApi, reportApi } from '../services/api.js';

export function ReportsPage() {
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState({ clienteId: 'all', regionId: 'all', notaId: 'all' });
  const [lookups, setLookups] = useState({ clientes: [], regiones: [], notas: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([lookupApi.clientes(), lookupApi.regiones(), lookupApi.notas()])
      .then(([clientes, regiones, notas]) => {
        setError('');
        setLookups({ clientes, regiones, notas });
      })
      .catch((loadError) => setError(loadError.message || 'No se pudieron cargar los filtros.'));
  }, []);

  useEffect(() => {
    reportApi
      .list(filters)
      .then((result) => {
        setError('');
        setRows(result);
      })
      .catch((loadError) => setError(loadError.message || 'No se pudo cargar el reporte.'));
  }, [filters]);

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">Reportes</p>
          <h2>Consolidado de evaluaciones</h2>
          <p className="page-subtitle">Filtra automaticamente por cliente, region o nota para generar cortes operativos.</p>
        </div>
      </section>

      {error ? <section className="error-banner page-error-banner">{error}</section> : null}

      <section className="toolbar toolbar-card toolbar-rich">
        <div className="toolbar-filters">
          <label className="toolbar-select">
            <select value={filters.clienteId} onChange={(event) => setFilters((current) => ({ ...current, clienteId: event.target.value }))}>
              <option value="all">Todos los clientes</option>
              {lookups.clientes.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.razon_social}
                </option>
              ))}
            </select>
          </label>
          <label className="toolbar-select">
            <select value={filters.regionId} onChange={(event) => setFilters((current) => ({ ...current, regionId: event.target.value }))}>
              <option value="all">Todas las regiones</option>
              {lookups.regiones.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.nombre}
                </option>
              ))}
            </select>
          </label>
          <label className="toolbar-select">
            <select value={filters.notaId} onChange={(event) => setFilters((current) => ({ ...current, notaId: event.target.value }))}>
              <option value="all">Todas las notas</option>
              {lookups.notas.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.folio}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="toolbar-actions">
          <button type="button" className="ghost-button" onClick={() => setFilters({ clienteId: 'all', regionId: 'all', notaId: 'all' })}>
            Reiniciar filtros
          </button>
        </div>
      </section>

      <DataTable
        rows={rows}
        columns={['folio_verificacion', 'fecha', 'dictamen', 'materia', 'placa', 'cliente', 'cedis', 'region', 'folio_nota']}
        selectedIds={[]}
        onToggleSelect={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
        disableEdit
        disableDelete
      />
    </div>
  );
}
