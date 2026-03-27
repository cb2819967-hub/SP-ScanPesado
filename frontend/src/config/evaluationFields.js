const yesNoApproval = ['REPROBADO', 'APROBADO'];

export const evaluationSections = [
  {
    key: 'luces',
    title: 'A. Luces',
    fields: [
      { name: 'lucesGalibo', label: 'Luces galibo', type: 'select', options: ['IZQUIERDA FUNDIDA', 'DERECHA FUNDIDA', 'AMBAS FUNDIDAS', 'APROBADAS'] },
      { name: 'lucesAltas', label: 'Luces altas', type: 'select', options: ['IZQUIERDA FUNDIDA', 'DERECHA FUNDIDA', 'AMBAS FUNDIDAS', 'APROBADAS'] },
      { name: 'lucesBajas', label: 'Luces bajas', type: 'select', options: ['IZQUIERDA FUNDIDA', 'DERECHA FUNDIDA', 'AMBAS FUNDIDAS', 'APROBADAS'] },
      { name: 'lucesDemarcadorasDelanteras', label: 'Demarcadoras delanteras', type: 'select', options: ['IZQUIERDA FUNDIDA', 'DERECHA FUNDIDA', 'AMBAS FUNDIDAS', 'APROBADAS'] },
      { name: 'lucesDemarcadorasTraseras', label: 'Demarcadoras traseras', type: 'select', options: ['IZQUIERDA FUNDIDA', 'DERECHA FUNDIDA', 'AMBAS FUNDIDAS', 'APROBADAS'] },
      { name: 'lucesIndicadoras', label: 'Luces indicadoras', type: 'select', options: ['1 FUNDIDA', '2 FUNDIDAS', '3 FUNDIDAS', 'APROBADAS'] },
      { name: 'faroIzquierdo', label: 'Faro izquierdo', type: 'select', options: ['FLOJO', 'ROTO', 'APROBADO'] },
      { name: 'faroDerecho', label: 'Faro derecho', type: 'select', options: ['FLOJO', 'ROTO', 'APROBADO'] },
      { name: 'lucesDireccionalesDelanteras', label: 'Direccionales delanteras', type: 'select', options: ['IZQUIERDA FUNDIDA', 'DERECHA FUNDIDA', 'AMBAS FUNDIDAS', 'APROBADAS'] },
      { name: 'lucesDireccionalesTraseras', label: 'Direccionales traseras', type: 'select', options: ['IZQUIERDA FUNDIDA', 'DERECHA FUNDIDA', 'AMBAS FUNDIDAS', 'APROBADAS'] },
    ],
  },
  {
    key: 'llantas',
    title: 'B. Llantas',
    fields: [
      { name: 'llantasRinesDelanteros', label: 'Rines delanteros', type: 'select', options: ['DERECHO ROTO O SOLDADO', 'IZQUIERDO ROTO O SOLDADO', 'AMBOS ROTOS O SOLDADOS', 'APROBADOS'] },
      { name: 'llantasRinesTraseros', label: 'Rines traseros', type: 'select', options: ['DERECHO ROTO O SOLDADO', 'IZQUIERDO ROTO O SOLDADO', 'AMBOS ROTOS O SOLDADOS', 'APROBADOS'] },
      { name: 'llantasMasasDelanteras', label: 'Masas delanteras', type: 'select', options: ['DERECHA CON FUGA', 'IZQUIERDA CON FUGA', 'AMBAS CON FUGA', 'APROBADAS'] },
      { name: 'llantasMasasTraseras', label: 'Masas traseras', type: 'select', options: ['DERECHA CON FUGA', 'IZQUIERDA CON FUGA', 'AMBAS CON FUGA', 'APROBADAS'] },
    ],
  },
  {
    key: 'estructura',
    title: 'C. Direccion, estructura y accesos',
    fields: [
      { name: 'brazoPitman', label: 'Brazo pitman', type: 'select', options: ['GOLPEADO', 'APROBADO'] },
      { name: 'manijasDePuertas', label: 'Manijas de puertas', type: 'select', options: ['1 ROTA', '2 ROTAS', 'APROBADAS'] },
      { name: 'chavetas', label: 'Chavetas', type: 'select', options: ['FALTAN', 'APROBADAS'] },
      { name: 'chavetasNum', label: 'Numero de chavetas faltantes', type: 'number', min: 0 },
    ],
  },
  {
    key: 'aire',
    title: 'D. Sistema de aire / frenos',
    fields: [
      { name: 'compresor', label: 'Compresor', type: 'select', options: ['NO CORTA', 'REPROBADO', 'APROBADO'] },
      { name: 'tanquesDeAire', label: 'Tanques de aire', type: 'select', options: yesNoApproval },
      { name: 'tiempoDeCargaPsi', label: 'Tiempo de carga PSI', type: 'number', min: 0 },
      { name: 'tiempoDeCargaTiempo', label: 'Tiempo de carga (min)', type: 'number', min: 0 },
    ],
  },
  {
    key: 'motor',
    title: 'E. Motor y emisiones',
    fields: [
      { name: 'humo', label: 'Humo', type: 'select', options: yesNoApproval },
      { name: 'gobernado', label: 'Gobernado', type: 'select', options: yesNoApproval },
    ],
  },
  {
    key: 'otros',
    title: 'F. Otros',
    fields: [
      { name: 'cajaDireccion', label: 'Caja direccion', type: 'select', options: ['FUGA', 'APROBADA'] },
      { name: 'depositoAceite', label: 'Deposito aceite', type: 'select', options: ['FUGA', 'APROBADA'] },
      { name: 'parabrisas', label: 'Parabrisas', type: 'select', options: ['ESTRELLADO', 'APROBADO'] },
      { name: 'limpiaparabrisas', label: 'Limpiaparabrisas', type: 'select', options: ['FALTA 1 PLUMA', 'FALTAN 2 PLUMAS', 'NO FUNCIONA', 'APROBADO'] },
      { name: 'huelgo', label: 'Huelgo', type: 'select', options: ['REPROBADO', 'APROBADO'] },
      { name: 'huelgoCuanto', label: 'Huelgo en mm', type: 'number', min: 0 },
      { name: 'escape', label: 'Escape', type: 'select', options: ['FALTANTE', 'ROTO', 'APROBADO'] },
    ],
  },
  {
    key: 'evidencias',
    title: 'G. Evidencias',
    fields: [
      { name: 'evidencia1', label: 'Evidencia 1', type: 'file' },
      { name: 'evidencia2', label: 'Evidencia 2', type: 'file' },
      { name: 'evidencia3', label: 'Evidencia 3', type: 'file' },
      { name: 'evidencia4', label: 'Evidencia 4', type: 'file' },
      { name: 'evidencia5', label: 'Evidencia 5', type: 'file' },
      { name: 'comentariosTecnico', label: 'Comentarios', type: 'textarea' },
    ],
  },
];

export const wheelMetrics = {
  pressure: [
    { name: 'llantasPresionDelanteraIzquierda', label: 'Delantera izquierda PSI', min: 0 },
    { name: 'llantasPresionDelanteraDerecha', label: 'Delantera derecha PSI', min: 0 },
    { name: 'llantasPresionTraseraIzquierda1', label: 'Trasera izquierda 1 PSI', min: 0 },
    { name: 'llantasPresionTraseraIzquierda2', label: 'Trasera izquierda 2 PSI', min: 0 },
    { name: 'llantasPresionTraseraDerecha1', label: 'Trasera derecha 1 PSI', min: 0 },
    { name: 'llantasPresionTraseraDerecha2', label: 'Trasera derecha 2 PSI', min: 0 },
  ],
  depth: [
    { name: 'llantasProfundidadDelanteraIzquierda', label: 'Delantera izquierda mm', min: 0, step: 0.1 },
    { name: 'llantasProfundidadDelanteraDerecha', label: 'Delantera derecha mm', min: 0, step: 0.1 },
    { name: 'llantasProfundidadTraseraIzquierda1', label: 'Trasera izquierda 1 mm', min: 0, step: 0.1 },
    { name: 'llantasProfundidadTraseraIzquierda2', label: 'Trasera izquierda 2 mm', min: 0, step: 0.1 },
    { name: 'llantasProfundidadTraseraDerecha1', label: 'Trasera derecha 1 mm', min: 0, step: 0.1 },
    { name: 'llantasProfundidadTraseraDerecha2', label: 'Trasera derecha 2 mm', min: 0, step: 0.1 },
  ],
  birlos: [
    { name: 'llantasBirlosDelanteraIzquierda', label: 'Birlos delantera izquierda', type: 'select', options: ['ROTOS O FALTANTES', 'APROBADOS'] },
    { name: 'llantasBirlosDelanteraIzquierdaNum', label: 'Numero', type: 'number', min: 0 },
    { name: 'llantasBirlosDelanteraDerecha', label: 'Birlos delantera derecha', type: 'select', options: ['ROTOS O FALTANTES', 'APROBADOS'] },
    { name: 'llantasBirlosDelanteraDerechaNum', label: 'Numero', type: 'number', min: 0 },
    { name: 'llantasBirlosTraseraIzquierda', label: 'Birlos trasera izquierda', type: 'select', options: ['ROTOS O FALTANTES', 'APROBADOS'] },
    { name: 'llantasBirlosTraseraIzquierdaNum', label: 'Numero', type: 'number', min: 0 },
    { name: 'llantasBirlosTraseraDerecha', label: 'Birlos trasera derecha', type: 'select', options: ['ROTOS O FALTANTES', 'APROBADOS'] },
    { name: 'llantasBirlosTraseraDerechaNum', label: 'Numero', type: 'number', min: 0 },
  ],
  nuts: [
    { name: 'llantasTuercasDelanteraIzquierda', label: 'Tuercas delantera izquierda', type: 'select', options: ['ROTAS O FALTANTES', 'APROBADAS'] },
    { name: 'llantasTuercasDelanteraIzquierdaNum', label: 'Numero', type: 'number', min: 0 },
    { name: 'llantasTuercasDelanteraDerecha', label: 'Tuercas delantera derecha', type: 'select', options: ['ROTAS O FALTANTES', 'APROBADAS'] },
    { name: 'llantasTuercasDelanteraDerechaNum', label: 'Numero', type: 'number', min: 0 },
    { name: 'llantasTuercasTraseraIzquierda', label: 'Tuercas trasera izquierda', type: 'select', options: ['ROTAS O FALTANTES', 'APROBADAS'] },
    { name: 'llantasTuercasTraseraIzquierdaNum', label: 'Numero', type: 'number', min: 0 },
    { name: 'llantasTuercasTraseraDerecha', label: 'Tuercas trasera derecha', type: 'select', options: ['ROTAS O FALTANTES', 'APROBADAS'] },
    { name: 'llantasTuercasTraseraDerechaNum', label: 'Numero', type: 'number', min: 0 },
  ],
};
