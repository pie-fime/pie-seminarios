const DEFAULT_CRITERIA = [
  {
    id:'N1', num:1, weight:15,
    name:'Pertinencia e innovación del tema',
    scope:'Evalúa si el tema aporta valor real al área de ingeniería eléctrica y si existe una brecha de conocimiento claramente identificada.',
    levels:[
      {cls:'S',lbl:'Sobresaliente',rng:'90–100',
       desc:'El tema aborda una problemática vigente y relevante para la ingeniería eléctrica. La pregunta de investigación es original, bien delimitada y su resolución representa una contribución clara al campo. La hipótesis es verificable y está alineada con el objetivo general.'},
      {cls:'B',lbl:'Satisfactorio',rng:'70–89',
       desc:'El tema es pertinente y la problemática está identificada, aunque la aportación innovadora no se articula con suficiente precisión. La hipótesis y los objetivos son consistentes entre sí.'},
      {cls:'D',lbl:'En desarrollo',rng:'50–69',
       desc:'El tema es válido pero la problemática está poco justificada. La pregunta de investigación o la hipótesis presentan inconsistencias. La originalidad no se distingue con claridad del trabajo previo.'},
      {cls:'I',lbl:'Insuficiente',rng:'0–49',
       desc:'El tema es vago o no corresponde al área de la maestría. La hipótesis es indemostrable o está ausente. Los objetivos no guardan coherencia con la problemática planteada.'}
    ]
  },
  {
    id:'N2', num:2, weight:15,
    name:'Estado del arte actualizado',
    scope:'Evalúa la cobertura, actualidad y análisis crítico de la literatura científica revisada.',
    levels:[
      {cls:'S',lbl:'Sobresaliente',rng:'90–100',
       desc:'Se presentan al menos 5 artículos científicos recientes (últimos 5 años preferentemente) en una tabla comparativa con categorías relevantes. Se identifican claramente las brechas que justifican la investigación. El análisis va más allá de la descripción y establece relaciones críticas entre los trabajos.'},
      {cls:'B',lbl:'Satisfactorio',rng:'70–89',
       desc:'La tabla comparativa es completa y los artículos son pertinentes, aunque el análisis crítico es limitado. Se mencionan las brechas pero sin profundizar en su relación con la hipótesis propia.'},
      {cls:'D',lbl:'En desarrollo',rng:'50–69',
       desc:'La tabla comparativa existe pero con menos de 5 artículos o con fuentes no arbitradas. La revisión es principalmente descriptiva sin análisis comparativo.'},
      {cls:'I',lbl:'Insuficiente',rng:'0–49',
       desc:'No hay tabla comparativa o los artículos citados no son relevantes al campo. La revisión de literatura es superficial, desactualizada o está ausente.'}
    ]
  },
  {
    id:'N3', num:3, weight:15,
    name:'Metodología',
    scope:'Evalúa el rigor científico-técnico del enfoque metodológico y su adecuación para comprobar la hipótesis.',
    levels:[
      {cls:'S',lbl:'Sobresaliente',rng:'90–100',
       desc:'La metodología es coherente con la hipótesis y los objetivos. Los métodos seleccionados (matemáticos, computacionales, experimentales) son apropiados para el problema y se justifica cada decisión.'},
      {cls:'B',lbl:'Satisfactorio',rng:'70–89',
       desc:'La metodología es adecuada y los métodos están identificados, aunque la justificación de su elección es parcial.'},
      {cls:'D',lbl:'En desarrollo',rng:'50–69',
       desc:'La metodología está descrita de manera general sin detallar métodos específicos.'},
      {cls:'I',lbl:'Insuficiente',rng:'0–49',
       desc:'La metodología es inapropiada o está ausente.'}
    ]
  },
  {
    id:'N4', num:4, weight:10,
    name:'Formalidad del marco teórico',
    scope:'Evalúa el sustento conceptual y la rigurosidad en el uso de fundamentos matemáticos, físicos o computacionales propios del área.',
    levels:[
      {cls:'S',lbl:'Sobresaliente',rng:'90–100',
       desc:'Los conceptos y herramientas teóricas empleadas están correctamente definidos y referenciados. Se utiliza notación matemática formal cuando es pertinente. El marco teórico da soporte directo a la metodología propuesta.'},
      {cls:'B',lbl:'Satisfactorio',rng:'70–89',
       desc:'El marco teórico cubre los conceptos principales pero con algunas omisiones o sin la formalización matemática esperada a nivel de maestría. Las referencias son apropiadas.'},
      {cls:'D',lbl:'En desarrollo',rng:'50–69',
       desc:'El marco teórico es incompleto o algunos conceptos están mal definidos. Se mezclan fuentes primarias con fuentes secundarias no arbitradas.'},
      {cls:'I',lbl:'Insuficiente',rng:'0–49',
       desc:'El marco teórico está ausente, es superficial o contiene errores conceptuales significativos. Las referencias no son confiables o no existen.'}
    ]
  },
  {
    id:'N5', num:5, weight:20,
    name:'Resultados presentados',
    scope:'Evalúa la calidad, pertinencia y análisis de los resultados obtenidos (simulaciones, experimentos, análisis de datos).',
    levels:[
      {cls:'S',lbl:'Sobresaliente',rng:'90–100',
       desc:'Los resultados son coherentes con la metodología y se presentan con gráficas, tablas o simulaciones bien etiquetadas. Se incluye análisis cuantitativo y se discute la relación de los resultados con la hipótesis. Se señalan limitaciones y se proponen mejoras.'},
      {cls:'B',lbl:'Satisfactorio',rng:'70–89',
       desc:'Los resultados están presentes y son pertinentes, aunque el análisis es parcial. Las figuras o tablas tienen buena presentación pero la discusión no vincula explícitamente los resultados con la hipótesis.'},
      {cls:'D',lbl:'En desarrollo',rng:'50–69',
       desc:'Los resultados son preliminares o incompletos. La presentación es poco clara (ejes sin etiquetas, falta de unidades). La discusión es descriptiva sin análisis cuantitativo.'},
      {cls:'I',lbl:'Insuficiente',rng:'0–49',
       desc:'No se presentan resultados o los existentes no tienen relación con la metodología planteada. Ausencia total de análisis.'}
    ]
  },
  {
    id:'N7', num:6, weight:5,
    name:'Claridad en la presentación y comunicación efectiva',
    scope:'Evalúa la organización, legibilidad y comunicación durante la exposición.',
    levels:[
      {cls:'S',lbl:'Sobresaliente',rng:'90–100',
       desc:'Las diapositivas son limpias, con jerarquía visual clara y sin exceso de texto. El expositor domina el tema, mantiene contacto visual y responde con solvencia las preguntas del comité.'},
      {cls:'B',lbl:'Satisfactorio',rng:'70–89',
       desc:'La presentación es ordenada y el expositor se expresa con claridad, aunque con algunas láminas sobrecargadas. Las respuestas al comité son adecuadas.'},
      {cls:'D',lbl:'En desarrollo',rng:'50–69',
       desc:'La presentación presenta problemas de orden o legibilidad. El expositor lee de las diapositivas o muestra inseguridad ante preguntas del comité.'},
      {cls:'I',lbl:'Insuficiente',rng:'0–49',
       desc:'La presentación es desorganizada, las diapositivas son ilegibles o el expositor no demuestra dominio suficiente del tema.'}
    ]
  },
  {
    id:'N8', num:7, weight:5,
    name:'Seguimiento del plan de trabajo',
    scope:'Evalúa la claridad del cronograma y el avance respecto a las actividades planificadas.',
    levels:[
      {cls:'S',lbl:'Sobresaliente',rng:'90–100',
       desc:'Se presenta un cronograma claro con etapas definidas, y el avance reportado es consistente con lo planificado (90% o más de las actividades del período completadas).'},
      {cls:'B',lbl:'Satisfactorio',rng:'70–89',
       desc:'El cronograma existe y es comprensible; el avance presenta retrasos menores (70–89% de las actividades del período completadas) con explicación razonable.'},
      {cls:'D',lbl:'En desarrollo',rng:'50–69',
       desc:'El cronograma es vago o poco realista, o el avance muestra retrasos significativos (50–69% completado) sin justificación.'},
      {cls:'I',lbl:'Insuficiente',rng:'0–49',
       desc:'No se presenta cronograma o el avance real es menor al 50% de lo planificado para el período sin ninguna justificación.'}
    ]
  },
  {
    id:'N9', num:8, weight:5, slider:true,
    name:'Tiempo de presentación',
    scope:'Evalúa la duración de la presentación de acuerdo con los rangos indicados.',
    levels:[
      {cls:'S',lbl:'Sobresaliente',rng:'90–100',desc:'10 minutos o menos.'},
      {cls:'B',lbl:'Satisfactorio',rng:'70–89',desc:'Más de 10 minutos y menos de 11 minutos.'},
      {cls:'D',lbl:'En desarrollo',rng:'50–69',desc:'De 11 a 15 minutos, inclusive.'},
      {cls:'I',lbl:'Insuficiente',rng:'0–49',desc:'Más de 15 minutos.'}
    ]
  },
  {
    id:'N6', num:9, weight:10,
    name:'Conclusiones',
    scope:'Evalúa si las conclusiones responden a los objetivos y la hipótesis, e identifican trabajo futuro.',
    levels:[
      {cls:'S',lbl:'Sobresaliente',rng:'90–100',
       desc:'Las conclusiones responden directamente a los objetivos planteados y toman postura frente a la hipótesis con base en los resultados. Se identifican limitaciones y se proponen líneas de trabajo futuro concretas y justificadas.'},
      {cls:'B',lbl:'Satisfactorio',rng:'70–89',
       desc:'Las conclusiones son consistentes con los resultados aunque sin posicionarse claramente sobre la hipótesis. Se menciona trabajo futuro de forma general.'},
      {cls:'D',lbl:'En desarrollo',rng:'50–69',
       desc:'Las conclusiones son un resumen del trabajo sin aportar juicio crítico. No se establece relación con la hipótesis ni con los objetivos específicos.'},
      {cls:'I',lbl:'Insuficiente',rng:'0–49',
       desc:'Las conclusiones están ausentes, son triviales o contradicen los resultados presentados.'}
    ]
  }
];

const SHEETS = ['Periodos','Estudiantes','Evaluadores','Asignaciones','Evaluaciones','Usuarios','Configuracion','RubricaActual','Sesiones'];
const NEW_EVALUATION_HEADERS=['Ronda','Rubrica_JSON','Calificaciones_JSON','Calificaciones_Originales_JSON','Tiempo_JSON','Observaciones_Criterios_JSON'];
const RUBRIC_HEADERS=['ID_Criterio','Nombre','Alcance','Sobresaliente','Satisfactorio','En_desarrollo','Insuficiente','Ponderacion','Activo','Deslizador'];
const STUDENT_HEADERS=['ID_Estudiante','Matricula','Nombre','Semestre','Titulo_Tesis','Director_Tesis','ID_Periodo','Estado','Programa'];

function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const specs = {
    Periodos:['ID_Periodo','Nombre_Periodo','Fecha_Inicio','Fecha_Fin','Estado'],
    Estudiantes:STUDENT_HEADERS,
    Evaluadores:['ID_Evaluador','Nombre','Correo','Usuario','Estado'],
    Asignaciones:['ID_Asignacion','ID_Periodo','ID_Estudiante','ID_Evaluador','Fecha_Asignacion','Estado'],
    Evaluaciones:['ID_Evaluacion','ID_Periodo','ID_Estudiante','ID_Evaluador','Calificacion_Individual','Observaciones_Generales','Fecha_Envio','Estado'].concat(NEW_EVALUATION_HEADERS),
    Usuarios:['ID_Usuario','Nombre','Usuario','Password_Hash','Salt','Rol','Estado','Debe_Cambiar'],
    Configuracion:['Clave','Valor'],
    RubricaActual:RUBRIC_HEADERS,
    Sesiones:['Token','ID_Usuario','Expira','Creado']
  };
  Object.keys(specs).forEach(function(name) {
    let sh=ss.getSheetByName(name);
    if (!sh) sh=ss.insertSheet(name);
    sh.clear();
    sh.getRange(1,1,1,specs[name].length).setValues([specs[name]]);
    sh.setFrozenRows(1);
  });
  const config=ss.getSheetByName('Configuracion');
  config.getRange(2,1,3,2).setValues([
    ['API_MAX_SESSION_HOURS','8'],
    ['RUBRIC_VERSION','2'],
    ['APP_NAME','SEMI-TESIS']
  ]);
  writeDefaultRubric(ss.getSheetByName('RubricaActual'));
}

function writeDefaultRubric(sheet){
  const headers=sheet.getDataRange().getValues()[0];
  if(RUBRIC_HEADERS.some(h=>!headers.includes(h)))throw new Error('Faltan columnas en RubricaActual');
  const rows=DEFAULT_CRITERIA.map(c=>{
    const record={ID_Criterio:c.id,Nombre:c.name,Alcance:c.scope,Sobresaliente:c.levels[0].desc,Satisfactorio:c.levels[1].desc,En_desarrollo:c.levels[2].desc,Insuficiente:c.levels[3].desc,Ponderacion:c.weight/100,Penalizacion_Tiempo:false,Activo:true,Deslizador:!!c.slider};
    return headers.map(h=>record[h]===undefined?'':record[h]);
  });
  sheet.getRange(2,1,rows.length,rows[0].length).setValues(rows);
}
function replaceRubricWithDefault(){
  return withDirectoryLock(()=>{
    const sheet=sh('RubricaActual');
    if(!sheet)throw new Error('Falta la hoja RubricaActual; ejecuta primero migrateRubric()');
    const headers=sheet.getDataRange().getValues()[0];
    if(RUBRIC_HEADERS.filter(h=>h!=='Deslizador').some(h=>!headers.includes(h)))throw new Error('Faltan columnas en RubricaActual');
    if(!headers.includes('Deslizador'))sheet.getRange(1,headers.length+1).setValue('Deslizador');
    const lastRow=sheet.getLastRow(),lastColumn=sheet.getLastColumn();
    writeDefaultRubric(sheet);
    if(lastRow>DEFAULT_CRITERIA.length+1)sheet.getRange(DEFAULT_CRITERIA.length+2,1,lastRow-DEFAULT_CRITERIA.length-1,lastColumn).clearContent();
    getRubric();
  });
}
function migrateRubric(){
  const spreadsheet=ss();
  const evaluations=sh('Evaluaciones'),values=evaluations.getDataRange().getValues(),headers=values[0];
  if(!headers||headers.indexOf('ID_Evaluacion')<0)throw new Error('No se encontró la estructura de evaluaciones');
  const found=NEW_EVALUATION_HEADERS.filter(h=>headers.includes(h));
  if(found.length&&found.length!==NEW_EVALUATION_HEADERS.length)throw new Error('La hoja Evaluaciones tiene columnas incompletas de la nueva rúbrica');
  const roundIndex=headers.indexOf('Ronda');
  if(roundIndex>=0&&values.slice(1).some(row=>row[headers.indexOf('ID_Evaluacion')]&&row[roundIndex]!==''&&![1,2].includes(Number(row[roundIndex]))))throw new Error('Hay evaluaciones de una versión desconocida; no se eliminó ningún registro');
  if(!found.length)evaluations.getRange(1,headers.length+1,1,NEW_EVALUATION_HEADERS.length).setValues([NEW_EVALUATION_HEADERS]);
  let sheet=spreadsheet.getSheetByName('RubricaActual');
  if(!sheet){
    sheet=spreadsheet.insertSheet('RubricaActual');
    sheet.getRange(1,1,1,RUBRIC_HEADERS.length).setValues([RUBRIC_HEADERS]);
    sheet.setFrozenRows(1);
    writeDefaultRubric(sheet);
  }
  getRubric();
  for(let i=values.length-1;i>0;i--)if(values[i][headers.indexOf('ID_Evaluacion')]&&(roundIndex<0||!values[i][roundIndex]||Number(values[i][roundIndex])===1))evaluations.deleteRow(i+1);
  const oldRubric=spreadsheet.getSheetByName('Rubrica');
  if(oldRubric)spreadsheet.deleteSheet(oldRubric);
}

function migrateStudentProgram(){
  return withDirectoryLock(()=>{
    const sheet=sh('Estudiantes');
    if(!sheet)throw new Error('No existe la hoja Estudiantes');
    const headers=sheet.getDataRange().getValues()[0];
    if(STUDENT_HEADERS.filter(h=>h!=='Programa').some(h=>!headers.includes(h)))throw new Error('La hoja Estudiantes no tiene las columnas necesarias');
    const count=headers.filter(h=>h==='Programa').length;
    if(count>1)throw new Error('La hoja Estudiantes tiene columnas Programa duplicadas');
    if(!count)sheet.getRange(1,headers.length+1).setValue('Programa');
  });
}

function createFirstAdmin() {
  const shUsers=sh('Usuarios');
  const existing=table('Usuarios');
  if(existing.some(u=>u.Rol==='admin'))throw new Error('Ya existe una cuenta de administrador');
  const username=Session.getActiveUser().getEmail();
  const password=PropertiesService.getScriptProperties().getProperty('ADMIN_INITIAL_PASSWORD');
  if (!password) throw new Error('Falta configurar ADMIN_INITIAL_PASSWORD');
  const salt=Utilities.getUuid();
  shUsers.appendRow(['USR-001','Administrador',username,hashPassword(password,salt),salt,'admin','Activo',true]);
  Logger.log('Administrador creado: %s',username);
}

function doPost(e) {
  try {
    const body=JSON.parse(e.postData.contents);
    if (body.action==='login') return json({ok:true,data:login(body.username,body.password)});
    const session=validateSession(body.token);
    if (!session) return json({ok:false,error:'Sesión inválida o vencida'});
    if (body.action==='updateProfile') return json({ok:true,data:withDirectoryLock(()=>updateProfile(session,body.profile))});
    if (body.action==='dashboard' && session.role==='admin') return json({ok:true,data:dashboard()});
    if (body.action==='managementData' && session.role==='admin') return json({ok:true,data:managementData()});
    if (body.action==='administrators' && session.role==='admin') return json({ok:true,data:administrators()});
    if (body.action==='createAdministrator' && session.role==='admin') return json({ok:true,data:withDirectoryLock(()=>createAdministrator(body.administrator))});
    if (body.action==='evaluatorDashboard' && session.role==='evaluator') return json({ok:true,data:evaluatorDashboard(session)});
    if (body.action==='reports' && session.role==='admin') return json({ok:true,data:reportData(body.periodId)});
    if (body.action==='saveStudent' && session.role==='admin') return json({ok:true,data:withDirectoryLock(()=>saveStudent(body.student))});
    if (body.action==='saveEvaluator' && session.role==='admin') return json({ok:true,data:withDirectoryLock(()=>saveEvaluator(body.evaluator))});
    if (body.action==='deleteStudents' && session.role==='admin') return json({ok:true,data:deleteDirectoryRecords('students',body.ids)});
    if (body.action==='deleteEvaluators' && session.role==='admin') return json({ok:true,data:deleteDirectoryRecords('evaluators',body.ids)});
    if (body.action==='deletePeriod' && session.role==='admin') return json({ok:true,data:deletePeriod(body.id)});
    if (body.action==='deletePeriods' && session.role==='admin') return json({ok:true,data:deletePeriods(body.ids)});
    if (body.action==='createPeriod' && session.role==='admin') return json({ok:true,data:withDirectoryLock(()=>createPeriod(body.period))});
    if (body.action==='activatePeriod' && session.role==='admin') return json({ok:true,data:withDirectoryLock(()=>activatePeriod(body.id))});
    if (body.action==='importStudents' && session.role==='admin') return json({ok:true,data:withDirectoryLock(()=>importStudents(body.students))});
    if (body.action==='importEvaluators' && session.role==='admin') return json({ok:true,data:withDirectoryLock(()=>importEvaluators(body.evaluators))});
    if (body.action==='saveAssignment' && session.role==='admin') return json({ok:true,data:withDirectoryLock(()=>saveAssignment(body.studentId,body.evaluatorIds))});
    if (body.action==='submitEvaluation' && session.role==='evaluator') return json({ok:true,data:withDirectoryLock(()=>submitEvaluation(session,body))});
    return json({ok:false,error:'Acción no autorizada'});
  } catch (err) { return json({ok:false,error:String(err.message||err)}); }
}

function doGet(){return json({ok:true,data:{app:'SEMI-TESIS',status:'activo'}});}
function json(obj){return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);}
function ss(){
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('Falta configurar SPREADSHEET_ID');
  return SpreadsheetApp.openById(id);
}
function sh(name){return ss().getSheetByName(name);}
function table(name){const s=sh(name);const values=s.getDataRange().getValues();if(values.length<2)return [];const heads=values.shift();return values.filter(r=>r.some(v=>v!=='')).map(r=>Object.fromEntries(heads.map((h,i)=>[h,r[i]]))); }
function nextId(prefix,name,column){const rows=table(name);let max=0;rows.forEach(r=>{const n=parseInt(String(r[column]).replace(/\D/g,''),10);if(n>max)max=n;});return prefix+'-'+String(max+1).padStart(3,'0');}
function hashPassword(password,salt){const bytes=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,salt+password);return bytes.map(b=>((b<0?b+256:b).toString(16).padStart(2,'0'))).join('');}
function login(username,password){
  const users=table('Usuarios').find(u=>u.Usuario===username && u.Estado==='Activo');
  if(!users||hashPassword(password,users.Salt)!==users.Password_Hash)throw new Error('Usuario o contraseña incorrectos');
  const token=Utilities.getUuid();const expiry=new Date(Date.now()+8*60*60*1000);
  sh('Sesiones').appendRow([token,users.ID_Usuario,expiry,new Date()]);
  const result={token:token,role:users.Rol==='admin'?'admin':'evaluator',name:users.Nombre,
    username:users.Usuario,email:users.Rol==='evaluator'?(table('Evaluadores').find(e=>e.Usuario===users.Usuario)||{}).Correo:'',
    requirePasswordChange:users.Debe_Cambiar===true};
  return result;
}
function validateSession(token){
  if(!token)return null;
  const now=new Date();
  const rows=sh('Sesiones').getDataRange().getValues();const head=rows.shift();
  const ti=head.indexOf('Token'),ui=head.indexOf('ID_Usuario'),ei=head.indexOf('Expira');
  const found=rows.find(r=>r[ti]===token && new Date(r[ei])>now);if(!found)return null;
  const user=table('Usuarios').find(u=>u.ID_Usuario===found[ui] && u.Estado==='Activo');if(!user)return null;
  return {id:user.ID_Usuario,name:user.Nombre,username:user.Usuario,role:user.Rol};
}
function updateProfile(session, profile){
  if(!profile || typeof profile.currentPassword!=='string')
    throw new Error('Introduce tu contraseña actual');
  const usersSheet=sh('Usuarios');
  const values=usersSheet.getDataRange().getValues(), headers=values[0];
  const idIndex=headers.indexOf('ID_Usuario'), nameIndex=headers.indexOf('Nombre');
  const usernameIndex=headers.indexOf('Usuario'), hashIndex=headers.indexOf('Password_Hash');
  const saltIndex=headers.indexOf('Salt');
  const rowIndex=values.findIndex((row,index)=>index>0&&row[idIndex]===session.id);
  if(rowIndex<1)throw new Error('No se encontró la cuenta');
  const row=values[rowIndex];
  if(hashPassword(profile.currentPassword,row[saltIndex])!==row[hashIndex])
    throw new Error('La contraseña actual es incorrecta');
  const name=String(profile.name||'').trim(), username=String(profile.username||'').trim();
  if(!name||!username||/\s/.test(username)||name.startsWith('=')||username.startsWith('='))
    throw new Error('Introduce un nombre y un usuario válidos, sin espacios en el usuario');
  if(values.some((other,index)=>index!==rowIndex&&String(other[usernameIndex]).toLowerCase()===username.toLowerCase()))
    throw new Error('El usuario ya existe');
  const newPassword=String(profile.newPassword||'');
  if(newPassword && (newPassword.length<12||!newPassword.trim()))
    throw new Error('La nueva contraseña debe tener al menos 12 caracteres y no estar vacía');
  let email='';
  let evaluatorSheet,evaluatorRow,evaluatorValues,evaluatorHeaders,evaluatorName,evaluatorEmail;
  if(session.role==='evaluator'){
    evaluatorSheet=sh('Evaluadores'); evaluatorValues=evaluatorSheet.getDataRange().getValues();
    evaluatorHeaders=evaluatorValues[0];
    const evaluatorUsername=evaluatorHeaders.indexOf('Usuario');
    evaluatorName=evaluatorHeaders.indexOf('Nombre');
    evaluatorEmail=evaluatorHeaders.indexOf('Correo');
    evaluatorRow=evaluatorValues.findIndex((item,index)=>index>0&&item[evaluatorUsername]===row[usernameIndex]);
    if(evaluatorRow<1)throw new Error('No se encontró el registro del evaluador');
    email=String(profile.email||'').trim();
    if(!email||email.startsWith('='))throw new Error('Introduce un correo válido');
    if(evaluatorValues.some((item,index)=>index!==evaluatorRow&&String(item[evaluatorEmail]).toLowerCase()===email.toLowerCase()))
      throw new Error('El correo ya está registrado');
  }
  usersSheet.getRange(rowIndex+1,nameIndex+1,1,2).setValues([[name,username]]);
  if(newPassword){
    const newSalt=Utilities.getUuid();
    usersSheet.getRange(rowIndex+1,hashIndex+1,1,2).setValues([[hashPassword(newPassword,newSalt),newSalt]]);
  }
  if(session.role==='evaluator')evaluatorSheet.getRange(evaluatorRow+1,evaluatorName+1,1,3).setValues([[name,email,username]]);
  return {name:name,username:username,email:email};
}

function dashboard(){
  const periods=table('Periodos');const active=periods.find(p=>p.Estado==='Activo')||{};
  return {period:{id:active.ID_Periodo,name:active.Nombre_Periodo,start:active.Fecha_Inicio,end:active.Fecha_Fin,state:active.Estado},
    students:table('Estudiantes').filter(s=>s.ID_Periodo===active.ID_Periodo).map(mapStudent),
    evaluators:table('Evaluadores').map(e=>({id:e.ID_Evaluador,name:e.Nombre,email:e.Correo,username:e.Usuario,state:e.Estado})),
    assignments:table('Asignaciones').filter(a=>a.ID_Periodo===active.ID_Periodo).map(a=>({id:a.ID_Asignacion,student:a.ID_Estudiante,evaluator:a.ID_Evaluador,state:a.Estado})),
    evaluations:table('Evaluaciones').filter(e=>e.ID_Periodo===active.ID_Periodo&&Number(e.Ronda||1)===2).map(mapEvaluation)
  };
}
function managementData(){
  const d=dashboard();
  const periods=table('Periodos').map(p=>({id:p.ID_Periodo,name:p.Nombre_Periodo,start:p.Fecha_Inicio,end:p.Fecha_Fin,state:p.Estado}));
  const active=periods.find(p=>p.state==='Activo')||{};
  return {period:active,periods:periods,
    students:table('Estudiantes').map(mapStudent),
    evaluators:d.evaluators};
}
function reportData(periodId){
  const allPeriods=table('Periodos').map(p=>({id:p.ID_Periodo,name:p.Nombre_Periodo,start:p.Fecha_Inicio,end:p.Fecha_Fin,state:p.Estado}));
  const selected=allPeriods.find(p=>p.id===periodId)||allPeriods.find(p=>p.state==='Activo')||allPeriods[0]||{};
  const students=table('Estudiantes').filter(s=>s.ID_Periodo===selected.id).map(mapStudent);
  const evaluators=table('Evaluadores').map(e=>({id:e.ID_Evaluador,name:e.Nombre,email:e.Correo,username:e.Usuario,state:e.Estado}));
  const assignments=table('Asignaciones').filter(a=>a.ID_Periodo===selected.id).map(a=>({id:a.ID_Asignacion,student:a.ID_Estudiante,evaluator:a.ID_Evaluador,state:a.Estado}));
  const evaluations=table('Evaluaciones').filter(e=>e.ID_Periodo===selected.id&&Number(e.Ronda||1)===2).map(mapEvaluation);
  return {period:selected,periods:allPeriods,students,evaluators,assignments,evaluations,rubric:getRubric(false)};
}
function evaluatorDashboard(session){
  const d=dashboard();const ev=d.evaluators.find(e=>e.username===session.username)||d.evaluators.find(e=>e.name===session.name);
  if(!ev)return {evaluator:{name:session.name},period:d.period,students:[],completed:[],evaluations:[],rubric:getRubric()};
  const assigned=d.assignments.filter(a=>a.evaluator===ev.id&&a.state==='Activa').map(a=>a.student);
  const students=d.students.filter(s=>assigned.includes(s.id));
  const completed=d.evaluations.filter(e=>e.evaluator===ev.id).map(e=>e.student);
  return {evaluator:ev,period:d.period,students:students,completed:completed,evaluations:d.evaluations,rubric:getRubric()};
}
function mapStudent(s){
  return {id:s.ID_Estudiante,matricula:s.Matricula,name:s.Nombre,program:s.Programa||'',semester:s.Semestre,thesis:s.Titulo_Tesis,director:s.Director_Tesis,period:s.ID_Periodo,state:s.Estado};
}
function mapEvaluation(e){
  const savedRubric=e.Rubrica_JSON?JSON.parse(e.Rubrica_JSON):null;
  return {id:e.ID_Evaluacion,student:e.ID_Estudiante,evaluator:e.ID_Evaluador,round:Number(e.Ronda||1),
    individual:Number(e.Calificacion_Individual),observations:e.Observaciones_Generales,
    criteria:JSON.parse(e.Calificaciones_JSON),
    rawCriteria:e.Calificaciones_Originales_JSON?JSON.parse(e.Calificaciones_Originales_JSON):null,
    rubric:savedRubric,
    time:e.Tiempo_JSON?JSON.parse(e.Tiempo_JSON):null,
    criterionObservations:e.Observaciones_Criterios_JSON?JSON.parse(e.Observaciones_Criterios_JSON):{}};
}
function getRubric(validate=true){
  if(!ss().getSheetByName('RubricaActual'))throw new Error('Falta instalar la nueva rúbrica con migrateRubric()');
  const rubric=table('RubricaActual').filter(r=>r.Activo===true||r.Activo==='TRUE'||r.Activo==='Sí').map(r=>({
    id:String(r.ID_Criterio||'').trim(),name:String(r.Nombre||'').trim(),scope:String(r.Alcance||''),weight:r.Ponderacion===''?NaN:Number(r.Ponderacion),
    levels:[{lbl:'Sobresaliente',rng:'90–100',desc:r.Sobresaliente},{lbl:'Satisfactorio',rng:'70–89',desc:r.Satisfactorio},{lbl:'En desarrollo',rng:'50–69',desc:r.En_desarrollo},{lbl:'Insuficiente',rng:'0–49',desc:r.Insuficiente}],
    hasTimePenalty:false,
    slider:r.Deslizador===true||r.Deslizador==='TRUE'||r.Deslizador==='Sí'}));
  if(validate&&(!rubric.length||new Set(rubric.map(c=>c.id)).size!==rubric.length||rubric.some(c=>!/^[A-Za-z][A-Za-z0-9_-]*$/.test(c.id)||!c.name||!Number.isFinite(c.weight)||c.weight<0||c.levels.some(l=>!l.desc))||Math.abs(rubric.reduce((sum,c)=>sum+c.weight,0)-1)>0.0001))throw new Error('La rúbrica actual es inválida: revisa IDs, descriptores y ponderaciones');
  return rubric;
}
function createPeriod(period){
  if(!period||typeof period.name!=='string'||!period.name.trim()||period.name.trim().startsWith('='))throw new Error('Introduce un nombre de periodo válido');
  const validDate=value=>{
    if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
    const date=new Date(value+'T00:00:00Z');
    return !isNaN(date.getTime())&&date.toISOString().slice(0,10)===value;
  };
  if(!validDate(period.start)||!validDate(period.end))throw new Error('Introduce fechas válidas para el periodo');
  if(period.start>period.end)throw new Error('La fecha de fin no puede ser anterior a la fecha de inicio');
  const name=period.name.trim();
  if(table('Periodos').some(p=>String(p.Nombre_Periodo).trim().toLowerCase()===name.toLowerCase()))throw new Error('Ya existe un periodo con ese nombre');
  const id=nextId('PER','Periodos','ID_Periodo');
  sh('Periodos').appendRow([id,name,period.start,period.end,'Inactivo']);
  return {id:id};
}
function saveStudent(s){
  if(!s.name||!s.matricula)throw new Error('Matrícula y nombre son obligatorios');
  if(!['MCIE','DIE'].includes(s.program))throw new Error('Selecciona el programa MCIE o DIE');
  const sheet=sh('Estudiantes'),headers=studentHeaders(sheet);
  const periods=table('Periodos');
  const active=periods.find(p=>p.Estado==='Activo')||{};
  const requestedPeriod=s.periodId||s.period;
  const period=periods.find(p=>p.ID_Periodo===requestedPeriod||p.Nombre_Periodo===requestedPeriod)||active;
  if(!period.ID_Periodo)throw new Error('Crea un periodo antes de registrar estudiantes');
  const duplicate=table('Estudiantes').some(student=>student.ID_Estudiante!==s.id&&student.ID_Periodo===period.ID_Periodo&&String(student.Matricula).toLowerCase()===String(s.matricula).toLowerCase());
  if(duplicate)throw new Error('La matrícula ya existe en esta cohorte');
  const id=s.id||nextId('EST','Estudiantes','ID_Estudiante');
  const record={ID_Estudiante:id,Matricula:s.matricula,Nombre:s.name,Semestre:s.semester,Titulo_Tesis:s.thesis,Director_Tesis:s.director,ID_Periodo:period.ID_Periodo,Estado:s.state||'Activo',Programa:s.program};
  if(s.id){
    const values=sheet.getDataRange().getValues();const idColumn=headers.indexOf('ID_Estudiante');
    const index=values.findIndex((valuesRow,rowIndex)=>rowIndex>0&&valuesRow[idColumn]===s.id);
    if(index<0)throw new Error('No se encontró el estudiante que se intenta actualizar');
    const range=sheet.getRange(index+1,1,1,headers.length),formulas=range.getFormulas()[0];
    range.setValues([headers.map((header,i)=>Object.prototype.hasOwnProperty.call(record,header)?record[header]:(formulas[i]||values[index][i]))]);
  }else sheet.appendRow(headers.map(header=>Object.prototype.hasOwnProperty.call(record,header)?record[header]:''));
  return {id:id};
}
function studentHeaders(sheet){
  const headers=sheet.getDataRange().getValues()[0];
  if(STUDENT_HEADERS.some(h=>headers.filter(header=>header===h).length!==1))throw new Error('Revisa las columnas de Estudiantes y ejecuta migrateStudentProgram() si falta Programa');
  return headers;
}
function saveEvaluator(e){
  if(!e.name||!e.email||!e.username||!e.password)throw new Error('Todos los datos del evaluador son obligatorios');
  if(table('Usuarios').some(user=>String(user.Usuario).toLowerCase()===String(e.username).toLowerCase()))throw new Error('El usuario ya existe');
  if(table('Evaluadores').some(evaluator=>String(evaluator.Correo).toLowerCase()===String(e.email).toLowerCase()))throw new Error('El correo ya está registrado');
  const id=nextId('EV','Evaluadores','ID_Evaluador');
  sh('Evaluadores').appendRow([id,e.name,e.email,e.username,'Activo']);
  const userId=nextId('USR','Usuarios','ID_Usuario');const salt=Utilities.getUuid();
  sh('Usuarios').appendRow([userId,e.name,e.username,hashPassword(e.password,salt),salt,'evaluator','Activo',true]);
  return {id:id};
}
function deleteDirectoryRecords(type,ids){
  if(!Array.isArray(ids)||!ids.length||ids.some(id=>typeof id!=='string'||!id.trim())||new Set(ids).size!==ids.length)throw new Error('Selecciona registros válidos para borrar');
  const isStudents=type==='students';
  const sheetName=isStudents?'Estudiantes':'Evaluadores';
  const idColumn=isStudents?'ID_Estudiante':'ID_Evaluador';
  const selected=new Set(ids);
  return withDirectoryLock(()=>{
    const records=table(sheetName).filter(row=>selected.has(row[idColumn]));
    if(records.length!==ids.length)throw new Error('No se encontraron todos los registros seleccionados');
    if(table('Asignaciones').some(row=>selected.has(row[idColumn]))||table('Evaluaciones').some(row=>selected.has(row[idColumn])))throw new Error('No se puede borrar: hay asignaciones o evaluaciones asociadas');
    if(!isStudents){
      const allEvaluators=table('Evaluadores');
      const usernames=new Set(records.map(row=>String(row.Usuario).toLowerCase()));
      if(allEvaluators.some(row=>!selected.has(row.ID_Evaluador)&&usernames.has(String(row.Usuario).toLowerCase())))throw new Error('No se puede borrar: la cuenta de acceso pertenece a otro evaluador');
      const users=sh('Usuarios');
      const values=users.getDataRange().getValues();
      const headers=values[0];
      const userIndex=headers.indexOf('Usuario'),roleIndex=headers.indexOf('Rol'),stateIndex=headers.indexOf('Estado');
      if(userIndex<0||roleIndex<0||stateIndex<0)throw new Error('La hoja Usuarios no tiene las columnas necesarias');
      const matching=values.slice(1).filter(row=>usernames.has(String(row[userIndex]).toLowerCase()));
      if(matching.some(row=>row[roleIndex]!=='evaluator'))throw new Error('No se puede desactivar una cuenta que no sea de evaluador');
      values.slice(1).forEach((row,index)=>{
        if(usernames.has(String(row[userIndex]).toLowerCase()))users.getRange(index+2,stateIndex+1).setValue('Inactivo');
      });
    }
    const sheet=sh(sheetName);
    const rows=sheet.getDataRange().getValues();
    const index=rows[0].indexOf(idColumn);
    if(index<0)throw new Error('La hoja '+sheetName+' no tiene la columna '+idColumn);
    for(let i=rows.length-1;i>0;i--)if(selected.has(rows[i][index]))sheet.deleteRow(i+1);
    return {deleted:ids.length};
  });
}
function deletePeriod(id){
  return deletePeriods([id]);
}
function deletePeriods(ids){
  if(!Array.isArray(ids)||!ids.length||ids.some(id=>typeof id!=='string'||!id.trim())||new Set(ids).size!==ids.length)throw new Error('Selecciona periodos válidos para borrar');
  const selected=new Set(ids);
  return withDirectoryLock(()=>{
    const sheet=sh('Periodos'),rows=sheet.getDataRange().getValues(),index=rows[0].indexOf('ID_Periodo');
    if(index<0)throw new Error('La hoja Periodos no tiene la columna ID_Periodo');
    const matching=rows.slice(1).filter(row=>selected.has(row[index]));
    if(matching.length!==ids.length||new Set(matching.map(row=>row[index])).size!==ids.length)throw new Error('No se encontraron todos los periodos seleccionados de forma única');
    if(['Estudiantes','Asignaciones','Evaluaciones'].some(name=>table(name).some(row=>selected.has(row.ID_Periodo))))throw new Error('No se puede borrar: hay estudiantes, asignaciones o evaluaciones asociadas');
    for(let i=rows.length-1;i>0;i--)if(selected.has(rows[i][index]))sheet.deleteRow(i+1);
    return {deleted:ids.length};
  });
}
function withDirectoryLock(action){
  const lock=LockService.getScriptLock();
  lock.waitLock(30000);
  try{return action();}finally{lock.releaseLock();}
}
function importStudents(students){
  if(!Array.isArray(students)||!students.length)throw new Error('El archivo no contiene estudiantes para importar');
  const sheet=sh('Estudiantes'),headers=studentHeaders(sheet);
  const existing=table('Estudiantes');
  const periods=table('Periodos');
  const active=periods.find(p=>p.Estado==='Activo')||null;
  const seen=new Set(existing.map(s=>String(s.ID_Periodo)+'|'+String(s.Matricula).toLowerCase()));
  students.forEach(function(s){
    if(!s.matricula||!s.name||!s.semester||!s.thesis||!s.director)throw new Error('Cada estudiante requiere matrícula, nombre, semestre, título y director');
    if(!['MCIE','DIE'].includes(s.program))throw new Error('Cada estudiante requiere el programa MCIE o DIE');
    const period=periods.find(p=>p.ID_Periodo===s.periodId||p.Nombre_Periodo===s.periodId)||(s.periodId?null:active);
    if(!period)throw new Error('La cohorte indicada no existe: '+s.periodId);
    const periodId=period.ID_Periodo;
    const key=String(periodId)+'|'+String(s.matricula).toLowerCase();
    if(seen.has(key))throw new Error('Matrícula duplicada en la cohorte: '+s.matricula);
    seen.add(key);
    s.periodId=periodId;
  });
  const firstNumber=Number(nextId('EST','Estudiantes','ID_Estudiante').split('-').pop());
  const rows=students.map(function(s,index){
    const record={ID_Estudiante:'EST-'+String(firstNumber+index).padStart(3,'0'),Matricula:s.matricula,Nombre:s.name,Semestre:s.semester,Titulo_Tesis:s.thesis,Director_Tesis:s.director,ID_Periodo:s.periodId,Estado:'Activo',Programa:s.program};
    return headers.map(header=>Object.prototype.hasOwnProperty.call(record,header)?record[header]:'');
  });
  const startRow=sheet.getLastRow()+1;
  sheet.getRange(startRow,1,rows.length,rows[0].length).setValues(rows);
  return {imported:students.length};
}
function importEvaluators(evaluators){
  if(!Array.isArray(evaluators)||!evaluators.length)throw new Error('El archivo no contiene evaluadores para importar');
  const current=table('Evaluadores');
  const existing=new Set(table('Usuarios').map(u=>String(u.Usuario).toLowerCase()));
  current.forEach(e=>existing.add(String(e.Usuario).toLowerCase()));
  const emails=new Set(current.map(e=>String(e.Correo).toLowerCase()));
  evaluators.forEach(function(e){
    if(!e.name||!e.email||!e.username||!e.password)throw new Error('Cada evaluador requiere nombre, correo, usuario y contraseña temporal');
    const key=String(e.username).toLowerCase();
    if(existing.has(key))throw new Error('El usuario ya existe: '+e.username);
    const email=String(e.email).toLowerCase();
    if(emails.has(email))throw new Error('El correo ya existe: '+e.email);
    existing.add(key);
    emails.add(email);
  });
  const firstEvaluatorNumber=Number(nextId('EV','Evaluadores','ID_Evaluador').split('-').pop());
  const firstUserNumber=Number(nextId('USR','Usuarios','ID_Usuario').split('-').pop());
  const evaluatorRows=[];const userRows=[];
  evaluators.forEach(function(e,index){
    const evaluatorId='EV-'+String(firstEvaluatorNumber+index).padStart(3,'0');
    const userId='USR-'+String(firstUserNumber+index).padStart(3,'0');
    const salt=Utilities.getUuid();
    evaluatorRows.push([evaluatorId,e.name,e.email,e.username,'Activo']);
    userRows.push([userId,e.name,e.username,hashPassword(e.password,salt),salt,'evaluator','Activo',true]);
  });
  const evaluatorSheet=sh('Evaluadores');
  evaluatorSheet.getRange(evaluatorSheet.getLastRow()+1,1,evaluatorRows.length,evaluatorRows[0].length).setValues(evaluatorRows);
  const userSheet=sh('Usuarios');
  userSheet.getRange(userSheet.getLastRow()+1,1,userRows.length,userRows[0].length).setValues(userRows);
  return {imported:evaluators.length};
}
function saveAssignment(studentId,evaluatorIds){
  if(!Array.isArray(evaluatorIds)||evaluatorIds.length!==3||new Set(evaluatorIds).size!==3)throw new Error('Debe haber exactamente tres evaluadores diferentes');
  const d=dashboard();
  if(!d.students.some(s=>s.id===studentId)||evaluatorIds.some(id=>!d.evaluators.some(e=>e.id===id&&e.state==='Activo')))throw new Error('El estudiante o alguno de los evaluadores ya no está disponible');
  if(d.evaluations.some(e=>e.student===studentId))throw new Error('No se pueden cambiar las asignaciones después de recibir una evaluación en esta ronda');
  const old=sh('Asignaciones');const values=old.getDataRange().getValues();const head=values.shift();
  for(let i=0;i<values.length;i++){if(values[i][head.indexOf('ID_Periodo')]===d.period.id&&values[i][head.indexOf('ID_Estudiante')]===studentId&&values[i][head.indexOf('Estado')]==='Activa')old.getRange(i+2,6).setValue('Inactiva');}
  evaluatorIds.forEach(function(ev){const id=nextId('AS','Asignaciones','ID_Asignacion');old.appendRow([id,d.period.id,studentId,ev,new Date(),'Activa']);});
  return {ok:true};
}
function submitEvaluation(session,body){
  const studentId=body.studentId;
  if(!body.rawCriteria||!body.rubric)throw new Error('No se recibieron calificaciones o rúbrica');
  const d=dashboard();const ev=d.evaluators.find(e=>e.username===session.username);
  if(!ev)throw new Error('Evaluador no válido');
  const duplicate=d.evaluations.find(e=>e.student===studentId&&e.evaluator===ev.id);
  if(duplicate)throw new Error('Ya existe una evaluación enviada');
  const assigned=d.assignments.find(a=>a.student===studentId&&a.evaluator===ev.id&&a.state==='Activa');
  if(!assigned)throw new Error('El estudiante no está asignado a este evaluador');
  const prior=d.evaluations.find(e=>e.student===studentId);
  const rubric=prior?prior.rubric:getRubric();
  if(!rubric||JSON.stringify(rubric)!==JSON.stringify(body.rubric))throw new Error('La rúbrica cambió; abre de nuevo el formulario');
  const raw={},criteria={},time=body.time||{},observations=body.criterionObservations||{};
  let penalty=0;
  if(rubric.some(c=>c.hasTimePenalty)&&(time.minutes!==''||time.seconds!=='')){
    const assigned=Number(time.assigned),minutes=Number(time.minutes),seconds=time.seconds===''?0:Number(time.seconds);
    if(time.assigned===''||time.minutes===''||!Number.isInteger(assigned)||assigned<1||assigned>120||!Number.isInteger(minutes)||minutes<0||minutes>120||!Number.isInteger(seconds)||seconds<0||seconds>59)throw new Error('Revisa los tiempos de presentación');
    const deviation=Math.abs(minutes*60+seconds-assigned*60);
    penalty=deviation<=60?0:deviation<=180?10:deviation<=300?20:40;
  }
  let weighted=0;
  rubric.forEach(c=>{
    const value=body.rawCriteria[c.id],number=Number(value);
    if(value===''||value===null||value===undefined||!Number.isInteger(number)||number<0||number>100)throw new Error('Calificación fuera de rango: '+c.name);
    raw[c.id]=number;criteria[c.id]=c.hasTimePenalty?Math.max(0,number-penalty):number;
    weighted+=criteria[c.id]*c.weight;
  });
  const individual=Math.round(weighted*100)/100;
  const id=nextId('EVL','Evaluaciones','ID_Evaluacion');
  const sheet=sh('Evaluaciones'),headers=sheet.getDataRange().getValues()[0];
  if(NEW_EVALUATION_HEADERS.some(h=>!headers.includes(h)))throw new Error('Falta migrar la hoja Evaluaciones');
  const record={ID_Evaluacion:id,ID_Periodo:d.period.id,ID_Estudiante:studentId,ID_Evaluador:ev.id,Calificacion_Individual:individual,Observaciones_Generales:body.observations||'',Fecha_Envio:new Date(),Estado:'Enviada',Ronda:2,Rubrica_JSON:JSON.stringify(rubric),Calificaciones_JSON:JSON.stringify(criteria),Calificaciones_Originales_JSON:JSON.stringify(raw),Tiempo_JSON:JSON.stringify(time),Observaciones_Criterios_JSON:JSON.stringify(observations)};
  sheet.appendRow(headers.map(h=>record[h]===undefined?'':record[h]));return {id:id,individual:individual};
}
function restablecerClaveAdmin() {
  const clave = PropertiesService.getScriptProperties()
    .getProperty('ADMIN_INITIAL_PASSWORD');
  if (!clave) throw new Error('Falta ADMIN_INITIAL_PASSWORD');

  const correo = Session.getActiveUser().getEmail();
  if (!correo) throw new Error('No se pudo obtener el correo de Google');

  withDirectoryLock(() => {
    const hoja = sh('Usuarios');
    const filas = hoja.getDataRange().getValues();
    const encabezados = filas[0];
    const usuario = encabezados.indexOf('Usuario');
    const rol = encabezados.indexOf('Rol');
    const hash = encabezados.indexOf('Password_Hash');
    const salt = encabezados.indexOf('Salt');

    if (usuario < 0 || rol < 0 || hash < 0 || salt !== hash + 1) {
      throw new Error('La estructura de Usuarios no es la esperada');
    }

    const coincidencias = filas.slice(1)
      .map((fila, i) => ({fila, numero: i + 2}))
      .filter(x => x.fila[usuario] === correo && x.fila[rol] === 'admin');

    if (coincidencias.length !== 1) {
      throw new Error('No se encontró una única cuenta de administrador');
    }

    const nuevaSal = Utilities.getUuid();
    hoja.getRange(coincidencias[0].numero, hash + 1, 1, 2)
      .setValues([[hashPassword(clave, nuevaSal), nuevaSal]]);
  });
}
function administrators(){
  return table('Usuarios')
    .filter(u=>u.Rol==='admin')
    .map(u=>({name:u.Nombre,username:u.Usuario,state:u.Estado}));
}

function createAdministrator(user){
  if(!user || typeof user.name!=='string' ||
     typeof user.username!=='string' ||
     typeof user.password!=='string')
    throw new Error('Introduce los datos del administrador');

  const name=user.name.trim(), username=user.username.trim();

  if(!name || !username || /\s/.test(username) ||
     name.startsWith('=') || username.startsWith('='))
    throw new Error('Introduce un nombre y un usuario válidos, sin espacios en el usuario');

  if(user.password.length<12 || !user.password.trim())
    throw new Error('La contraseña debe tener al menos 12 caracteres y no estar vacía');

  if(table('Usuarios').some(u=>String(u.Usuario).toLowerCase()===username.toLowerCase()))
    throw new Error('El usuario ya existe');

  const id=nextId('USR','Usuarios','ID_Usuario');
  const salt=Utilities.getUuid();

  sh('Usuarios').appendRow([
    id, name, username, hashPassword(user.password,salt),
    salt, 'admin', 'Activo', false
  ]);

  return {id:id};
}
function activatePeriod(id){
  if(typeof id!=='string'||!id.trim())
    throw new Error('Selecciona un periodo válido');

  const sheet=sh('Periodos');
  const rows=sheet.getDataRange().getValues();
  const headers=rows[0];
  const idIndex=headers.indexOf('ID_Periodo');
  const stateIndex=headers.indexOf('Estado');

  if(idIndex<0||stateIndex<0)
    throw new Error('La hoja Periodos no tiene las columnas necesarias');

  if(rows.slice(1).filter(row=>row[idIndex]===id).length!==1)
    throw new Error('No se encontró un periodo único con ese identificador');

  const range=sheet.getRange(2,stateIndex+1,rows.length-1,1);
  const formulas=range.getFormulas();
  const states=rows.slice(1).map((row,i)=>[
    row[idIndex]===id ? 'Activo' :
    row[stateIndex]==='Activo' ? 'Inactivo' :
    formulas[i][0]||row[stateIndex]
  ]);

  range.setValues(states);
  return {id:id};
}
