import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

function fieldSchema(field, initialData) {
  let schema = z.string();

  if (field.type === 'number') {
    const numberSchema = z.union([z.string(), z.number()]).transform((value) => {
      if (value === '') {
        return undefined;
      }
      return Number(value);
    });

    return field.required
      ? numberSchema.refine((value) => value !== undefined && !Number.isNaN(value), 'Campo requerido')
      : numberSchema.optional();
  }

  if (field.type === 'switch') {
    return z.boolean().optional();
  }

  if (field.name === 'contrasena' && initialData?.id) {
    return z.string().optional();
  }

  if (!field.required) {
    return schema.optional();
  }

  if (field.type === 'email') {
    return z.string().min(1, 'Campo requerido').email('Correo invalido');
  }

  return z.string().min(field.min ?? 1, 'Campo requerido');
}

function buildSchema(fields, initialData) {
  return z.object(
    fields.reduce((shape, field) => {
      shape[field.name] = fieldSchema(field, initialData);
      return shape;
    }, {}),
  );
}

function defaultValues(fields, initialData) {
  return fields.reduce((accumulator, field) => {
    accumulator[field.name] = initialData?.[field.name] ?? (field.type === 'switch' ? true : '');
    return accumulator;
  }, {});
}

export function EntityForm({ module, lookupOptions, initialData, onSubmit, submitting, className = '', onCancel }) {
  const schema = useMemo(() => buildSchema(module.fields, initialData), [initialData, module.fields]);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues(module.fields, initialData),
  });
  const watchedValues = useWatch({ control });

  useEffect(() => {
    reset(defaultValues(module.fields, initialData));
  }, [initialData, module.fields, reset]);

  return (
    <form
      className={`entity-form ${className}`.trim()}
      onSubmit={handleSubmit((values) => {
        onSubmit(values);
      })}
    >
      <div className="form-grid">
        {module.fields.map((field) => {
          const options = field.source ? lookupOptions[field.source] ?? [] : field.options ?? [];
          const switchValue = field.type === 'switch' ? watchedValues?.[field.name] : undefined;

          return (
            <label
              key={field.name}
              className={`${field.type === 'textarea' ? 'field span-2' : 'field'} ${field.type === 'switch' ? 'field-switch' : ''}`.trim()}
            >
              <span>{field.label}</span>
              {field.type === 'select' || field.type === 'lookup' ? (
                <span className="select-shell">
                  <select {...register(field.name)}>
                    <option value="">Selecciona una opcion</option>
                    {options.map((option) => {
                      const value = typeof option === 'string' ? option : option.value;
                      const label = typeof option === 'string' ? option : option.label;
                      return (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown size={16} className="select-shell-icon" />
                </span>
              ) : field.type === 'textarea' ? (
                <textarea rows="4" {...register(field.name)} />
              ) : field.type === 'switch' ? (
                <span className="switch-control">
                  <input type="checkbox" {...register(field.name)} />
                  <span>{switchValue ? 'Activo' : 'Inactivo'}</span>
                </span>
              ) : (
                <input type={field.type === 'password' ? 'password' : field.type} {...register(field.name)} />
              )}
              {errors[field.name] ? <small>{errors[field.name].message}</small> : null}
            </label>
          );
        })}
      </div>
      <div className="form-actions">
        {onCancel ? (
          <button type="button" className="ghost-button" onClick={onCancel}>
            Cancelar
          </button>
        ) : null}
        <button type="submit" className="primary-button" disabled={submitting}>
          {submitting ? 'Guardando...' : initialData?.id ? module.updateLabel ?? 'Actualizar' : module.saveLabel ?? 'Guardar'}
        </button>
      </div>
    </form>
  );
}
