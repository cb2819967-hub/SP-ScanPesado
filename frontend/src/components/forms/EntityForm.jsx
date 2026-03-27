import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

function sanitizeValue(value, field) {
  if (typeof value !== 'string') {
    return value;
  }

  let nextValue = value;

  if (field.digitsOnly) {
    nextValue = nextValue.replace(/\D/g, '');
  }

  if (field.uppercase) {
    nextValue = nextValue.toUpperCase();
  }

  if (field.lettersOnly) {
    nextValue = nextValue.replace(/[^\p{L}\s]/gu, '');
    nextValue = nextValue.replace(/\s{2,}/g, ' ');
  }

  if (field.maxLength) {
    nextValue = nextValue.slice(0, field.maxLength);
  }

  return nextValue;
}

function fieldSchema(field, initialData) {
  const stringSchema = z.string().trim();

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

  if (field.type === 'email') {
    const emailSchema = z.string().trim().min(1, 'Campo requerido').email('Correo invalido');
    return field.required
      ? emailSchema.min(1, 'Campo requerido')
      : z
          .string()
          .trim()
          .refine((value) => value === '' || z.string().email().safeParse(value).success, 'Correo invalido')
          .optional();
  }

  let textSchema = stringSchema;

  if (field.digitsOnly) {
    textSchema = textSchema.refine((value) => value === '' || /^\d+$/.test(value), 'Solo se permiten numeros');
  }

  if (field.lettersOnly) {
    textSchema = textSchema.refine(
      (value) => value === '' || /^[\p{L}\s]+$/u.test(value),
      'Solo se permiten letras y espacios',
    );
  }

  if (field.exactLength) {
    textSchema = textSchema.length(field.exactLength, `Debe tener ${field.exactLength} caracteres`);
  } else {
    if (field.minLength) {
      textSchema = textSchema.min(field.minLength, `Debe tener al menos ${field.minLength} caracteres`);
    }
    if (field.maxLength) {
      textSchema = textSchema.max(field.maxLength, `Debe tener maximo ${field.maxLength} caracteres`);
    }
  }

  if (!field.required) {
    return z.preprocess(
      (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
      textSchema.optional(),
    );
  }

  return textSchema.min(field.min ?? 1, 'Campo requerido');
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

export function EntityForm({
  module,
  lookupOptions,
  initialData,
  onSubmit,
  submitting,
  submitError = '',
  className = '',
  onCancel,
}) {
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
      {submitError ? <div className="error-banner form-error-banner">{submitError}</div> : null}
      <div className="form-grid">
        {module.fields.map((field) => {
          const options = field.source ? lookupOptions[field.source] ?? [] : field.options ?? [];
          const switchValue = field.type === 'switch' ? watchedValues?.[field.name] : undefined;
          const registerOptions =
            field.type === 'switch'
              ? {}
              : {
                  setValueAs: (value) => sanitizeValue(value, field),
                };
          const inputProps = {
            maxLength: field.maxLength ?? field.exactLength,
            inputMode: field.digitsOnly ? 'numeric' : field.lettersOnly ? 'text' : undefined,
          };

          return (
            <label
              key={field.name}
              className={`${field.type === 'textarea' ? 'field span-2' : 'field'} ${field.type === 'switch' ? 'field-switch' : ''}`.trim()}
            >
              <span>{field.label}</span>
              {field.type === 'select' || field.type === 'lookup' ? (
                <span className="select-shell">
                  <select {...register(field.name, registerOptions)}>
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
                <textarea rows="4" {...inputProps} {...register(field.name, registerOptions)} />
              ) : field.type === 'switch' ? (
                <span className="switch-control">
                  <input type="checkbox" {...register(field.name)} />
                  <span>{switchValue ? 'Activo' : 'Inactivo'}</span>
                </span>
              ) : (
                <input type={field.type === 'password' ? 'password' : field.type} {...inputProps} {...register(field.name, registerOptions)} />
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
