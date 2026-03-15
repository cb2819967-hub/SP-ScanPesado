// ═══════════════════════════════════════════════════════════════
// WIZARD.JS - Lógica del Wizard de Evaluación (7 pasos)
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// TIRE GRAPHIC - Generador de SVG de llantas
// ─────────────────────────────────────────────────────────────

const tireStates={};

/**
 * Construye un SVG de llanta con birlos interactivos
 * @param {string} containerId - ID del contenedor
 */
function buildTire(containerId){
  const pos=[[50,20],[71,29],[79,50],[71,71],[50,80],[29,71],[21,50],[29,29]];
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('viewBox','0 0 100 100');
  svg.setAttribute('width','120');
  svg.setAttribute('height','120');
  svg.classList.add('tire-svg');
  
  // Outer ring
  const outer=document.createElementNS('http://www.w3.org/2000/svg','circle');
  outer.setAttribute('cx','50');
  outer.setAttribute('cy','50');
  outer.setAttribute('r','46');
  outer.setAttribute('fill','#374151');
  outer.setAttribute('stroke','#6b7280');
  outer.setAttribute('stroke-width','2');
  svg.appendChild(outer);
  
  // Hub
  const hub=document.createElementNS('http://www.w3.org/2000/svg','circle');
  hub.setAttribute('cx','50');
  hub.setAttribute('cy','50');
  hub.setAttribute('r','22');
  hub.setAttribute('fill','#1f2937');
  svg.appendChild(hub);
  
  // Bolts (8)
  tireStates[containerId]={bolts:new Array(8).fill(false),nuts:new Array(8).fill(false)};
  pos.forEach((p,i)=>{
    const c=document.createElementNS('http://www.w3.org/2000/svg','circle');
    c.setAttribute('cx',p[0]);
    c.setAttribute('cy',p[1]);
    c.setAttribute('r','7');
    c.setAttribute('fill','#f3f4f6');
    c.setAttribute('stroke','#9ca3af');
    c.setAttribute('stroke-width','1.5');
    c.classList.add('bolt','neutral');
    c.setAttribute('data-i',i);
    c.setAttribute('data-tid',containerId);
    c.setAttribute('title','Birlo '+(i+1)+' — clic para marcar faltante');
    c.addEventListener('click',function(){toggleBolt(containerId,i,this);});
    svg.appendChild(c);
  });
  document.getElementById(containerId).appendChild(svg);
}

/**
 * Alterna el estado de un birlo (faltante/presente)
 * @param {string} tid - ID de la llanta
 * @param {number} i - Índice del birlo
 * @param {Element} el - Elemento del circle
 */
function toggleBolt(tid,i,el){
  tireStates[tid].bolts[i]=!tireStates[tid].bolts[i];
  el.setAttribute('fill',tireStates[tid].bolts[i]?'#fee2e2':'#f3f4f6');
  el.setAttribute('stroke',tireStates[tid].bolts[i]?'#dc2626':'#9ca3af');
  el.classList.toggle('fail',tireStates[tid].bolts[i]);
  el.classList.toggle('neutral',!tireStates[tid].bolts[i]);
  updateTireCounter(tid);
}

/**
 * Actualiza el contador de birlos/tuercas faltantes
 * @param {string} tid - ID de la llanta
 */
function updateTireCounter(tid){
  const boltFail=tireStates[tid].bolts.filter(Boolean).length;
  const nutFail=tireStates[tid].nuts.filter(Boolean).length;
  const totalFail=boltFail+nutFail;
  const el=document.getElementById('tc-'+tid.replace('tire-',''));
  el.textContent='Birlos: '+boltFail+' faltantes · Tuercas: '+nutFail+' faltantes'+(totalFail>2?' ⚠️ REPRUEBA':'');
  el.style.color=totalFail>2?'#dc2626':'#4b5563';
}

// Construye las 4 llantas al cargar
['DI','DD','TI','TD'].forEach(id=>buildTire('tire-'+id));

// ─────────────────────────────────────────────────────────────
// WIZARD NAVIGATION
// ─────────────────────────────────────────────────────────────

let wzStep=0;
const wzTotal=7;

/**
 * Navega entre pasos del wizard
 * @param {number} dir - Dirección: 1 (siguiente) o -1 (anterior)
 */
function wzNav(dir){
  document.getElementById('wp'+wzStep).classList.remove('on');
  document.getElementById('ws'+wzStep).classList.remove('active');
  document.getElementById('ws'+wzStep).classList.add('done');
  
  wzStep+=dir;
  if(wzStep<0) wzStep=0;
  if(wzStep>=wzTotal) wzStep=wzTotal-1;
  
  document.getElementById('wp'+wzStep).classList.add('on');
  document.getElementById('ws'+wzStep).classList.add('active');
  document.getElementById('wz-info').textContent='Paso '+(wzStep+1)+' de '+wzTotal;
  
  document.getElementById('wz-prev').style.display=wzStep>0?'flex':'none';
  document.getElementById('wz-next').style.display=wzStep<wzTotal-1?'flex':'none';
  document.getElementById('wz-finish').style.display=wzStep===wzTotal-1?'flex':'none';
  
  if(wzStep===wzTotal-1){
    document.getElementById('dictamen-preview').style.display='block';
  }
}

/**
 * Reinicia el wizard a su estado inicial
 */
function resetWizard(){
  wzStep=0;
  for(let i=0;i<wzTotal;i++){
    document.getElementById('wp'+i).classList.remove('on');
    document.getElementById('ws'+i).classList.remove('active','done');
  }
  document.getElementById('wp0').classList.add('on');
  document.getElementById('ws0').classList.add('active');
  document.getElementById('wz-prev').style.display='none';
  document.getElementById('wz-next').style.display='flex';
  document.getElementById('wz-finish').style.display='none';
  document.getElementById('wz-info').textContent='Paso 1 de 7';
  document.getElementById('dictamen-preview').style.display='none';
}

/**
 * Finaliza el wizard y guarda la evaluación
 */
function finishWizard(){
async function finishWizard(){
  if(!confirm('¿Confirmar y guardar la evaluación?')) return;
  cm('m-wizard');
  resetWizard();
  toast('✅ Evaluación registrada correctamente');
  
  // Recolectar datos básicos (ajusta según tus inputs reales del wizard)
  const user = getCurrentUser();
  const data = {
    folio: 'F-' + Date.now().toString().slice(-6), // Generar folio simple
    unidad: document.getElementById('wz-unidad')?.value || 'Unidad Genérica',
    tecnico: user ? user.nombre : 'Técnico',
    resultado: 'APROBADO' // Lógica simple, podrías calcularla basada en los fallos
  };

  try {
    await apiCreateVerificacion(data);
    cm('m-wizard');
    resetWizard();
    toast('✅ Evaluación registrada en Oracle');
    if(typeof loadVerificaciones === 'function') loadVerificaciones();
  } catch (err) {
    toast('❌ Error al guardar: ' + err.message);
  }
}

// Manejador para cerrar el wizard con confirmación
document.getElementById('m-wizard').addEventListener('click',function(e){
  if(e.target.id==='m-wizard'){
    if(confirm('¿Cancelar la evaluación? Los datos no guardados se perderán.'))
      cm('m-wizard');
    resetWizard();
  }
});
