import { useEffect, useMemo, useState } from 'react';
import { evaluationSections, wheelMetrics } from '../../config/evaluationFields.js';

const wheelLayout = [
  { key: 'front-left', label: 'Delantera izquierda' },
  { key: 'front-right', label: 'Delantera derecha' },
  { key: 'rear-left-1', label: 'Trasera izquierda 1' },
  { key: 'rear-left-2', label: 'Trasera izquierda 2' },
  { key: 'rear-right-1', label: 'Trasera derecha 1' },
  { key: 'rear-right-2', label: 'Trasera derecha 2' },
];

function buildDefaults(initialData) {
  const defaults = { comentariosTecnico: '' };

  evaluationSections.forEach((section) => {
    section.fields.forEach((field) => {
      defaults[field.name] = initialData?.[field.name] ?? '';
    });
  });

  Object.values(wheelMetrics)
    .flat()
    .forEach((field) => {
      defaults[field.name] = initialData?.[field.name] ?? '';
    });

  return defaults;
}

async function compressImage(file) {
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });

  const maxEdge = 1280;
  const ratio = Math.min(1, maxEdge / Math.max(image.width, image.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(image.width * ratio);
  canvas.height = Math.round(image.height * ratio);
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.72);
}

function WheelMetricBlock({ title, fields, values, onChange }) {
  return (
    <section className="wheel-metric-block">
      <div className="wheel-metric-head">
        <div>
          <p className="eyebrow">Llantas</p>
          <h3>{title}</h3>
        </div>
        <div className="wheel-diagram" aria-hidden="true">
          {wheelLayout.map((wheel) => (
            <div key={wheel.key} className="wheel-diagram-item">
              <span className="wheel-diagram-circle" />
              <small>{wheel.label}</small>
            </div>
          ))}
        </div>
      </div>
      <div className="wheel-metric-grid">
        {fields.map((field) => (
          <label key={field.name} className="field">
            <span>{field.label}</span>
            {field.type === 'select' ? (
              <select value={values[field.name] ?? ''} onChange={(event) => onChange(field.name, event.target.value)}>
                <option value="">Selecciona una opcion</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="number"
                min={field.min ?? 0}
                step={field.step ?? 1}
                value={values[field.name] ?? ''}
                onChange={(event) => onChange(field.name, event.target.value)}
              />
            )}
            {field.error ? <small>{field.error}</small> : null}
          </label>
        ))}
      </div>
    </section>
  );
}

const pressureFieldNames = new Set(wheelMetrics.pressure.map((field) => field.name));

function validateEvaluation(values, verificationId) {
  const nextErrors = {};

  if (!verificationId) {
    nextErrors.verificationId = 'Selecciona una verificacion.';
  }

  Object.entries(values).forEach(([name, rawValue]) => {
    if (rawValue === '' || rawValue === null || rawValue === undefined) {
      return;
    }

    if (typeof rawValue === 'string' && rawValue.startsWith('data:image')) {
      return;
    }

    const numericValue = Number(rawValue);
    if (Number.isNaN(numericValue)) {
      return;
    }

    if (numericValue < 0) {
      nextErrors[name] = 'Debe ser mayor o igual a 0.';
      return;
    }

    if (pressureFieldNames.has(name) && (numericValue < 80 || numericValue > 120)) {
      nextErrors[name] = 'La presion debe estar entre 80 y 120 PSI.';
    }
  });

  return nextErrors;
}

export function EvaluationForm({ initialData, verificationOptions, onSubmit, submitting, onCancel }) {
  const [values, setValues] = useState(() => buildDefaults(initialData));
  const [verificationId, setVerificationId] = useState(initialData?.idVerificacion ?? initialData?.id_verificacion ?? '');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues(buildDefaults(initialData));
    setVerificationId(initialData?.idVerificacion ?? initialData?.id_verificacion ?? '');
    setErrors({});
  }, [initialData]);

  const evidencePreview = useMemo(
    () => ['evidencia1', 'evidencia2', 'evidencia3', 'evidencia4', 'evidencia5'].filter((key) => values[key]),
    [values],
  );

  function updateValue(name, nextValue) {
    const nextValues = { ...values, [name]: nextValue };
    setValues(nextValues);
    setErrors((current) => {
      const nextErrors = { ...current };
      const fieldErrors = validateEvaluation(nextValues, verificationId);
      if (fieldErrors[name]) {
        nextErrors[name] = fieldErrors[name];
      } else {
        delete nextErrors[name];
      }
      return nextErrors;
    });
  }

  async function handleFile(name, file) {
    if (!file) return;
    updateValue(name, await compressImage(file));
  }

  function submit(event) {
    event.preventDefault();
    const nextErrors = validateEvaluation(values, verificationId);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit({
      ...values,
      idVerificacion: Number(verificationId),
    });
  }

  return (
    <form className="evaluation-form" onSubmit={submit}>
      {Object.keys(errors).length ? <div className="error-banner form-error-banner">Corrige los campos marcados antes de guardar.</div> : null}
      <section className="evaluation-section">
        <div className="evaluation-section-head">
          <div>
            <p className="eyebrow">Evaluacion</p>
            <h3>Checklist tecnico</h3>
          </div>
        </div>
        <div className="form-grid">
          <label className="field">
            <span>Verificacion</span>
            <select
              value={verificationId}
              onChange={(event) => {
                setVerificationId(event.target.value);
                setErrors((current) => {
                  const nextErrors = { ...current };
                  const fieldErrors = validateEvaluation(values, event.target.value);
                  if (fieldErrors.verificationId) {
                    nextErrors.verificationId = fieldErrors.verificationId;
                  } else {
                    delete nextErrors.verificationId;
                  }
                  return nextErrors;
                });
              }}
              required
            >
              <option value="">Selecciona una verificacion</option>
              {verificationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.verificationId ? <small>{errors.verificationId}</small> : null}
          </label>
        </div>
      </section>

      {evaluationSections.map((section) => (
        <section key={section.key} className="evaluation-section">
          <div className="evaluation-section-head">
            <div>
              <p className="eyebrow">Checklist</p>
              <h3>{section.title}</h3>
            </div>
          </div>
          <div className="form-grid">
            {section.fields.map((field) => (
              <label key={field.name} className={`field ${field.type === 'textarea' ? 'span-2' : ''}`.trim()}>
                <span>{field.label}</span>
                {field.type === 'select' ? (
                  <select value={values[field.name] ?? ''} onChange={(event) => updateValue(field.name, event.target.value)}>
                    <option value="">Selecciona una opcion</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea rows="4" value={values[field.name] ?? ''} onChange={(event) => updateValue(field.name, event.target.value)} />
                ) : field.type === 'file' ? (
                  <input type="file" accept="image/*" onChange={(event) => handleFile(field.name, event.target.files?.[0])} />
                ) : (
                  <input
                    type="number"
                    min={field.min ?? 0}
                    step={field.step ?? 1}
                    value={values[field.name] ?? ''}
                    onChange={(event) => updateValue(field.name, event.target.value)}
                  />
                )}
                {errors[field.name] ? <small>{errors[field.name]}</small> : null}
              </label>
            ))}
          </div>
        </section>
      ))}

      <WheelMetricBlock
        title="Presion de llantas"
        fields={wheelMetrics.pressure.map((field) => ({ ...field, error: errors[field.name] }))}
        values={values}
        onChange={updateValue}
      />
      <WheelMetricBlock
        title="Profundidad de llantas"
        fields={wheelMetrics.depth.map((field) => ({ ...field, error: errors[field.name] }))}
        values={values}
        onChange={updateValue}
      />
      <WheelMetricBlock
        title="Birlos"
        fields={wheelMetrics.birlos.map((field) => ({ ...field, error: errors[field.name] }))}
        values={values}
        onChange={updateValue}
      />
      <WheelMetricBlock
        title="Tuercas"
        fields={wheelMetrics.nuts.map((field) => ({ ...field, error: errors[field.name] }))}
        values={values}
        onChange={updateValue}
      />

      {evidencePreview.length ? (
        <section className="evaluation-section">
          <div className="evaluation-section-head">
            <div>
              <p className="eyebrow">Previsualizacion</p>
              <h3>Evidencias cargadas</h3>
            </div>
          </div>
          <div className="evidence-grid">
            {evidencePreview.map((key) => (
              <figure key={key} className="evidence-card">
                <img src={values[key]} alt={key} />
                <figcaption>{key}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      <div className="form-actions">
        <button type="button" className="ghost-button" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="primary-button" disabled={submitting || !verificationId}>
          {submitting ? 'Guardando...' : initialData?.id ? 'Actualizar evaluacion' : 'Registrar evaluacion'}
        </button>
      </div>
    </form>
  );
}
