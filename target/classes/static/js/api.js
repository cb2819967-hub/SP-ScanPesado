/**
 * API CLIENT - Funciones para comunicarse con el servidor Oracle
 */

// base URL para API, usa el mismo host/puerto desde el que se sirve la página
// Actualizado para apuntar a Spring Boot en el puerto 8080
const isDev = location.protocol === 'file:' || location.port === '5500';
const API_BASE = isDev
    ? 'http://localhost:8080/api'
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

/**
 * Crea un nuevo cliente
 * @param {Object} cliente - Datos del cliente
 * @returns {Promise<Object>}
 */
async function apiCreateCliente(cliente) {
    try {
        const res = await fetch(`${API_BASE}/clientes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cliente)
        });
        if (!res.ok) throw new Error('Error al crear cliente');
        return await res.json();
    } catch (err) {
        console.error('❌ Error en apiCreateCliente:', err.message);
        throw err;
    }
}

/**
 * Actualiza un cliente
 * @param {number} id - ID del cliente
 * @param {Object} cliente - Datos actualizados
 * @returns {Promise<Object>}
 */
async function apiUpdateCliente(id, cliente) {
    try {
        const res = await fetch(`${API_BASE}/clientes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cliente)
        });
        if (!res.ok) throw new Error('Error al actualizar cliente');
        return await res.json();
    } catch (err) {
        console.error('❌ Error en apiUpdateCliente:', err.message);
        throw err;
    }
}

/**
 * Elimina un cliente (borrado lógico)
 * @param {number} id - ID del cliente
 * @returns {Promise<void>}
 */
async function apiDeleteCliente(id) {
    try {
        const res = await fetch(`${API_BASE}/clientes/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Error al eliminar cliente');
    } catch (err) {
        console.error('❌ Error en apiDeleteCliente:', err.message);
        throw err;
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

/**
 * Crea un nuevo usuario
 * @param {Object} usuario - Datos del usuario
 * @returns {Promise<Object>}
 */
async function apiCreateUsuario(usuario) {
    try {
        const res = await fetch(`${API_BASE}/usuarios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        });
        if (!res.ok) throw new Error('Error al crear usuario');
        return await res.json();
    } catch (err) {
        console.error('❌ Error en apiCreateUsuario:', err.message);
        throw err;
    }
}

/**
 * Actualiza un usuario
 * @param {number} id - ID del usuario
 * @param {Object} usuario - Datos actualizados
 * @returns {Promise<Object>}
 */
async function apiUpdateUsuario(id, usuario) {
    try {
        const res = await fetch(`${API_BASE}/usuarios/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        });
        if (!res.ok) throw new Error('Error al actualizar usuario');
        return await res.json();
    } catch (err) {
        console.error('❌ Error en apiUpdateUsuario:', err.message);
        throw err;
    }
}

/**
 * Elimina un usuario (borrado lógico)
 * @param {number} id - ID del usuario
 * @returns {Promise<void>}
 */
async function apiDeleteUsuario(id) {
    try {
        const res = await fetch(`${API_BASE}/usuarios/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Error al eliminar usuario');
    } catch (err) {
        console.error('❌ Error en apiDeleteUsuario:', err.message);
        throw err;
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

/**
 * Crea una nueva verificación
 * @param {Object} verificacion - Datos de la verificación
 * @returns {Promise<Object>}
 */
async function apiCreateVerificacion(verificacion) {
    try {
        const res = await fetch(`${API_BASE}/verificaciones`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(verificacion)
        });
        if (!res.ok) throw new Error('Error al crear verificación');
        return await res.json();
    } catch (err) {
        console.error('❌ Error en apiCreateVerificacion:', err.message);
        throw err;
    }
}

/**
 * Actualiza una verificación
 * @param {number} id - ID de la verificación
 * @param {Object} verificacion - Datos actualizados
 * @returns {Promise<Object>}
 */
async function apiUpdateVerificacion(id, verificacion) {
    try {
        const res = await fetch(`${API_BASE}/verificaciones/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(verificacion)
        });
        if (!res.ok) throw new Error('Error al actualizar verificación');
        return await res.json();
    } catch (err) {
        console.error('❌ Error en apiUpdateVerificacion:', err.message);
        throw err;
    }
}

/**
 * Elimina una verificación (borrado lógico)
 * @param {number} id - ID de la verificación
 * @returns {Promise<void>}
 */
async function apiDeleteVerificacion(id) {
    try {
        const res = await fetch(`${API_BASE}/verificaciones/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Error al eliminar verificación');
    } catch (err) {
        console.error('❌ Error en apiDeleteVerificacion:', err.message);
        throw err;
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

/**
 * Crea un nuevo vehículo
 * @param {Object} vehiculo - Datos del vehículo
 * @returns {Promise<Object>}
 */
async function apiCreateVehiculo(vehiculo) {
    try {
        const res = await fetch(`${API_BASE}/vehiculos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vehiculo)
        });
        if (!res.ok) throw new Error('Error al crear vehículo');
        return await res.json();
    } catch (err) {
        console.error('❌ Error en apiCreateVehiculo:', err.message);
        throw err;
    }
}

/**
 * Actualiza un vehículo
 * @param {number} id - ID del vehículo
 * @param {Object} vehiculo - Datos actualizados
 * @returns {Promise<Object>}
 */
async function apiUpdateVehiculo(id, vehiculo) {
    try {
        const res = await fetch(`${API_BASE}/vehiculos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vehiculo)
        });
        if (!res.ok) throw new Error('Error al actualizar vehículo');
        return await res.json();
    } catch (err) {
        console.error('❌ Error en apiUpdateVehiculo:', err.message);
        throw err;
    }
}

/**
 * Elimina un vehículo (borrado lógico)
 * @param {number} id - ID del vehículo
 * @returns {Promise<void>}
 */
async function apiDeleteVehiculo(id) {
    try {
        const res = await fetch(`${API_BASE}/vehiculos/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Error al eliminar vehículo');
    } catch (err) {
        console.error('❌ Error en apiDeleteVehiculo:', err.message);
        throw err;
    }
}

// ════════════════════════════════════════════════════════════════
// CEDIS
// ════════════════════════════════════════════════════════════════

/**
 * Obtiene lista de CEDIS
 * @returns {Promise<Array>}
 */
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

/**
 * Crea un nuevo CEDIS
 * @param {Object} cedis - Datos del CEDIS
 * @returns {Promise<Object>}
 */
async function apiCreateCedis(cedis) {
    try {
        const res = await fetch(`${API_BASE}/cedis`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cedis)
        });
        if (!res.ok) throw new Error('Error al crear CEDIS');
        return await res.json();
    } catch (err) {
        console.error('❌ Error en apiCreateCedis:', err.message);
        throw err;
    }
}

/**
 * Actualiza un CEDIS
 * @param {number} id - ID del CEDIS
 * @param {Object} cedis - Datos actualizados
 * @returns {Promise<Object>}
 */
async function apiUpdateCedis(id, cedis) {
    try {
        const res = await fetch(`${API_BASE}/cedis/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cedis)
        });
        if (!res.ok) throw new Error('Error al actualizar CEDIS');
        return await res.json();
    } catch (err) {
        console.error('❌ Error en apiUpdateCedis:', err.message);
        throw err;
    }
}

/**
 * Elimina un CEDIS (borrado lógico)
 * @param {number} id - ID del CEDIS
 * @returns {Promise<void>}
 */
async function apiDeleteCedis(id) {
    try {
        const res = await fetch(`${API_BASE}/cedis/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Error al eliminar CEDIS');
    } catch (err) {
        console.error('❌ Error en apiDeleteCedis:', err.message);
        throw err;
    }
}

// ════════════════════════════════════════════════════════════════
// VERIFICENTROS
// ════════════════════════════════════════════════════════════════

/**
 * Obtiene lista de verificentros
 * @returns {Promise<Array>}
 */
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

/**
 * Crea un nuevo verificentro
 * @param {Object} verificentro - Datos del verificentro
 * @returns {Promise<Object>}
 */
async function apiCreateVerificentro(verificentro) {
    try {
        const res = await fetch(`${API_BASE}/verificentros`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(verificentro)
        });
        if (!res.ok) throw new Error('Error al crear verificentro');
        return await res.json();
    } catch (err) {
        console.error('❌ Error en apiCreateVerificentro:', err.message);
        throw err;
    }
}

/**
 * Actualiza un verificentro
 * @param {number} id - ID del verificentro
 * @param {Object} verificentro - Datos actualizados
 * @returns {Promise<Object>}
 */
async function apiUpdateVerificentro(id, verificentro) {
    try {
        const res = await fetch(`${API_BASE}/verificentros/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(verificentro)
        });
        if (!res.ok) throw new Error('Error al actualizar verificentro');
        return await res.json();
    } catch (err) {
        console.error('❌ Error en apiUpdateVerificentro:', err.message);
        throw err;
    }
}

/**
 * Elimina un verificentro (borrado lógico)
 * @param {number} id - ID del verificentro
 * @returns {Promise<void>}
 */
async function apiDeleteVerificentro(id) {
    try {
        const res = await fetch(`${API_BASE}/verificentros/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Error al eliminar verificentro');
    } catch (err) {
        console.error('❌ Error en apiDeleteVerificentro:', err.message);
        throw err;
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
    const response = await fetch('/api/stats');
    if (!response.ok) throw new Error('Error al obtener estadísticas');
    return await response.json();
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

// ════════════════════════════════════════════════════════════════
// NOTAS
// ════════════════════════════════════════════════════════════════

/**
 * Obtiene lista de notas
 * @returns {Promise<Array>}
 */
async function apiGetNotas() {
    try {
        const res = await fetch(`${API_BASE}/notas`);
        if (!res.ok) throw new Error('Error al obtener notas');
        return await res.json();
    } catch (err) {
        console.error('❌ Error en apiGetNotas:', err.message);
        return [];
    }
}

/**
 * Crea una nueva nota
 * @param {Object} nota - Datos de la nota
 * @returns {Promise<Object>}
 */
async function apiCreateNota(nota) {
    try {
        const res = await fetch(`${API_BASE}/notas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nota)
        });
        if (!res.ok) throw new Error('Error al crear nota');
        return await res.json();
    } catch (err) {
        console.error('❌ Error en apiCreateNota:', err.message);
        throw err;
    }
}

/**
 * Actualiza una nota
 * @param {number} id - ID de la nota
 * @param {Object} nota - Datos actualizados
 * @returns {Promise<Object>}
 */
async function apiUpdateNota(id, nota) {
    try {
        const res = await fetch(`${API_BASE}/notas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nota)
        });
        if (!res.ok) throw new Error('Error al actualizar nota');
        return await res.json();
    } catch (err) {
        console.error('❌ Error en apiUpdateNota:', err.message);
        throw err;
    }
}

/**
 * Elimina una nota (borrado lógico)
 * @param {number} id - ID de la nota
 * @returns {Promise<void>}
 */
async function apiDeleteNota(id) {
    try {
        const res = await fetch(`${API_BASE}/notas/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Error al eliminar nota');
    } catch (err) {
        console.error('❌ Error en apiDeleteNota:', err.message);
        throw err;
    }
}

//Pagar varios
async function apiMarkNotasPaid(ids) {
    await fetch(`${API_BASE}/notas/pagar-masivo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ids)
    });
}
//Elimina varios
async function apiDeleteNotasMasivo(ids) {
    await fetch(`${API_BASE}/notas/eliminar-masivo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ids)
    });
}

// ════════════════════════════════════════════════════════════════
// COSTOS
// ════════════════════════════════════════════════════════════════

async function apiGetCostos() {
    try {
        const res = await fetch(`${API_BASE}/costos`);
        if (!res.ok) throw new Error('Error al obtener costos');
        return await res.json();
    } catch (err) { console.error('❌ Error en apiGetCostos:', err.message); return []; }
}

async function apiCreateCosto(costo) {
    try {
        const res = await fetch(`${API_BASE}/costos`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(costo)
        });
        if (!res.ok) throw new Error('Error al crear costo');
        return await res.json();
    } catch (err) { throw err; }
}

async function apiUpdateCosto(id, costo) {
    try {
        const res = await fetch(`${API_BASE}/costos/${id}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(costo)
        });
        if (!res.ok) throw new Error('Error al actualizar costo');
        return await res.json();
    } catch (err) { throw err; }
}

async function apiDeleteCosto(id) {
    try {
        const res = await fetch(`${API_BASE}/costos/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Error al eliminar costo');
    } catch (err) { throw err; }
}

// ════════════════════════════════════════════════════════════════
// TRANSACCIONES
// ════════════════════════════════════════════════════════════════
async function apiGetTransacciones() {
    const res = await fetch(`${API_BASE}/transacciones`);
    return await res.json();
}
async function apiCreateTransaccion(t) {
    const res = await fetch(`${API_BASE}/transacciones`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(t) });
    return await res.json();
}
// ACCIONES MASIVAS
async function apiMarkTransaccionesPaid(ids) {
    await fetch(`${API_BASE}/transacciones/pagar-masivo`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(ids) });
}
async function apiDeleteTransacciones(ids) {
    await fetch(`${API_BASE}/transacciones/eliminar-masivo`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(ids) });
}


// --- PEDIDOS (ENVÍOS) ---
async function apiGetPedidos() {
    const r = await fetch(`${API_BASE}/pedidos`);
    return r.json();
}
async function apiCreatePedido(data) {
    const r = await fetch(`${API_BASE}/pedidos`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    if (!r.ok) throw new Error('Error al crear pedido');
    return r.json();
}
async function apiUpdatePedido(id, data) {
    const r = await fetch(`${API_BASE}/pedidos/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    if (!r.ok) throw new Error('Error al actualizar pedido');
    return r.json();
}
async function apiDeletePedido(id) {
    const r = await fetch(`${API_BASE}/pedidos/${id}`, { method: 'DELETE' });
    if (!r.ok) throw new Error('Error al eliminar pedido');
}
async function apiDeletePedidosMasivo(ids) {
    const r = await fetch(`${API_BASE}/pedidos/eliminar-masivo`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(ids)
    });
    if (!r.ok) throw new Error('Error al eliminar pedidos masivamente');
}

// --- REPORTES ---
async function apiGetReportes() {
    const r = await fetch(`${API_BASE}/reportes`);
    if (!r.ok) throw new Error('Error al cargar reportes');
    return r.json();
}