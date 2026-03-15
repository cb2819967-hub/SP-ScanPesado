/**
 * API CLIENT - Funciones para comunicarse con el servidor Oracle
 */

// base URL para API, usa el mismo host/puerto desde el que se sirve la página
// Actualizado para apuntar a Spring Boot en el puerto 8080
const isDev = location.protocol === 'file:' || location.port === '5500';
const API_BASE = isDev 
  ? 'http://192.168.0.16:8080/api' 
  : `${location.origin}/api`;

// ════════════════════════════════════════════════════════════════
// AUTENTICACIÓN
// ════════════════════════════════════════════════════════════════

/**
 * Login con correo y contraseña
 * @param {string} email - Correo del usuario
 * @param {string} password - Contraseña
 * @returns {Promise<{id, nombre, rol, correo}>}
 */
async function apiLogin(email, password) {
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login fallido');
    }

    const user = await res.json();
    // Guardar en sessionStorage para uso posterior
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  } catch (err) {
    console.error('❌ Error en apiLogin:', err.message);
    throw err;
  }
}

// ════════════════════════════════════════════════════════════════
// CLIENTES
// ════════════════════════════════════════════════════════════════

/**
 * Obtiene lista de clientes
 * @returns {Promise<Array>}
 */
async function apiGetClientes() {
  try {
    const res = await fetch(`${API_BASE}/clientes`);
    if (!res.ok) throw new Error('Error al obtener clientes');
    return await res.json();
  } catch (err) {
    console.error('❌ Error en apiGetClientes:', err.message);
    return [];
  }
}

// ════════════════════════════════════════════════════════════════
// USUARIOS
// ════════════════════════════════════════════════════════════════

/**
 * Obtiene lista de usuarios
 * @returns {Promise<Array>}
 */
async function apiGetUsuarios() {
  try {
    const res = await fetch(`${API_BASE}/usuarios`);
    if (!res.ok) throw new Error('Error al obtener usuarios');
    return await res.json();
  } catch (err) {
    console.error('❌ Error en apiGetUsuarios:', err.message);
    return [];
  }
}

// ════════════════════════════════════════════════════════════════
// VERIFICACIONES / INSPECCIONES
// ════════════════════════════════════════════════════════════════

/**
 * Obtiene lista de verificaciones recientes
 * @returns {Promise<Array>}
 */
async function apiGetVerificaciones() {
  try {
    const res = await fetch(`${API_BASE}/verificaciones`);
    if (!res.ok) throw new Error('Error al obtener verificaciones');
    return await res.json();
  } catch (err) {
    console.error('❌ Error en apiGetVerificaciones:', err.message);
    return [];
  }
}

// ════════════════════════════════════════════════════════════════
// VEHÍCULOS
// ════════════════════════════════════════════════════════════════

/**
 * Obtiene lista de vehículos
 * @returns {Promise<Array>}
 */
async function apiGetVehiculos() {
  try {
    const res = await fetch(`${API_BASE}/vehiculos`);
    if (!res.ok) throw new Error('Error al obtener vehiculos');
    return await res.json();
  } catch (err) {
    console.error('❌ Error en apiGetVehiculos:', err.message);
    return [];
  }
}

// ════════════════════════════════════════════════════════════════
// CEDIS
// ════════════════════════════════════════════════════════════════

async function apiGetCedis() {
  try {
    const res = await fetch(`${API_BASE}/cedis`);
    if (!res.ok) throw new Error('Error al obtener cedis');
    return await res.json();
  } catch (err) {
    console.error('❌ Error en apiGetCedis:', err.message);
    return [];
  }
}

// ════════════════════════════════════════════════════════════════
// VERIFICENTROS
// ════════════════════════════════════════════════════════════════

async function apiGetVerificentros() {
  try {
    const res = await fetch(`${API_BASE}/verificentros`);
    if (!res.ok) throw new Error('Error al obtener verificentros');
    return await res.json();
  } catch (err) {
    console.error('❌ Error en apiGetVerificentros:', err.message);
    return [];
  }
}

// ════════════════════════════════════════════════════════════════
// ESTADÍSTICAS / DASHBOARD
// ════════════════════════════════════════════════════════════════

/**
 * Obtiene estadísticas para el dashboard
 * @returns {Promise<{clientes, vehiculos, notas, verificaciones}>}
 */
async function apiGetStats() {
  try {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Error al obtener estadísticas');
    return await res.json();
  } catch (err) {
    console.error('❌ Error en apiGetStats:', err.message);
    return { clientes: 0, vehiculos: 0, notas: 0, verificaciones: 0 };
  }
}

// ════════════════════════════════════════════════════════════════
// UTILIDADES
// ════════════════════════════════════════════════════════════════

/**
 * Obtiene el usuario actual de la sesión
 * @returns {Object|null}
 */
function getCurrentUser() {
  const user = sessionStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
}

/**
 * Limpia la sesión del usuario actual
 */
function clearSession() {
  sessionStorage.removeItem('currentUser');
}