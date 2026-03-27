import { http } from './http.js';

export const authApi = {
  login: ({ email, password }) => http.post('/login', { email, password }),
};

export const lookupApi = {
  clientes: () => http.get('/clientes'),
  usuarios: () => http.get('/usuarios'),
  vehiculos: () => http.get('/vehiculos'),
  cedis: () => http.get('/cedis'),
  verificentros: () => http.get('/verificentros'),
  notas: () => http.get('/notas'),
  regiones: () => http.get('/regiones'),
};

export const dashboardApi = {
  stats: () => http.get('/stats'),
  verificaciones: () => http.get('/verificaciones'),
};

export const reportApi = {
  list: (filters = {}) => {
    const query = new URLSearchParams(
      Object.entries(filters)
        .filter(([, value]) => value !== undefined && value !== null && value !== '' && value !== 'all')
        .map(([key, value]) => [key, String(value)]),
    );
    const suffix = query.toString() ? `?${query.toString()}` : '';
    return http.get(`/reportes${suffix}`);
  },
};

export const moduleApi = {
  list: (endpoint) => http.get(endpoint),
  create: (endpoint, payload) => http.post(endpoint, payload),
  update: (endpoint, id, payload) => http.put(`${endpoint}/${id}`, payload),
  remove: (endpoint, id) => http.delete(`${endpoint}/${id}`),
  customPut: (endpoint, payload) => http.put(endpoint, payload),
};

export const evaluationApi = {
  create: (payload) => http.post('/evaluaciones', payload),
  update: (id, payload) => http.put(`/evaluaciones/${id}`, payload),
  byVehiculo: (vehiculoId) => http.absoluteGet(`/movil/evaluaciones/vehiculo/${vehiculoId}`),
  byTecnico: (tecnicoId) => http.absoluteGet(`/movil/evaluaciones/tecnico/${tecnicoId}`),
  byVerificacion: (verificacionId) => http.absoluteGet(`/movil/evaluaciones/verificacion/${verificacionId}`),
};
