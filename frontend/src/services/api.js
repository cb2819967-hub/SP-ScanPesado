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
  list: () => http.get('/reportes'),
};

export const moduleApi = {
  list: (endpoint) => http.get(endpoint),
  create: (endpoint, payload) => http.post(endpoint, payload),
  update: (endpoint, id, payload) => http.put(`${endpoint}/${id}`, payload),
  remove: (endpoint, id) => http.delete(`${endpoint}/${id}`),
  customPut: (endpoint, payload) => http.put(endpoint, payload),
};
