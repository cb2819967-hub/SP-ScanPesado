// ═══════════════════════════════════════════════════════════════
// MAIN.JS - Funciones generales y utilidades
// ═══════════════════════════════════════════════════════════════

/**
 * Muestra un toast (notificación) temporal
 */
function toast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg;
  t.style.display='block';
  clearTimeout(t._t);
  t._t=setTimeout(()=>t.style.display='none',2800);
}

/**
 * Reinicia los filtros de reportes
 */
function resetFiltros(){
  ['rp-nota','rp-cliente','rp-region','rp-dictamen'].forEach(id=>document.getElementById(id).value='');
  toast('↺ Filtros reiniciados');
}

// ─────────────────────────────────────────────────────────────
// LOGIN CON AUTENTICACIÓN REAL
// ─────────────────────────────────────────────────────────────

/**
 * Autentica al usuario contra la base de datos Oracle
 */
async function authenticateUser(email, password) {
  try {
    toast('🔐 Validando credenciales...');
    const user = await apiLogin(email, password);
    console.log('authenticateUser got user', user);
    toast(`✅ Bienvenido, ${user.nombre}!`);
    
    // Pasar al flujo de selección de rol, o directamente al dashboard si solo es admin
    if (user.rol === 'ADMIN') {
      loginAs('admin', user);
    } else if (user.rol === 'TECNICO') {
      loginAs('tecnico', user);
    } else {
      toast('⚠️  Rol desconocido');
    }
  } catch (err) {
    toast(`❌ ${err.message}`);
    console.error('Error de autenticación:', err);
  }
}

// ─────────────────────────────────────────────────────────────
// ACTUALIZACIÓN DE VISTAS CON DATOS REALES DE LA API
// ─────────────────────────────────────────────────────────────

async function loadDashboardData() {
  const stats = await apiGetStats();
  // Actualizar tarjetas de estadísticas
  const statContainers = document.querySelectorAll('#view-dashboard .sn');
  if (statContainers.length >= 4) {
    statContainers[0].textContent = stats.clientes || 0;
    statContainers[1].textContent = stats.vehiculos || 0;
    statContainers[2].textContent = stats.notas || 0;
    statContainers[3].textContent = stats.verificaciones || 0;
  }

  // Cargar últimas verificaciones en la tabla
  const verificaciones = await apiGetVerificaciones();
  const tbody = document.querySelector('#view-dashboard table tbody');
  if (tbody && verificaciones.length > 0) {
    tbody.innerHTML = '';
    verificaciones.slice(0, 5).forEach(v => {
      let badgeClass = 'bg';
      let icon = '✔';
      if (v.resultado === 'REPROBADO') { badgeClass = 'br'; icon = '✘'; }
      else if (v.resultado === 'PENDIENTE') { badgeClass = 'bo'; icon = '⏳'; }
      
      tbody.innerHTML += `
        <tr>
          <td>${v.folio || 'N/A'}</td>
          <td>${v.unidad || 'N/A'}</td>
          <td>${v.tecnico || 'N/A'}</td>
          <td>${v.fecha || 'N/A'}</td>
          <td><span class="b ${badgeClass}">${icon} ${v.resultado || 'N/A'}</span></td>
        </tr>
      `;
    });
  }
}

async function loadUsuariosData() {
  const usuarios = await apiGetUsuarios();
  const tbody = document.querySelector('#view-usuarios table tbody');
  if (tbody) {
    tbody.innerHTML = '';
    if (usuarios.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center">No hay datos en la base de datos</td></tr>';
      return;
    }
    usuarios.forEach(u => {
      const isActivo = u.activo !== false;
      const actClass = isActivo ? 'bg' : 'br';
      const actText = isActivo ? '✔ Sí' : '✘ No';
      const rolClass = u.rol === 'ADMIN' ? 'bb' : 'bx';
      
      tbody.innerHTML += `
        <tr>
          <td>${u.nombre}</td>
          <td>${u.correo}</td>
          <td><span class="b ${rolClass}">${u.rol === 'ADMIN' ? 'Admin' : 'Técnico'}</span></td>
          <td><span class="b ${actClass}">${actText}</span></td>
          <td><div class="ax"><button class="ab">🔑</button><button class="ab">✏️</button><button class="ab" onclick="confirmDel()">🗑️</button></div></td>
        </tr>
      `;
    });
  }
}

async function loadClientesData() {
  const clientes = await apiGetClientes();
  const tbody = document.querySelector('#view-clientes table tbody');
  if (tbody) {
    tbody.innerHTML = '';
    if (clientes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center">No hay datos en la base de datos</td></tr>';
      return;
    }
    clientes.forEach(c => {
      const isActivo = c.activo !== false;
      const actClass = isActivo ? 'bg' : 'br';
      const actText = isActivo ? '✔ Sí' : '✘ No';
      
      tbody.innerHTML += `
        <tr>
          <td><strong>${c.razon_social}</strong></td>
          <td><code>—</code></td>
          <td>${c.correo || 'N/A'}</td>
          <td>${c.telefono || 'N/A'}</td>
          <td>—</td>
          <td>—</td>
          <td><span class="b ${actClass}">${actText}</span></td>
          <td><div class="ax"><button class="ab">👁️</button><button class="ab">✏️</button><button class="ab" onclick="confirmDel()">🗑️</button></div></td>
        </tr>
      `;
    });
  }
}

async function loadVehiculosData() {
  const vehiculos = await apiGetVehiculos();
  const tbody = document.querySelector('#view-vehiculos table tbody');
  if (tbody) {
    tbody.innerHTML = '';
    if (vehiculos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center">No hay datos en la base de datos</td></tr>';
      return;
    }
    vehiculos.forEach((v, index) => {
      const isActivo = v.activo !== false;
      const actClass = isActivo ? 'bg' : 'br';
      const actText = isActivo ? '✔ Sí' : '✘ No';
      const id = v.id || index;
      
      tbody.innerHTML += `
        <tr>
          <td><strong>${v.placa}</strong></td><td style="font-size:11px;color:var(--g400)">${v.serie}</td>
          <td>${v.cedis}</td><td><span class="b bb">N/A</span></td><td>${v.tipo}</td><td><span class="b ${actClass}">${actText}</span></td>
          <td><button class="btn btn-outline btn-sm" onclick="th('h${id}')">📋 Historial</button></td>
          <td><div class="ax"><button class="ab" onclick="om('m-eval')">📝</button><button class="ab">✏️</button><button class="ab" onclick="confirmDel()">🗑️</button></div></td>
        </tr>
        <tr class="hrow" id="hr-h${id}"><td colspan="8" style="padding:0">
          <div class="hp"><div class="ht">📋 Historial — ${v.placa}</div>
            <table style="font-size:12px"><thead><tr><th colspan="7" style="color:var(--g400);text-align:center">Historial no implementado aún en API</th></tr></thead><tbody></tbody></table>
          </div>
        </td></tr>
      `;
    });
  }
}

async function loadCedisData() {
  const cedis = await apiGetCedis();
  const tbody = document.querySelector('#view-cedis table tbody');
  if (tbody) {
    tbody.innerHTML = '';
    if (cedis.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center">No hay datos en la base de datos</td></tr>';
      return;
    }
    cedis.forEach(c => {
      const isActivo = c.activo !== false;
      const actClass = isActivo ? 'bg' : 'br';
      const actText = isActivo ? '✔ Sí' : '✘ No';
      
      tbody.innerHTML += `
        <tr>
          <td><strong>${c.nombre}</strong></td>
          <td>${c.cliente}</td>
          <td><span class="b bb">${c.region}</span></td>
          <td>${c.encargado}</td>
          <td>${c.correo}</td>
          <td>${c.telefono}</td>
          <td><span class="b ${actClass}">${actText}</span></td>
          <td><div class="ax"><button class="ab">✏️</button><button class="ab" onclick="confirmDel()">🗑️</button></div></td>
        </tr>
      `;
    });
  }
}

async function loadVerificentrosData() {
  const verificentros = await apiGetVerificentros();
  const tbody = document.querySelector('#view-verificentros table tbody');
  if (tbody) {
    tbody.innerHTML = '';
    if (verificentros.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center">No hay datos en la base de datos</td></tr>';
      return;
    }
    verificentros.forEach(v => {
      const isActivo = v.activo !== false;
      const actClass = isActivo ? 'bg' : 'br';
      const actText = isActivo ? '✔ Sí' : '✘ No';
      
      tbody.innerHTML += `
        <tr>
          <td><strong>${v.nombre}</strong></td>
          <td><code>${v.clave}</code></td>
          <td><span class="b bb">${v.region}</span></td>
          <td>${v.responsable}</td>
          <td>${v.direccion}</td>
          <td>${v.horario}</td>
          <td><span class="b ${actClass}">${actText}</span></td>
          <td><div class="ax"><button class="ab">⏰</button><button class="ab">✏️</button><button class="ab" onclick="confirmDel()">🗑️</button></div></td>
        </tr>
      `;
    });
  }
}

// Sobrescribimos la función go de navigation.js para cargar los datos cuando se abre la vista
const originalGo = window.go;
window.go = function(v) {
  if (originalGo) originalGo(v);
  
  if (v === 'dashboard') {
    loadDashboardData();
  } else if (v === 'usuarios') {
    loadUsuariosData();
  } else if (v === 'clientes') {
    loadClientesData();
  } else if (v === 'vehiculos') {
    loadVehiculosData();
  } else if (v === 'cedis') {
    loadCedisData();
  } else if (v === 'verificentros') {
    loadVerificentrosData();
  }
};


// ─────────────────────────────────────────────────────────────
// INICIALIZACIÓN AL CARGAR
// ─────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded',function(){
  // Mostrar solo login al iniciar
  const login=document.getElementById('view-login');
  const sb=document.getElementById('sb');
  const topbar=document.querySelector('.topbar');
  
  // Remover .active de todas las vistas primero
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  
  // Activar solo el login
  login.classList.add('active');
  // add a helper class on body so we can control layout via CSS
  document.body.classList.add('login');
  // note: sidebar/topbar are hidden via CSS when body.login is present
  // clear any leftovers from previous sessions
  sb.style.removeProperty('display');
  topbar.style.removeProperty('display');
  
  // Oculta menú técnico al inicio
  document.getElementById('menu-tec').style.display='none';
  document.getElementById('menu-admin').style.display='block';
  
  // Configura el formulario de login para pasar credenciales reales
  configureLoginForm();
  
  // Establece la fecha en el reporte
  if(document.getElementById('print-date')){
    document.getElementById('print-date').textContent=new Date().toLocaleDateString('es-MX',{
      day:'2-digit',month:'long',year:'numeric'
    });
  }
  
  console.log('✅ Sistema iniciado - Esperando login');
});

/**
 * Configura el formulario de login para usar autenticación real
 */
function configureLoginForm() {
  // Captura botones de rol del formulario de login
  const adminBtn = document.querySelector('#view-login .lr-btn:nth-child(1)');
  const tecBtn   = document.querySelector('#view-login .lr-btn:nth-child(2)');
  
  if (adminBtn) {
    adminBtn.onclick = () => {
      const email = document.querySelector('#view-login input[type="email"]')?.value;
      const password = document.querySelector('#view-login input[type="password"]')?.value;
      
      if (!email || !password) {
        toast('⚠️  Ingresa correo y contraseña');
        return;
      }
      authenticateUser(email, password);
    };
  }
  
  if (tecBtn) {
    tecBtn.onclick = () => {
      const email = document.querySelector('#view-login input[type="email"]')?.value;
      const password = document.querySelector('#view-login input[type="password"]')?.value;
      
      if (!email || !password) {
        toast('⚠️  Ingresa correo y contraseña');
        return;
      }
      authenticateUser(email, password);
    };
  }
}