// ═══════════════════════════════════════════════════════════════
// NAVIGATION.JS - Manejo de navegación y vistas
// ═══════════════════════════════════════════════════════════════

const nm=['dashboard','usuarios','clientes','cedis','vehiculos','verificentros','notas','verificacion','costos','transacciones','pedidos','reportes','tec-unidades','tec-historial'];
const tl={
  dashboard:'Dashboard',
  usuarios:'Usuarios',
  clientes:'Clientes',
  cedis:'CEDIS',
  vehiculos:'Vehículos',
  verificentros:'Verificentros',
  notas:'Notas',
  verificacion:'Verificación',
  costos:'Costos',
  transacciones:'Transacciones',
  pedidos:'Pedidos — Envíos',
  reportes:'Reportes',
  ['tec-unidades']:'Mis Unidades',
  ['tec-historial']:'Mi Historial'
};

const sb=document.getElementById('sb'),mn=document.getElementById('mn');
let role='admin';

/**
 * Navega a una vista específica
 * @param {string} v - Nombre de la vista
 */
function go(v){
  document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));
  const el=document.getElementById('view-'+v);
  if(el) el.classList.add('active');
  
  document.querySelectorAll('.ni').forEach(x=>x.classList.remove('on'));
  const allNi=document.querySelectorAll('.ni');
  allNi.forEach(n=>{
    if(n.getAttribute('onclick')&&n.getAttribute('onclick').includes("'"+v+"'"))
      n.classList.add('on');
  });
  
  document.getElementById('tbt').textContent=tl[v]||v;
}

/**
 * Alterna el colapso del sidebar
 */
function togSb(){
  sb.classList.toggle('col');
  mn.classList.toggle('col');
  sb.style.removeProperty('display'); // Limpiar inline style
  // hamburger icon remains static; we don't need to update text content
}

/**
 * Cambia de rol de usuario (Admin/Técnico)
 * @param {string} r - Rol: 'admin' o 'tecnico'
 * @param {Object} user - Datos del usuario (opcional)
 */
function loginAs(r, user=null){
  console.log('loginAs invoked', { r, user });
  role=r;
  // once we're past the login screen remove the helper class so the
  // sidebar margin comes back into play
  document.body.classList.remove('login');
  document.getElementById('view-login').classList.remove('active');
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  // clear any inline display styles just in case
  document.getElementById('sb').style.removeProperty('display');
  document.querySelector('.topbar').style.removeProperty('display');
  
  if(r==='admin'){
    document.getElementById('menu-admin').style.display='block';
    document.getElementById('menu-tec').style.display='none';
    document.getElementById('sb-avatar').className='sb-av av-admin';
    // Si vinieron datos del usuario autenticado, úsalos
    const nombre = user ? user.nombre : 'María González';
    document.getElementById('sb-uname').textContent=nombre;
    document.getElementById('sb-urole').textContent='Administrador';
    document.getElementById('role-badge').textContent='ADMIN';
    document.getElementById('role-badge').className='tb-role tb-admin';
    document.getElementById('role-switch-btn').textContent='Cambiar a Técnico →';
    go('dashboard');
  } else {
    console.log('entering tecnico branch', {user});
    document.getElementById('menu-admin').style.display='none';
    document.getElementById('menu-tec').style.display='block';
    document.getElementById('sb-avatar').className='sb-av av-tec';
    // Si vinieron datos del usuario autenticado, úsalos
    const nombre = user ? user.nombre : 'Carlos Martínez';
    document.getElementById('sb-uname').textContent=nombre;
    document.getElementById('sb-urole').textContent='Técnico';
    document.getElementById('role-badge').textContent='TÉCNICO';
    document.getElementById('role-badge').className='tb-role tb-tec';
    document.getElementById('role-switch-btn').textContent='Cambiar a Admin →';
    go('tec-unidades');
  }
}

/**
 * Cambia el rol actual
 */
function switchRole(){
  loginAs(role==='admin'?'tecnico':'admin');
}
