import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

const PHONE_FIELDS = new Set(['telefono', 'telefonoAlternativo', 'telAlternativo']);
const MONEY_FIELDS = new Set(['anticipo', 'costo', 'precio', 'multa']);
const CUSTOM_FORMAT_FIELDS = new Set(['rfc', 'serie', 'placa', 'razonSocial', ...PHONE_FIELDS]);

function hasUpToTwoDecimals(value) {
  return /^\d+(\.\d{1,2})?$/.test(String(value));
}

function toDateValue(value) {
  if (!value) {
    return null;
  }

  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function sanitizeValue(value, field) {
  if (typeof value !== 'string') {
    return value;
  }

  let nextValue = value;

  if (field.uppercase) {
    nextValue = nextValue.toUpperCase();
  }

  if (field.maxLength) {
    nextValue = nextValue.slice(0, field.maxLength);
  }

  return nextValue;
}

function fieldSchema(field, initialData) {
  const stringSchema = z.string();

  if (field.type === 'number') {
    const numberSchema = z.union([z.string(), z.number()]).transform((value) => {
      if (value === '' || value === null || value === undefined) {
        return undefined;
      }
      return Number(value);
    });

    let schema = numberSchema.refine((value) => value === undefined || !Number.isNaN(value), 'Ingresa un numero valido');
    const minValue = field.min ?? (MONEY_FIELDS.has(field.name) ? 0 : undefined);

    if (minValue !== undefined) {
      schema = schema.refine(
        (value) => value === undefined || value >= minValue,
        minValue === 0 ? 'Debe ser mayor o igual a 0' : `Debe ser mayor o igual a ${minValue}`,
      );
    }

    if (MONEY_FIELDS.has(field.name)) {
      schema = schema.refine(
        (value) => value === undefined || hasUpToTwoDecimals(value),
        'Solo se permiten numeros con hasta dos decimales',
      );
    }

    return field.required
      ? schema.refine((value) => value !== undefined, 'Campo requerido')
      : schema.optional();
  }

  if (field.type === 'switch') {
    return z.boolean().optional();
  }

  if (field.name === 'contrasena' && initialData?.id) {
    return z.string().optional();
  }

  if (field.type === 'email') {
    const emailSchema = z
      .string()
      .refine((value) => value === value.trim(), 'No se permiten espacios al inicio o al final')
      .refine((value) => !/\s/.test(value), 'No se permiten espacios en el correo')
      .email('Debe tener formato usuario@dominio.com');

    return field.required
      ? emailSchema.min(1, 'Campo requerido')
      : z
          .string()
          .refine((value) => value === '' || value === value.trim(), 'No se permiten espacios al inicio o al final')
          .refine((value) => value === '' || !/\s/.test(value), 'No se permiten espacios en el correo')
          .refine((value) => value === '' || z.string().email().safeParse(value).success, 'Debe tener formato usuario@dominio.com')
          .optional();
  }

  let textSchema = stringSchema;

  if (PHONE_FIELDS.has(field.name)) {
    textSchema = textSchema.refine(
      (value) => value === '' || /^\d{10}$/.test(value),
      'Debe tener exactamente 10 digitos, sin espacios, guiones ni parentesis',
    );
  } else if (field.digitsOnly) {
    textSchema = textSchema.refine((value) => value === '' || /^\d+$/.test(value), 'Solo se permiten numeros');
  }

  if (field.lettersOnly) {
    textSchema = textSchema.refine(
      (value) => value === '' || /^[\p{L}\s]+$/u.test(value),
      'Solo se permiten letras, espacios y acentos',
    );
  }

  if (field.name === 'rfc') {
    textSchema = textSchema.refine(
      (value) => value === '' || /^[A-Z0-9]{12,13}$/.test(value),
      'El RFC debe tener 12 o 13 caracteres con solo letras mayusculas y numeros',
    );
  }

  if (field.name === 'serie') {
    textSchema = textSchema.refine(
      (value) => value === '' || /^[A-HJ-NPR-Z0-9]{17}$/.test(value),
      'La serie debe tener 17 caracteres alfanumericos y no puede incluir I, O o Q',
    );
  }

  if (field.name === 'placa') {
    textSchema = textSchema.refine(
      (value) => value === '' || /^[A-Z0-9-]{7,9}$/.test(value),
      'La placa debe tener entre 7 y 9 caracteres, usando solo mayusculas, numeros y guiones',
    );
  }

  if (field.name === 'razonSocial') {
    textSchema = textSchema.refine(
      (value) => value === '' || /^[\p{L}\d\s.,]+$/u.test(value),
      'La razon social solo permite letras, numeros, espacios, puntos y comas',
    );
  }

  if (field.exactLength && !CUSTOM_FORMAT_FIELDS.has(field.name)) {
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

function buildSchema(module, initialData) {
  return z
    .object(
      module.fields.reduce((shape, field) => {
        shape[field.name] = fieldSchema(field, initialData);
        return shape;
      }, {}),
    )
    .superRefine((values, context) => {
      if (module.key === 'notas') {
        const fechaContrato = toDateValue(values.fechaContrato);
        const fechaVigencia = toDateValue(values.fechaVigencia);

        if (fechaContrato && fechaVigencia && fechaVigencia < fechaContrato) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['fechaVigencia'],
            message: 'La fecha de vigencia debe ser mayor o igual a la fecha de creacion/contrato',
          });
        }
      }

      if (values.fechaPedido && values.fechaEnvio) {
        const fechaPedido = toDateValue(values.fechaPedido);
        const fechaEnvio = toDateValue(values.fechaEnvio);

        if (fechaPedido && fechaEnvio && fechaEnvio < fechaPedido) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['fechaEnvio'],
            message: 'La fecha de envio no puede ser anterior a la fecha de pedido',
          });
        }
      }
    });
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
  const schema = useMemo(() => buildSchema(module, initialData), [initialData, module]);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues(module.fields, initialData),
    mode: 'onChange',
    reValidateMode: 'onChange',
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
            min: field.type === 'number' ? field.min : undefined,
            step: field.type === 'number' ? field.step ?? 'any' : undefined,
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
