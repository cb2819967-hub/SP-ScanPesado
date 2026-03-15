// ═══════════════════════════════════════════════════════════════
// MODALS.JS - Manejo de modales y acciones
// ═══════════════════════════════════════════════════════════════

/**
 * Abre un modal
 * @param {string} id - ID del modal
 */
function om(id){
  document.getElementById(id).classList.add('on');
}

/**
 * Cierra un modal
 * @param {string} id - ID del modal
 */
function cm(id){
  document.getElementById(id).classList.remove('on');
}

/**
 * Cierra un modal si se hace clic fuera de él
 * @param {Event} e - Evento del click
 * @param {string} id - ID del modal
 */
function mc(e,id){
  if(e.target.id===id) cm(id);
}

/**
 * Alterna la visibilidad del historial de una fila
 * @param {string} id - ID del historial
 */
function th(id){
  document.getElementById('hr-'+id).classList.toggle('on');
}

/**
 * Confirma y elimina un registro
 */
function confirmDel(){
  if(confirm('⚠️ ¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.'))
    toast('🗑️ Registro eliminado (borrado lógico)');
}

// ─────────────────────────────────────────────────────────────
// MULTI-SELECT
// ─────────────────────────────────────────────────────────────

/**
 * Actualiza el contador y visibilidad de la barra de herramientas múltiple
 * @param {string} p - Prefijo de tabla ('trans', 'ped', etc)
 */
function updTb(p){
  const n=[...document.querySelectorAll('.ck-'+p)].filter(c=>c.checked).length;
  document.getElementById(p+'-ct').textContent=n+' seleccionado'+(n!==1?'s':'');
  n>0?document.getElementById(p+'-tb').classList.add('on'):document.getElementById(p+'-tb').classList.remove('on');
  const a=document.getElementById('ca-'+p);
  if(a&&!n) a.checked=false;
}

/**
 * Alterna todos los checkboxes de una tabla
 * @param {string} p - Prefijo de tabla
 */
function togAll(p){
  const a=document.getElementById('ca-'+p).checked;
  document.querySelectorAll('.ck-'+p).forEach(c=>c.checked=a);
  updTb(p);
}

/**
 * Deselecciona todos los registros de una tabla
 * @param {string} p - Prefijo de tabla
 */
function desel(p){
  document.querySelectorAll('.ck-'+p).forEach(c=>c.checked=false);
  const a=document.getElementById('ca-'+p);
  if(a) a.checked=false;
  document.getElementById(p+'-tb').classList.remove('on');
}

/**
 * Marca registros seleccionados como pagados
 * @param {string} p - Prefijo de tabla
 */
function mkPaid(p){
  const idx=p==='trans'?14:7;
  document.querySelectorAll('.ck-'+p+':checked').forEach(c=>{
    const tds=c.closest('tr').querySelectorAll('td');
    if(tds[idx]) tds[idx].innerHTML='<span class="b bg">✔ Sí</span>';
  });
  desel(p);
  toast('✔ Registros marcados como pagados');
}

/**
 * Elimina registros seleccionados
 * @param {string} p - Prefijo de tabla
 */
function del(p){
  const sel=[...document.querySelectorAll('.ck-'+p+':checked')];
  if(!sel.length) return;
  if(!confirm('⚠️ ¿Eliminar '+sel.length+' registro(s) seleccionados?')) return;
  sel.forEach(c=>c.closest('tr').remove());
  desel(p);
  toast('🗑️ '+sel.length+' registro(s) eliminado(s)');
}

// ─────────────────────────────────────────────────────────────
// ACCIONES DE GUARDAR (Ejemplo de implementación real)
// ─────────────────────────────────────────────────────────────

async function saveCliente() {
  const rs = document.querySelector('#m-cli input[placeholder="Empresa S.A. de C.V."]').value;
  const rfc = document.querySelector('#m-cli input[placeholder="TDN991201AB3"]').value;
  const correo = document.querySelector('#m-cli input[type="email"]').value;
  const tel = document.querySelector('#m-cli input[placeholder="000-000-0000"]').value;
  
  if (!rs) {
    toast('⚠️ La Razón Social es obligatoria');
    return;
  }
  
  toast('⏳ Guardando cliente...');
  
  try {
    const res = await fetch(`${API_BASE}/clientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razonSocial: rs,
        email: correo,
        telefono: tel
        // Aquí irían los demás campos según tu modelo de BD
      })
    });
    
    if (res.ok) {
      toast('✅ Cliente guardado correctamente');
      cm('m-cli'); // Cierra el modal
      loadClientesData(); // Recarga la tabla
    } else {
      throw new Error('Error al guardar en el servidor');
    }
  } catch (e) {
    toast('❌ ' + e.message);
  }
}

async function saveUsuario() {
  const nombre = document.querySelector('#m-usr input[placeholder="Nombre completo"]').value;
  const correo = document.querySelector('#m-usr input[type="email"]').value;
  const pass = document.querySelector('#m-usr input[type="password"]').value;
  const tipoSelect = document.querySelector('#m-usr select');
  const tipo = tipoSelect.options[tipoSelect.selectedIndex].text.toUpperCase();
  
  if (!nombre || !correo || !pass) {
    toast('⚠️ Llena los campos obligatorios');
    return;
  }
  
  toast('⏳ Guardando usuario...');
  
  try {
    const res = await fetch(`${API_BASE}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombreUsuario: nombre,
        email: correo,
        contrasena: pass,
        tipoUsuario: tipo
      })
    });
    
    if (res.ok) {
      toast('✅ Usuario guardado correctamente');
      cm('m-usr'); 
      loadUsuariosData(); 
    } else {
      throw new Error('Error al guardar en el servidor');
    }
  } catch (e) {
    toast('❌ ' + e.message);
  }
}

async function saveVehiculo() {
  const placa = document.querySelector('#m-veh input[placeholder="AAA-00-A"]').value;
  const serie = document.querySelector('#m-veh input[placeholder="1FUJGLDR5KS..."]').value;
  const tipoSelect = document.querySelector('#m-veh select');
  const tipo = tipoSelect.options[tipoSelect.selectedIndex].text;
  
  if (!placa || !serie) {
    toast('⚠️ Placa y serie son obligatorios');
    return;
  }
  
  toast('⏳ Guardando vehículo...');
  
  try {
    const res = await fetch(`${API_BASE}/vehiculos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        placa: placa,
        serie: serie,
        tipo: tipo
      })
    });
    
    if (res.ok) {
      toast('✅ Vehículo guardado correctamente');
      cm('m-veh'); 
      loadVehiculosData(); 
    } else {
      throw new Error('Error al guardar en el servidor');
    }
  } catch (e) {
    toast('❌ ' + e.message);
  }
}

async function saveCedis() {
  const nombre = document.querySelector('#m-ced input[placeholder="CEDIS Nombre Ciudad"]').value;
  const encargado = document.querySelectorAll('#m-ced input')[1].value;
  const correo = document.querySelector('#m-ced input[type="email"]').value;
  const tel = document.querySelectorAll('#m-ced input')[3].value;
  
  if (!nombre) {
    toast('⚠️ El nombre es obligatorio');
    return;
  }
  
  toast('⏳ Guardando CEDIS...');
  
  try {
    const res = await fetch(`${API_BASE}/cedis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nombre,
        encargado: encargado,
        correo: correo,
        telefono: tel
      })
    });
    
    if (res.ok) {
      toast('✅ CEDIS guardado correctamente');
      cm('m-ced'); 
      loadCedisData(); 
    } else {
      throw new Error('Error al guardar en el servidor');
    }
  } catch (e) {
    toast('❌ ' + e.message);
  }
}

async function saveVerificentro() {
  const nombre = document.querySelectorAll('#m-ver input')[0].value;
  const clave = document.querySelector('#m-ver input[placeholder="VN-000"]').value;
  const resp = document.querySelectorAll('#m-ver input')[2].value;
  const dir = document.querySelector('#m-ver textarea').value;
  
  if (!nombre) {
    toast('⚠️ El nombre es obligatorio');
    return;
  }
  
  toast('⏳ Guardando Verificentro...');
  
  try {
    const res = await fetch(`${API_BASE}/verificentros`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nombre,
        claveVerificentro: clave,
        responsable: resp,
        direccion: dir
      })
    });
    
    if (res.ok) {
      toast('✅ Verificentro guardado correctamente');
      cm('m-ver'); 
      loadVerificentrosData(); 
    } else {
      throw new Error('Error al guardar en el servidor');
    }
  } catch (e) {
    toast('❌ ' + e.message);
  }
}