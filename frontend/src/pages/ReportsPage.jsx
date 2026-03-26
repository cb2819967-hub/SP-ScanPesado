import { useEffect, useState } from 'react';
import { reportApi } from '../services/api.js';
import { DataTable } from '../components/data/DataTable.jsx';

export function ReportsPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    reportApi.list().then(setRows);
  }, []);

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">Reportes</p>
          <h2>Consolidado de evaluaciones</h2>
          <p className="page-subtitle">Vista analítica de dictámenes y trazabilidad operativa.</p>
        </div>
      </section>
      <DataTable
        rows={rows}
        columns={['folio_verificacion', 'fecha', 'dictamen', 'materia', 'placa', 'cliente', 'cedis', 'region']}
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
