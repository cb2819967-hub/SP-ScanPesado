// ═══════════════════════════════════════════════════════════════
// WIZARD.JS - Lógica del Wizard de Evaluación (7 pasos)
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// TIRE GRAPHIC - Generador de SVG de llantas
// ─────────────────────────────────────────────────────────────

const tireStates={};

function ensureWizardSelectPlaceholders(){
  document.querySelectorAll('#m-wizard .wz-panel select').forEach(select=>{
    if(select.querySelector('option[value=""]')) return;
    const placeholder=document.createElement('option');
    placeholder.value='';
    placeholder.textContent='Selecciona una opción';
    placeholder.disabled=true;
    placeholder.selected=true;
    select.insertBefore(placeholder,select.firstChild);
    select.value='';
  });
}

/**
 * Construye un SVG de llanta con birlos interactivos
 * @param {string} containerId - ID del contenedor
 */
function buildTire(containerId){
  const container=document.getElementById(containerId);
  if(!container) return;
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
  container.innerHTML='';
  container.appendChild(svg);
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
  if(!tireStates[tid]) return;
  const boltFail=tireStates[tid].bolts.filter(Boolean).length;
  const nutFail=tireStates[tid].nuts.filter(Boolean).length;
  const totalFail=boltFail+nutFail;
  const el=document.getElementById('tc-'+tid.replace('tire-',''));
  if(!el) return;
  el.textContent='Birlos: '+boltFail+' faltantes · Tuercas: '+nutFail+' faltantes'+(totalFail>2?' ⚠️ REPRUEBA':'');
  el.style.color=totalFail>2?'#dc2626':'#4b5563';
}

function resetTireGraphics(){
  Object.keys(tireStates).forEach(tid=>{
    tireStates[tid].bolts.fill(false);
    tireStates[tid].nuts.fill(false);
    const svg=document.querySelector('#'+tid+' svg');
    if(svg){
      svg.querySelectorAll('circle.bolt').forEach(circle=>{
        circle.setAttribute('fill','#f3f4f6');
        circle.setAttribute('stroke','#9ca3af');
        circle.classList.remove('fail');
        circle.classList.add('neutral');
      });
    }
    updateTireCounter(tid);
  });
}

// Construye las 4 llantas al cargar
['DI','DD','TI','TD'].forEach(id=>buildTire('tire-'+id));
ensureWizardSelectPlaceholders();

// ─────────────────────────────────────────────────────────────
// WIZARD NAVIGATION
// ─────────────────────────────────────────────────────────────

let wzStep=0;
const wzTotal=7;

function setFieldState(field,isValid){
  if(!field) return;
  field.style.borderColor=isValid?'':'#dc2626';
  field.style.boxShadow=isValid?'':'0 0 0 3px rgba(220,38,38,.12)';
}

function getWizardBaseFields(){
  return [
    document.getElementById('wz-vehiculo'),
    document.getElementById('wz-materia'),
    document.getElementById('wz-nota')
  ].filter(Boolean);
}

function isEmptyWizardField(field){
  if(!field) return true;
  if(field.dataset.optional==='true') return false;
  if(field.tagName==='SELECT') return !field.value;
  if(field.type==='file') return !field.files || field.files.length===0;
  return field.value.trim()==='';
}

function validateWizardPanel(stepIndex,showToast=true){
  const panel=document.getElementById('wp'+stepIndex);
  if(!panel) return true;

  const baseFields=getWizardBaseFields();
  const panelFields=[...panel.querySelectorAll('select,input,textarea')].filter(field=>field.dataset.optional!=='true');
  const fieldsToCheck=[...baseFields,...panelFields];
  let valid=true;

  fieldsToCheck.forEach(field=>{
    const ok=!isEmptyWizardField(field);
    setFieldState(field,ok);
    if(!ok) valid=false;
  });

  if(!valid && showToast && typeof toast==='function'){
    toast('⚠️ Completa todos los campos obligatorios antes de continuar');
  }
  return valid;
}

function goToWizardStep(targetStep){
  if(targetStep<0||targetStep>=wzTotal) return;
  for(let i=0;i<wzTotal;i++){
    document.getElementById('wp'+i)?.classList.remove('on');
    document.getElementById('ws'+i)?.classList.remove('active');
    document.getElementById('ws'+i)?.classList.toggle('done',i<targetStep);
  }
  wzStep=targetStep;
  document.getElementById('wp'+wzStep)?.classList.add('on');
  document.getElementById('ws'+wzStep)?.classList.add('active');
  const info=document.getElementById('wz-info');
  const prev=document.getElementById('wz-prev');
  const next=document.getElementById('wz-next');
  const finish=document.getElementById('wz-finish');
  if(info) info.textContent='Paso '+(wzStep+1)+' de '+wzTotal;
  if(prev) prev.style.display=wzStep>0?'flex':'none';
  if(next) next.style.display=wzStep<wzTotal-1?'flex':'none';
  if(finish) finish.style.display=wzStep===wzTotal-1?'flex':'none';
  if(wzStep===wzTotal-1) updateWizardDictamenPreview();
}

function validateEntireWizard(){
  for(let step=0;step<wzTotal;step++){
    if(!validateWizardPanel(step,false)){
      goToWizardStep(step);
      if(typeof toast==='function') toast('⚠️ Completa todos los campos obligatorios antes de guardar');
      return false;
    }
  }
  return true;
}

function isApprovedValue(value){
  if(!value) return false;
  return /^aprobad/i.test(value.trim());
}

function getWizardDictamen(){
  const modal=document.getElementById('m-wizard');
  if(!modal) return 'REPROBADO';

  const selects=[...modal.querySelectorAll('.wz-panel select')];
  const hasSelectFailure=selects.some(select=>!isApprovedValue(select.value));

  const badges=[...modal.querySelectorAll('.psi-val')];
  const hasNumericFailure=badges.some(badge=>!badge.textContent.trim() || badge.classList.contains('psi-fail') || badge.textContent.trim()==='-');

  const chavetasSelect=[...selects].find(select=>{
    const label=select.closest('.ev-field')?.querySelector('label')?.textContent || '';
    return label.includes('Chavetas');
  });
  const chavetasInput=[...modal.querySelectorAll('input[type="number"]')].find(input=>{
    const label=input.closest('.ev-field')?.querySelector('label')?.textContent || '';
    return label.includes('Chavetas');
  });
  const hasChavetasFailure=(chavetasSelect && !isApprovedValue(chavetasSelect.value)) || (chavetasInput && Number(chavetasInput.value||0)>0);

  const tireFailure=Object.values(tireStates).some(state=>{
    const total=state.bolts.filter(Boolean).length+state.nuts.filter(Boolean).length;
    return total>2;
  });

  return hasSelectFailure || hasNumericFailure || hasChavetasFailure || tireFailure ? 'REPROBADO' : 'APROBADO';
}

function updateWizardDictamenPreview(){
  const preview=document.getElementById('dictamen-preview');
  if(!preview) return;
  const result=getWizardDictamen();
  if(typeof updateDictamenPreview==='function'){
    updateDictamenPreview(result);
  }
}

/**
 * Navega entre pasos del wizard
 * @param {number} dir - Dirección: 1 (siguiente) o -1 (anterior)
 */
function wzNav(dir){
  if(dir>0 && !validateWizardPanel(wzStep)) return;

  const currentPanel=document.getElementById('wp'+wzStep);
  const currentStep=document.getElementById('ws'+wzStep);
  if(!currentPanel||!currentStep) return;

  currentPanel.classList.remove('on');
  currentStep.classList.remove('active');
  currentStep.classList.add('done');

  wzStep+=dir;
  if(wzStep<0) wzStep=0;
  if(wzStep>=wzTotal) wzStep=wzTotal-1;

  document.getElementById('wp'+wzStep)?.classList.add('on');
  document.getElementById('ws'+wzStep)?.classList.add('active');
  const info=document.getElementById('wz-info');
  if(info) info.textContent='Paso '+(wzStep+1)+' de '+wzTotal;

  const prev=document.getElementById('wz-prev');
  const next=document.getElementById('wz-next');
  const finish=document.getElementById('wz-finish');
  if(prev) prev.style.display=wzStep>0?'flex':'none';
  if(next) next.style.display=wzStep<wzTotal-1?'flex':'none';
  if(finish) finish.style.display=wzStep===wzTotal-1?'flex':'none';

  if(wzStep===wzTotal-1){
    document.getElementById('dictamen-preview')?.style.setProperty('display','block');
    updateWizardDictamenPreview();
  }
}

/**
 * Reinicia el wizard a su estado inicial
 */
function resetWizard(){
  wzStep=0;
  for(let i=0;i<wzTotal;i++){
    document.getElementById('wp'+i)?.classList.remove('on');
    document.getElementById('ws'+i)?.classList.remove('active','done');
  }
  document.getElementById('wp0')?.classList.add('on');
  document.getElementById('ws0')?.classList.add('active');
  const prev=document.getElementById('wz-prev');
  const next=document.getElementById('wz-next');
  const finish=document.getElementById('wz-finish');
  const info=document.getElementById('wz-info');
  const preview=document.getElementById('dictamen-preview');
  if(prev) prev.style.display='none';
  if(next) next.style.display='flex';
  if(finish) finish.style.display='none';
  if(info) info.textContent='Paso 1 de 7';
  if(preview) preview.style.display='none';
  resetTireGraphics();
  [...document.querySelectorAll('#m-wizard select,#m-wizard input,#m-wizard textarea')].forEach(field=>setFieldState(field,true));
}

/**
 * Finaliza el wizard y guarda la evaluación
 */
async function finishWizard(){
  if(!validateEntireWizard()) return;

  const resultado=getWizardDictamen();
  updateWizardDictamenPreview();

  const confirmMsg=window.wizardConfirmMessage || '¿Confirmar y guardar la evaluación?';
  if(!confirm(confirmMsg)) return;

  const vehiculoSelect=document.getElementById('wz-vehiculo');
  const materiaSelect=document.getElementById('wz-materia');
  const notaSelect=document.getElementById('wz-nota');
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;

  const data = {
    id: window.wizardEditingId || null,
    folio: 'V-' + new Date().getFullYear() + '-' + Date.now().toString().slice(-3),
    unidad: vehiculoSelect?.options[vehiculoSelect.selectedIndex]?.text || document.querySelector('#m-wizard select')?.value || 'Unidad Genérica',
    vehiculoId: vehiculoSelect?.value || '',
    materia: materiaSelect?.value || '',
    notaId: notaSelect?.value || '',
    tecnico: user ? user.nombre : 'Técnico',
    resultado
  };

  try {
    if(typeof window.wizardSaveHandler==='function'){
      await window.wizardSaveHandler(data);
    } else if (typeof apiCreateVerificacion === 'function') {
      await apiCreateVerificacion(data);
      if (typeof toast === 'function') toast('✅ Evaluación registrada en Oracle');
      if (typeof loadVerificaciones === 'function') loadVerificaciones();
    } else {
      if (typeof toast === 'function') toast('✅ Evaluación registrada localmente');
    }

    if (typeof cm === 'function') cm('m-wizard');
    resetWizard();
  } catch (err) {
    if (typeof toast === 'function') toast('❌ Error al guardar: ' + err.message);
    console.error(err);
  }
}

// Manejador para cerrar el wizard con confirmación
const modalWizard = document.getElementById('m-wizard');
if (modalWizard) {
  modalWizard.addEventListener('input', function(e){
    if(e.target.matches('input, textarea')){
      setFieldState(e.target,!isEmptyWizardField(e.target));
      updateWizardDictamenPreview();
    }
  });

  modalWizard.addEventListener('change', function(e){
    if(e.target.matches('select, input[type="file"]')){
      setFieldState(e.target,!isEmptyWizardField(e.target));
      updateWizardDictamenPreview();
    }
  });

  modalWizard.addEventListener('click', function(e){
    if(e.target.id === 'm-wizard'){
      if(confirm('¿Cancelar la evaluación? Los datos no guardados se perderán.')){
        if (typeof cm === 'function') cm('m-wizard');
        resetWizard();
      }
    }
  });
}
