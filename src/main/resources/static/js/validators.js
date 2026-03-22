// ═══════════════════════════════════════════════════════════════
// VALIDATORS.JS - Validadores de campos (PSI, mm, etc)
// ═══════════════════════════════════════════════════════════════

/**
 * Valida presión PSI (mínimo 80)
 * @param {Element} inp - Input de presión
 * @param {string} vid - ID del elemento mostrador
 */
function chkPsi(inp,vid){
  const v=parseFloat(inp.value);
  const el=document.getElementById(vid);
  if(isNaN(v)){
    el.className='psi-val';
    el.textContent='—';
    return;
  }
  el.className='psi-val '+(v>=80?'psi-ok':'psi-fail');
  el.textContent=v>=80?'✔ OK':'✘ BAJO';
}

/**
 * Valida profundidad en mm (con mínimo específico)
 * @param {Element} inp - Input de profundidad
 * @param {string} vid - ID del elemento mostrador
 * @param {number} min - Valor mínimo permitido
 */
function chkMm(inp,vid,min){
  const v=parseFloat(inp.value);
  const el=document.getElementById(vid);
  if(isNaN(v)){
    el.className='psi-val';
    el.textContent='—';
    return;
  }
  el.className='psi-val '+(v>=min?'psi-ok':'psi-fail');
  el.textContent=v>=min?'✔ OK':'✘ BAJO';
}

/**
 * Valida rango PSI del compresor (70-120)
 * @param {Element} inp - Input de rango
 * @param {string} vid - ID del elemento mostrador
 * @param {number} min - Valor mínimo del rango
 * @param {number} max - Valor máximo del rango
 */
function chkRango(inp,vid,min,max){
  const v=parseFloat(inp.value);
  const el=document.getElementById(vid);
  if(isNaN(v)){
    el.className='psi-val';
    el.textContent='—';
    return;
  }
  const ok=v>=min&&v<=max;
  el.className='psi-val '+(ok?'psi-ok':'psi-fail');
  el.textContent=ok?'✔ OK':'✘ FUERA';
}

/**
 * Valida máximo permitido (tiempo de carga < 120 min)
 * @param {Element} inp - Input de tiempo
 * @param {string} vid - ID del elemento mostrador
 * @param {number} max - Valor máximo permitido
 */
function chkMax(inp,vid,max){
  const v=parseFloat(inp.value);
  const el=document.getElementById(vid);
  if(isNaN(v)){
    el.className='psi-val';
    el.textContent='—';
    return;
  }
  el.className='psi-val '+(v<max?'psi-ok':'psi-fail');
  el.textContent=v<max?'✔ OK':'✘ ALTO';
}
