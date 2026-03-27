import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown, Plus, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataCards } from '../components/data/DataCards.jsx';
import { DataTable } from '../components/data/DataTable.jsx';
import { EvaluationForm } from '../components/evaluations/EvaluationForm.jsx';
import { EntityForm } from '../components/forms/EntityForm.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { evaluationApi, moduleApi, lookupApi } from '../services/api.js';
import { generateNotePdf } from '../utils/notePdf.js';
import { useAuth } from '../utils/auth.js';

function formatLookupOption(source, item) {
  if (source === 'clientes') return { value: item.id, label: item.razon_social };
  if (source === 'cedis') return { value: item.id, label: item.nombre };
  if (source === 'vehiculos') return { value: item.id, label: `${item.placa} - ${item.serie}` };
  if (source === 'verificentros') return { value: item.id, label: item.nombre };
  if (source === 'notas') return { value: item.id, label: item.folio };
  if (source === 'regiones') return { value: item.id, label: item.nombre };
  return { value: item.id, label: item.nombre ?? item.folio ?? item.id };
}

function normalizeTipoPago(value) {
  const normalized = String(value ?? '').trim().toUpperCase();
  if (!normalized) return '';
  if (normalized === 'CRÉDITO') return 'CREDITO';
  return normalized;
}

function toFormData(module, row) {
  if (!row) {
    return null;
  }

  const base = { ...row };
  module.fields.forEach((field) => {
    if (field.name === 'clienteId') base[field.name] = row.cliente_id ?? '';
    if (field.name === 'cedisId') base[field.name] = row.cedis_id ?? '';
    if (field.name === 'regionId') base[field.name] = row.region_id ?? '';
    if (field.name === 'verificentroId') base[field.name] = row.verificentro_id ?? '';
    if (field.name === 'notaId') base[field.name] = row.nota_id ?? row.id_nota ?? '';
    if (field.name === 'vehiculoId') base[field.name] = row.vehiculo_id ?? '';
    if (field.name === 'tipoUsuario') base[field.name] = row.rol ?? '';
    if (field.name === 'nombreUsuario') base[field.name] = row.nombre ?? '';
    if (field.name === 'nombreRegion') base[field.name] = row.nombre ?? '';
    if (field.name === 'razonSocial') base[field.name] = row.razon_social ?? '';
    if (field.name === 'email') base[field.name] = row.email ?? row.correo ?? '';
    if (field.name === 'claveVerificentro') base[field.name] = row.clave ?? '';
    if (field.name === 'telAlternativo') base[field.name] = row.tel_alternativo ?? '';
    if (field.name === 'tipoPago') base[field.name] = normalizeTipoPago(row.tipo_pago);
    if (field.name === 'pagadoCompleto') base[field.name] = row.pagado_completo ?? false;
    if (field.name === 'fechaContrato') base[field.name] = row.fecha_contrato ?? '';
    if (field.name === 'fechaVigencia') base[field.name] = row.fecha_vigencia ?? '';
    if (field.name === 'folioVerificacion') base[field.name] = row.folio ?? '';
    if (field.name === 'fechaVerificacion') base[field.name] = row.fecha ?? '';
    if (field.name === 'dictamen') base[field.name] = row.resultado ?? '';
    if (field.name === 'atiendeYCobra') base[field.name] = row.atiende_y_cobra ?? '';
    if (field.name === 'fechaFolio') base[field.name] = row.fecha_folio ?? '';
    if (field.name === 'fechaPedido') base[field.name] = row.fecha_pedido ?? '';
    if (field.name === 'cuentaDeposito') base[field.name] = row.cuenta_deposito ?? '';
    if (field.name === 'numeroFactura') base[field.name] = row.numero_factura ?? '';
    if (field.name === 'fechaEnvio') base[field.name] = row.fecha_envio ?? '';
    if (field.name === 'numeroGuia') base[field.name] = row.numero_guia ?? '';
    if (field.name === 'estatusEnvio') base[field.name] = row.estatus_envio ?? '';
  });
  return base;
}

function toPayload(module, values) {
  const payload = {
    activo: values.activo ?? true,
  };

  Object.entries(values).forEach(([key, value]) => {
    if (value === '' || value === undefined) {
      return;
    }

    if (key === 'clienteId') payload.cliente = { id: Number(value) };
    else if (key === 'cedisId') payload.cedis = { id: Number(value) };
    else if (key === 'regionId') payload.region = { id: Number(value) };
    else if (key === 'verificentroId') payload.verificentro = { id: Number(value) };
    else if (key === 'notaId') payload.nota = { id: Number(value) };
    else if (key === 'vehiculoId') payload.vehiculo = { id: Number(value) };
    else if (key === 'tipoPago') payload[key] = normalizeTipoPago(value);
    else payload[key] = value;
  });

  if (module.key === 'usuarios' && !payload.contrasena) {
    delete payload.contrasena;
  }

  return payload;
}

function initialFilterState(module) {
  const state = { search: '' };
  (module.filterControls ?? []).forEach((control) => {
    state[control.key] = 'all';
  });
  return state;
}

function getFilterOptions(control, rows, lookupOptions) {
  if (control.type === 'lookup') {
    return lookupOptions[control.source] ?? [];
  }

  if (control.type === 'status') {
    return [
      { value: 'active', label: 'Activos' },
      { value: 'inactive', label: 'Inactivos' },
    ];
  }

  if (control.type === 'boolean') {
    return [
      { value: 'true', label: control.trueLabel ?? 'Si' },
      { value: 'false', label: control.falseLabel ?? 'No' },
    ];
  }

  const values = [...new Set(rows.map((row) => row[control.field]).filter((value) => value !== null && value !== undefined && value !== ''))];
  return values.map((value) => ({ value: String(value), label: String(value) }));
}

function matchesControl(row, control, selectedValue) {
  if (selectedValue === 'all') {
    return true;
  }

  if (control.type === 'lookup') {
    return String(row[control.rowField]) === String(selectedValue);
  }

  if (control.type === 'status') {
    return selectedValue === 'active' ? row.activo === true : row.activo === false;
  }

  if (control.type === 'boolean') {
    return String(Boolean(row[control.field])) === selectedValue;
  }

  return String(row[control.field] ?? '') === String(selectedValue);
}

function toVerificationOption(row) {
  if (!row) {
    return [];
  }

  return [
    {
      value: row.id,
      label: `${row.materia} | ${row.folio || 'S/F'} | ${row.fecha || 'Sin fecha'}`,
    },
  ];
}

export function ModulePage({ module }) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [lookupOptions, setLookupOptions] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [open, setOpen] = useState(false);
  const [evaluationOpen, setEvaluationOpen] = useState(false);
  const [editingEvaluation, setEditingEvaluation] = useState(null);
  const [evaluationVerification, setEvaluationVerification] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [evaluationSubmitting, setEvaluationSubmitting] = useState(false);
  const [filterState, setFilterState] = useState(() => initialFilterState(module));
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [bulkActionCandidate, setBulkActionCandidate] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [pageError, setPageError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const loadAll = useCallback(async () => {
    try {
      setPageError('');
      const [list, ...lookupResults] = await Promise.all([
        moduleApi.list(module.endpoint),
        ...(module.lookups ?? []).map((lookup) => lookupApi[lookup]()),
      ]);

      setRows(list);

      const lookupMap = {};
      (module.lookups ?? []).forEach((lookup, index) => {
        lookupMap[lookup] = lookupResults[index].map((item) => formatLookupOption(lookup, item));
      });
      setLookupOptions(lookupMap);
    } catch (error) {
      setRows([]);
      setLookupOptions({});
      setPageError(error.message || 'No se pudieron cargar los datos del modulo.');
    }
  }, [module.endpoint, module.lookups]);

  useEffect(() => {
    loadAll();
    setFilterState(initialFilterState(module));
    setSelectedIds([]);
    setSubmitError('');
    setCurrentPage(1);
    setEvaluationOpen(false);
    setEditingEvaluation(null);
    setEvaluationVerification(null);
  }, [loadAll, module]);

  const formData = useMemo(() => toFormData(module, editingRow), [editingRow, module]);

  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        const matchesSearch =
          filterState.search.trim() === '' ||
          module.columns.some((column) => String(row[column] ?? '').toLowerCase().includes(filterState.search.toLowerCase()));

        const matchesFilters = (module.filterControls ?? []).every((control) =>
          matchesControl(row, control, filterState[control.key] ?? 'all'),
        );

        return matchesSearch && matchesFilters;
      }),
    [filterState, module.columns, module.filterControls, rows],
  );

  const verificationSummary = useMemo(() => {
    if (module.key !== 'verificaciones') {
      return null;
    }

    const total = filteredRows.length;
    const aprobadas = filteredRows.filter((row) => row.resultado === 'APROBADO').length;
    const reprobadas = filteredRows.filter((row) => row.resultado === 'REPROBADO').length;
    const pendientes = filteredRows.filter((row) => row.resultado === 'PENDIENTE').length;

    return { total, aprobadas, reprobadas, pendientes };
  }, [filteredRows, module.key]);

  const notesPageSize = 9;
  const totalPages = module.key === 'notas' ? Math.max(1, Math.ceil(filteredRows.length / notesPageSize)) : 1;

  useEffect(() => {
    setCurrentPage(1);
  }, [filterState, rows, module.key]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const visibleRows = useMemo(() => {
    if (module.key !== 'notas') {
      return filteredRows;
    }

    const start = (currentPage - 1) * notesPageSize;
    return filteredRows.slice(start, start + notesPageSize);
  }, [currentPage, filteredRows, module.key]);

  const evaluationVerificationOptions = useMemo(() => toVerificationOption(evaluationVerification), [evaluationVerification]);

  async function handleSave(values) {
    setSubmitting(true);
    setSubmitError('');
    const payload = toPayload(module, values);

    try {
      if (editingRow?.id && !module.disableEdit) {
        await moduleApi.update(module.endpoint, editingRow.id, payload);
      } else {
        await moduleApi.create(module.endpoint, payload);
      }

      setOpen(false);
      setEditingRow(null);
      await loadAll();
    } catch (error) {
      setSubmitError(error.message || 'No se pudo guardar el registro.');
    } finally {
      setSubmitting(false);
    }
  }

  async function openVerificationEvaluation(row) {
    setSubmitError('');
    setPageError('');
    setEvaluationVerification(row);

    try {
      const evaluation = await evaluationApi.byVerificacion(row.id);
      setEditingEvaluation(evaluation);
    } catch (_error) {
      setEditingEvaluation({ idVerificacion: row.id });
    }

    setEvaluationOpen(true);
  }

  async function handleEvaluationSave(values) {
    setEvaluationSubmitting(true);
    setSubmitError('');
    const payload = Object.fromEntries(
      Object.entries({
        ...values,
        idTecnico: editingEvaluation?.id_tecnico ?? user?.id,
        activo: true,
      }).filter(([, value]) => value !== '' && value !== undefined && value !== null),
    );

    try {
      if (editingEvaluation?.id) {
        await evaluationApi.update(editingEvaluation.id, payload);
      } else {
        await evaluationApi.create(payload);
      }

      setEvaluationOpen(false);
      setEditingEvaluation(null);
      setEvaluationVerification(null);
      await loadAll();
    } catch (error) {
      setSubmitError(error.message || 'No se pudo guardar la evaluacion.');
    } finally {
      setEvaluationSubmitting(false);
    }
  }

  useEffect(() => {
    if (module.key !== 'verificaciones') {
      return;
    }

    const openVerificationId = location.state?.openVerificationId;
    if (!openVerificationId || !rows.length) {
      return;
    }

    const targetRow = rows.find((row) => String(row.id) === String(openVerificationId));
    if (!targetRow) {
      navigate(location.pathname, { replace: true, state: {} });
      return;
    }

    openVerificationEvaluation(targetRow);
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.pathname, location.state, module.key, navigate, rows]);

  async function handleDelete(id) {
    try {
      setPageError('');
      await moduleApi.remove(module.endpoint, id);
      await loadAll();
    } catch (error) {
      setPageError(error.message || 'No se pudo eliminar el registro.');
    }
  }

  async function handleBulk(action) {
    if (!selectedIds.length) return;

    try {
      setPageError('');
      await moduleApi.customPut(action.endpoint, selectedIds);
      setSelectedIds([]);
      await loadAll();
    } catch (error) {
      setPageError(error.message || 'No se pudo completar la accion masiva.');
    }
  }

  return (
    <div className={`page-stack module-page module-page-${module.key}`}>
      <section className="page-header">
        <div>
          <h2>{module.title}</h2>
          <p className="page-subtitle">{module.description}</p>
        </div>
      </section>

      {pageError ? <section className="error-banner page-error-banner">{pageError}</section> : null}

      {module.key === 'verificaciones' ? (
        <section className="verification-summary-grid">
          <article className="verification-summary-card blue">
            <div>
              <strong>{verificationSummary?.total ?? 0}</strong>
              <span>Total</span>
            </div>
          </article>
          <article className="verification-summary-card green">
            <div>
              <strong>{verificationSummary?.aprobadas ?? 0}</strong>
              <span>Aprobadas</span>
            </div>
          </article>
          <article className="verification-summary-card red">
            <div>
              <strong>{verificationSummary?.reprobadas ?? 0}</strong>
              <span>Reprobadas</span>
            </div>
          </article>
          <article className="verification-summary-card orange">
            <div>
              <strong>{verificationSummary?.pendientes ?? 0}</strong>
              <span>Pendientes</span>
            </div>
          </article>
        </section>
      ) : null}

      <section className={`toolbar toolbar-card ${module.filterControls?.length ? 'toolbar-rich' : ''} toolbar-${module.key}`}>
        <div className="toolbar-filters">
          <label className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder={module.searchPlaceholder ?? 'Buscar...'}
              value={filterState.search}
              onChange={(event) => setFilterState((current) => ({ ...current, search: event.target.value }))}
            />
          </label>

          {(module.filterControls ?? []).map((control) => {
            const options = getFilterOptions(control, rows, lookupOptions);
            return (
              <label key={control.key} className="toolbar-select">
                <select
                  value={filterState[control.key] ?? 'all'}
                  onChange={(event) => setFilterState((current) => ({ ...current, [control.key]: event.target.value }))}
                >
                  <option value="all">{control.allLabel ?? 'Todos'}</option>
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="toolbar-select-icon" />
              </label>
            );
          })}
        </div>

        <div className="toolbar-actions">
          {(module.filterControls?.length || filterState.search) ? (
            <button type="button" className="ghost-button" onClick={() => setFilterState(initialFilterState(module))}>
              Limpiar filtros
            </button>
          ) : null}
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              setEditingRow(null);
              setSubmitError('');
              setOpen(true);
            }}
          >
            <Plus size={16} />
            Nuevo registro
          </button>
        </div>
      </section>

      {module.bulkActions?.length && selectedIds.length > 0 ? (
        <section className="notes-selection-bar">
          <span>
            {selectedIds.length} seleccionada{selectedIds.length === 1 ? '' : 's'}
          </span>
          <div className="notes-selection-actions">
            {module.bulkActions?.map((action) => (
              <button type="button" key={action.endpoint} className="secondary-button compact" onClick={() => setBulkActionCandidate(action)}>
                {action.label}
              </button>
            ))}
            <button type="button" className="ghost-button compact" onClick={() => setSelectedIds([])}>
              Deseleccionar
            </button>
          </div>
        </section>
      ) : null}

      {module.key === 'notas' ? (
        <DataCards
          rows={visibleRows}
          columns={module.columns}
          variant="notas"
          selectable={Boolean(module.bulkActions?.length)}
          selectedIds={selectedIds}
          onToggleSelect={(id) =>
            setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
          }
          onEdit={(row) => {
            setEditingRow(row);
            setSubmitError('');
            setOpen(true);
          }}
          onDelete={setDeleteCandidate}
          onGeneratePdf={generateNotePdf}
          disableEdit={module.disableEdit}
        />
      ) : (
        <DataTable
          rows={visibleRows}
          columns={module.columns}
          variant={module.key}
          selectable={Boolean(module.bulkActions?.length)}
          selectedIds={selectedIds}
          onToggleSelect={(id) =>
            setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
          }
          onEdit={(row) => {
            if (module.key === 'verificaciones') {
              openVerificationEvaluation(row);
              return;
            }

            setEditingRow(row);
            setSubmitError('');
            setOpen(true);
          }}
          onDelete={setDeleteCandidate}
          disableEdit={module.disableEdit}
        />
      )}

      {module.key === 'notas' && totalPages > 1 ? (
        <section className="pagination-bar">
          <div className="pagination-summary">
            Mostrando {(currentPage - 1) * notesPageSize + 1}-{Math.min(currentPage * notesPageSize, filteredRows.length)} de {filteredRows.length}
          </div>
          <div className="pagination-actions">
            <button type="button" className="ghost-button compact" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1}>
              Anterior
            </button>
            <span className="pagination-indicator">
              Pagina {currentPage} de {totalPages}
            </span>
            <button
              type="button"
              className="ghost-button compact"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        </section>
      ) : null}

      <Modal
        open={open}
        title={editingRow ? module.editTitle ?? `Editar ${module.title}` : module.createTitle ?? 'Nuevo registro'}
        className={module.key === 'notas' ? 'notes-modal' : ''}
        onClose={() => {
          setOpen(false);
          setEditingRow(null);
          setSubmitError('');
        }}
      >
        <EntityForm
          module={module}
          lookupOptions={lookupOptions}
          initialData={formData}
          onSubmit={handleSave}
          submitting={submitting}
          submitError={submitError}
          className={module.key === 'notas' ? 'notes-form' : ''}
          onCancel={() => {
            setOpen(false);
            setEditingRow(null);
            setSubmitError('');
          }}
        />
      </Modal>

      <Modal
        open={evaluationOpen}
        title={editingEvaluation?.id ? 'Editar evaluacion' : 'Registrar evaluacion'}
        onClose={() => {
          setEvaluationOpen(false);
          setEditingEvaluation(null);
          setEvaluationVerification(null);
          setSubmitError('');
        }}
      >
        <EvaluationForm
          initialData={editingEvaluation}
          verificationOptions={evaluationVerificationOptions}
          onSubmit={handleEvaluationSave}
          submitting={evaluationSubmitting}
          onCancel={() => {
            setEvaluationOpen(false);
            setEditingEvaluation(null);
            setEvaluationVerification(null);
            setSubmitError('');
          }}
        />
      </Modal>

      <Modal open={Boolean(deleteCandidate)} title="Confirmar eliminacion" onClose={() => setDeleteCandidate(null)}>
        <div className="confirm-box">
          <p>Seguro que deseas eliminar este registro?</p>
          <div className="confirm-actions">
            <button
              type="button"
              className="primary-button danger-button"
              onClick={async () => {
                await handleDelete(deleteCandidate);
                setDeleteCandidate(null);
              }}
            >
              Eliminar
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(bulkActionCandidate)}
        title="Confirmar accion masiva"
        onClose={() => setBulkActionCandidate(null)}
      >
        <div className="confirm-box">
          <p>
            Seguro que deseas aplicar "{bulkActionCandidate?.label}" sobre {selectedIds.length} registro
            {selectedIds.length === 1 ? '' : 's'}?
          </p>
          <div className="confirm-actions">
            <button type="button" className="ghost-button" onClick={() => setBulkActionCandidate(null)}>
              Cancelar
            </button>
            <button
              type="button"
              className="primary-button danger-button"
              onClick={async () => {
                await handleBulk(bulkActionCandidate);
                setBulkActionCandidate(null);
              }}
            >
              Confirmar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
