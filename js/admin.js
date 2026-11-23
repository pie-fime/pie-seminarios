window.Admin = (() => {
  const DEMO_KEY = 'pie-seminarios-demo-data';
  const seed = () => ({
    period:{id:'PER-2027-1',name:'2027-1 Ene-Jun',start:'2027-01-11',end:'2027-06-11',state:'Activo'},
    students:[
      {id:'EST-001',matricula:'2027001',name:'Mariana López Rivera',semester:'2',thesis:'Control adaptativo para conversores DC/DC',director:'Dr. Carlos Pérez',period:'PER-2027-1',state:'Activo'},
      {id:'EST-002',matricula:'2027002',name:'José Antonio Garza',semester:'3',thesis:'Diagnóstico térmico de sistemas eléctricos',director:'Dra. Elena Ruiz',period:'PER-2027-1',state:'Activo'},
      {id:'EST-003',matricula:'2027003',name:'Laura Torres Soto',semester:'4',thesis:'Optimización energética de microredes',director:'Dr. Luis Mendoza',period:'PER-2027-1',state:'Activo'}
    ],
    evaluators:[
      {id:'EV-001',name:'Dr. Ana Evaluadora',email:'ana@ejemplo.mx',username:'evaluador',state:'Activo'},
      {id:'EV-002',name:'Dr. Roberto Salinas',email:'roberto@ejemplo.mx',username:'rsalinas',state:'Activo'},
      {id:'EV-003',name:'Dra. Patricia Vega',email:'patricia@ejemplo.mx',username:'pvega',state:'Activo'}
    ],
    assignments:[
      {id:'AS-1',student:'EST-001',evaluator:'EV-001',state:'Activa'},
      {id:'AS-2',student:'EST-001',evaluator:'EV-002',state:'Activa'},
      {id:'AS-3',student:'EST-001',evaluator:'EV-003',state:'Activa'},
      {id:'AS-4',student:'EST-002',evaluator:'EV-001',state:'Activa'},
      {id:'AS-5',student:'EST-002',evaluator:'EV-002',state:'Activa'},
      {id:'AS-6',student:'EST-002',evaluator:'EV-003',state:'Activa'},
      {id:'AS-7',student:'EST-003',evaluator:'EV-001',state:'Activa'},
      {id:'AS-8',student:'EST-003',evaluator:'EV-002',state:'Activa'},
      {id:'AS-9',student:'EST-003',evaluator:'EV-003',state:'Activa'}
    ],
    evaluations:[]
  });
  async function load() {
    if (!API.isDemo()) return API.call('dashboard', {}, Auth.getSession()?.token);
    try {
      const saved = localStorage.getItem(DEMO_KEY);
      if (saved) {
        const data=JSON.parse(saved);
        if(data.evaluations.some(e=>e.round!==undefined&&e.round!==1&&e.round!==2))throw new Error('Versión de evaluación desconocida');
        const current=data.evaluations.filter(e=>e.round===2);
        if(current.length!==data.evaluations.length){data.evaluations=current;saveDemo(data);}
        return data;
      }
    } catch (error) {
      console.error('No se pudieron leer los datos locales de demostración.', error);
      throw new Error('No se pudieron leer o actualizar los datos locales de demostración');
    }
    const data = seed();
    saveDemo(data);
    return data;
  }
  async function loadManagement() {
    if (!API.isDemo()) return API.call('managementData', {}, Auth.getSession()?.token);
    return load();
  }
  function saveDemo(data) {
    try {
      localStorage.setItem(DEMO_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('No se pudieron guardar los datos locales de demostración.', error);
      throw new Error('No se pudieron guardar los cambios en este navegador');
    }
  }
  function nextDemoId(items,prefix) {
    const max=items.reduce((highest,item)=>{
      const match=String(item.id).match(new RegExp(`^${prefix}-(\\d+)$`));
      return match?Math.max(highest,Number(match[1])):highest;
    },0);
    return `${prefix}-${String(max+1).padStart(3,'0')}`;
  }
  function forPeriod(data,periodId) {
    const students=data.students.filter(s=>periodId&&s.period===periodId);
    const ids=new Set(students.map(s=>s.id));
    const belongs=record=>record.period?record.period===periodId:ids.has(record.student);
    return {...data,students,assignments:data.assignments.filter(belongs),evaluations:data.evaluations.filter(belongs)};
  }
  function dashboard(data) {
    if(API.isDemo())data=forPeriod(data,data.period?.id);
    const completed = data.evaluations?.filter(e=>(e.round||1)===2).length || 0;
    const expected = data.students.length * 3;
    const pending = expected - completed;
    const percent = expected ? Math.round(completed/expected*100) : 0;
    return `<div class="stats-grid">
      ${stat('Periodo activo',data.period?.name||'Sin periodo')}
      ${stat('Estudiantes',data.students.length)}
      ${stat('Evaluadores',data.evaluators.length)}
      ${stat('Evaluaciones',`${completed} / ${expected}`)}
    </div>
    <section class="panel">
      <div class="panel-header"><h2>Avance general</h2><strong>${percent}%</strong></div>
      <div class="progress-track"><span style="width:${percent}%"></span></div>
      <p class="muted" style="margin:12px 0 0">${completed} completadas · ${pending} pendientes</p>
    </section>`;
  }
  function stat(label,value) { return `<article class="stat-card"><span>${label}</span><strong>${value}</strong></article>`; }
  function table(headers, rows) {
    const body = Array.isArray(rows) ? rows.join('') : rows;
    return `<div class="table-wrap"><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table></div>`;
  }
  function periods(data) {
    const periods=data.periods||[data.period].filter(p=>p?.id);
    const rows=periods.map(p=>`<tr>
      <td><input type="checkbox" name="selectedPeriod" value="${escapeHtml(p.id)}" aria-label="Seleccionar ${escapeHtml(p.name)}"></td>
      <td>${escapeHtml(p.id)}</td><td>${escapeHtml(p.name)}</td><td>${escapeHtml(formatDate(p.start))}</td><td>${escapeHtml(formatDate(p.end))}</td><td><span class="badge ${p.state==='Activo'?'ok':'neutral'}">${escapeHtml(p.state)}</span></td>
    </tr>`).join('');
    return `<section class="panel"><div class="panel-header"><h2>Periodos</h2><div class="button-group"><button class="button secondary" id="activatePeriod">Activar periodo</button><button class="button primary" id="newPeriod">Nuevo periodo</button><button class="button danger" id="deletePeriod" disabled>Borrar periodo</button></div></div>
      ${table([`<input type="checkbox" id="selectAllPeriods" aria-label="Seleccionar todos los periodos" ${periods.length?'':'disabled'}>`,'ID','Nombre','Inicio','Fin','Estado'],rows||'<tr><td colspan="6">No hay periodos registrados.</td></tr>')}</section>`;
  }
  function administrators(items) {
    const rows=items.map(a=>`<tr><td>${escapeHtml(a.name)}</td><td>${escapeHtml(a.username)}</td><td>${escapeHtml(a.state)}</td></tr>`).join('');
    return `<section class="panel"><div class="panel-header"><h2>Administradores</h2><button class="button primary" id="newAdministrator">Nuevo administrador</button></div>
      ${table(['Nombre','Usuario','Estado'],rows||'<tr><td colspan="3">No hay administradores registrados.</td></tr>')}</section>`;
  }
  function administratorForm() {
    return `<form id="administratorForm" class="form-grid">
      <label>Nombre completo<input name="name" required></label>
      <label>Usuario o correo<input name="username" required autocomplete="off"></label>
      <label>Contraseña<input type="password" name="password" minlength="12" required autocomplete="new-password"></label>
      <label>Confirmar contraseña<input type="password" name="confirmation" minlength="12" required autocomplete="new-password"></label>
      <p class="muted full">Al menos 12 caracteres. Este administrador tendrá los mismos permisos que tú.</p>
      <div class="full"><button class="button primary" type="submit">Crear administrador</button></div>
    </form>`;
  }
  function periodForm() {
    return `<form id="periodForm" class="form-grid">
      <label class="full">Nombre del periodo<input name="name" required></label>
      <label>Fecha de inicio<input type="date" name="start" required></label>
      <label>Fecha de fin<input type="date" name="end" required></label>
      <p class="muted full">El nuevo periodo se creará inactivo; el periodo activo actual no cambiará.</p>
      <div class="full"><button class="button primary" type="submit">Guardar periodo</button></div>
    </form>`;
  }
  function students(data,state) {
    const directors=[...new Set(data.students.map(s=>s.director).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es'));
    const periods=data.periods||[data.period].filter(Boolean);
    const directorOptions=directors.map(d=>`<option value="${escapeHtml(d)}" ${state.director===d?'selected':''}>${escapeHtml(d)}</option>`).join('');
    const periodOptions=periods.map(p=>`<option value="${escapeHtml(p.id)}" ${state.period===p.id?'selected':''}>${escapeHtml(p.name)}</option>`).join('');
    return `<section class="panel">
      <div class="directory-toolbar">
        <label>Buscar<input id="studentSearch" value="${escapeHtml(state.search)}" placeholder="Matrícula, nombre o tesis"></label>
        <label>Director<select id="studentDirector"><option value="">Todos los directores</option>${directorOptions}</select></label>
        <label>Generación / cohorte<select id="studentPeriod"><option value="">Todas las cohortes</option>${periodOptions}</select></label>
        <button class="button secondary" id="importStudents">Importar CSV</button>
        <button class="button secondary" id="exportStudents" ${state.selected.size?'':'disabled'}>Exportar CSV</button>
        <button class="button primary" id="newStudent">Nuevo</button>
        <button class="button danger" id="deleteStudents" ${state.selected.size?'':'disabled'}>Borrar</button>
      </div>
      <p class="directory-hint">Marca las casillas de la primera columna para exportar. Haz clic en los encabezados para ordenar.</p>
      <div class="table-wrap"><table><thead><tr>
        <th><input type="checkbox" id="selectAllStudents" aria-label="Seleccionar estudiantes visibles"></th>
        ${sortHeader('matricula','Matrícula',state)}${sortHeader('name','Nombre',state)}
        ${sortHeader('program','Programa',state)}${sortHeader('semester','Semestre',state)}${sortHeader('thesis','Título de tesis',state)}${sortHeader('director','Director',state)}
        ${sortHeader('period','Cohorte',state)}<th>Estado</th><th>Acciones</th>
      </tr></thead><tbody id="studentRows">${studentRows(data,state)}</tbody></table></div>
    </section>`;
  }
  function studentRows(data,state) {
    const items=filterAndSort(data.students,state,['matricula','name','program','thesis','semester','director','period']);
    return items.map(s=>`<tr data-row-id="${escapeHtml(s.id)}">
      <td><input type="checkbox" class="row-select" value="${escapeHtml(s.id)}" ${state.selected.has(s.id)?'checked':''} aria-label="Seleccionar ${escapeHtml(s.name)}"></td>
      <td>${escapeHtml(s.matricula)}</td><td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.program||'Sin asignar')}</td><td>${escapeHtml(s.semester)}</td><td>${escapeHtml(s.thesis)}</td>
      <td>${escapeHtml(s.director)}</td><td>${escapeHtml(periodLabel(data,s.period))}</td>
      <td><span class="badge ok">${escapeHtml(s.state)}</span></td>
      <td class="table-actions"><button class="text-button" data-edit-student="${escapeHtml(s.id)}">Editar</button></td>
    </tr>`).join('')||'<tr><td colspan="10" class="empty-row">No hay estudiantes que coincidan con los filtros.</td></tr>';
  }
  function evaluators(data,state) {
    return `<section class="panel">
      <div class="directory-toolbar">
        <label>Buscar<input id="evaluatorSearch" value="${escapeHtml(state.search)}" placeholder="Nombre, correo o usuario"></label>
        <label>Estado<select id="evaluatorState"><option value="">Todos</option><option value="Activo" ${state.status==='Activo'?'selected':''}>Activo</option><option value="Inactivo" ${state.status==='Inactivo'?'selected':''}>Inactivo</option></select></label>
        <button class="button secondary" id="importEvaluators">Importar CSV</button>
        <button class="button secondary" id="exportEvaluators" ${state.selected.size?'':'disabled'}>Exportar CSV</button>
        <button class="button primary" id="newEvaluator">Nuevo</button>
        <button class="button danger" id="deleteEvaluators" ${state.selected.size?'':'disabled'}>Borrar</button>
      </div>
      <p class="directory-hint">Marca las casillas de la primera columna para exportar. Haz clic en los encabezados para ordenar.</p>
      <div class="table-wrap"><table><thead><tr>
        <th><input type="checkbox" id="selectAllEvaluators" aria-label="Seleccionar evaluadores visibles"></th>
        ${sortHeader('name','Nombre',state)}${sortHeader('email','Correo',state)}
        ${sortHeader('username','Usuario',state)}${sortHeader('state','Estado',state)}<th>Acciones</th>
      </tr></thead><tbody id="evaluatorRows">${evaluatorRows(data,state)}</tbody></table></div>
    </section>`;
  }
  function evaluatorRows(data,state) {
    const items=filterAndSort(data.evaluators,state,['name','email','username','state']);
    return items.map(e=>`<tr data-row-id="${escapeHtml(e.id)}">
      <td><input type="checkbox" class="row-select" value="${escapeHtml(e.id)}" ${state.selected.has(e.id)?'checked':''} aria-label="Seleccionar ${escapeHtml(e.name)}"></td>
      <td>${escapeHtml(e.name)}</td><td>${escapeHtml(e.email)}</td><td>${escapeHtml(e.username)}</td>
      <td><span class="badge ${e.state==='Activo'?'ok':'neutral'}">${escapeHtml(e.state)}</span></td>
      <td class="table-actions"><button class="text-button" data-edit-evaluator="${escapeHtml(e.id)}">Editar</button></td>
    </tr>`).join('')||'<tr><td colspan="6" class="empty-row">No hay evaluadores que coincidan con los filtros.</td></tr>';
  }
  function filterAndSort(items,state,searchFields) {
    const query=(state.search||'').trim().toLocaleLowerCase('es');
    return items.filter(item=>{
      const matchesSearch=!query||searchFields.some(key=>String(item[key]||'').toLocaleLowerCase('es').includes(query));
      const matchesDirector=!state.director||item.director===state.director;
      const matchesPeriod=!state.period||item.period===state.period;
      const matchesStatus=!state.status||item.state===state.status;
      return matchesSearch&&matchesDirector&&matchesPeriod&&matchesStatus;
    }).sort((a,b)=>{
      const result=String(a[state.sort]||'').localeCompare(String(b[state.sort]||''),'es',{numeric:true,sensitivity:'base'});
      return state.direction==='desc'?-result:result;
    });
  }
  function sortHeader(key,label,state) {
    const arrow=state.sort===key?(state.direction==='asc'?' ▲':' ▼'):'';
    return `<th aria-sort="${state.sort===key?(state.direction==='asc'?'ascending':'descending'):'none'}"><button type="button" class="sort-button" data-sort="${key}" data-label="${escapeHtml(label)}" aria-label="Ordenar por ${label}">${label}${arrow}</button></th>`;
  }
  function periodLabel(data,id) {
    return (data.periods||[data.period].filter(Boolean)).find(p=>p.id===id)?.name||id||'—';
  }
  function formatDate(value) {
    if(!value)return '—';
    const text=String(value),match=text.match(/^(\d{4})-(\d{2})-(\d{2})(?:$|T)/);
    if(match){
      const date=new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00Z`);
      if(!Number.isNaN(date.getTime())&&date.toISOString().slice(0,10)===`${match[1]}-${match[2]}-${match[3]}`)return `${match[3]}/${match[2]}/${match[1]}`;
      return text;
    }
    const date=new Date(value);
    return Number.isNaN(date.getTime())?text:date.toLocaleDateString('es-MX');
  }
  function escapeHtml(value) {
    return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  }
  function assignments(data) {
    const byStudent=data.students.map(s=>{
      const ids=data.assignments.filter(a=>a.student===s.id&&a.state==='Activa').map(a=>a.evaluator);
      const names=ids.map(id=>escapeHtml(data.evaluators.find(e=>e.id===id)?.name||id)).join('<br>');
      const completed=data.evaluations.filter(e=>e.student===s.id&&(e.round||1)===2).length;
      return `<tr><td>${escapeHtml(s.matricula)}</td><td>${escapeHtml(s.name)}</td><td>${names||'Sin asignar'}</td><td>${completed} de 3</td><td><button class="text-button" data-edit-assignment="${escapeHtml(s.id)}">Asignar</button></td></tr>`;
    }).join('')||`<tr><td colspan="5" class="empty-row">${data.period?.id?'No hay estudiantes en el periodo activo. Revisa la cohorte de los estudiantes o activa el periodo correspondiente.':'No hay un periodo activo. Activa un periodo para asignar evaluadores.'}</td></tr>`;
    return `<section class="panel"><div class="panel-header"><h2>Asignaciones</h2></div>${table(['Matrícula','Estudiante','Evaluadores','Avance','Acciones'],byStudent)}</section>`;
  }
  function studentForm(data,student={}) {
    const periods=data.periods||[data.period].filter(Boolean);
    const selectedPeriod=student.period||data.period?.id;
    return `<form id="studentForm" class="form-grid">
      <input type="hidden" name="id" value="${escapeHtml(student.id||'')}">
      ${field('Matrícula','matricula',student.matricula||'',true)}${field('Nombre completo','name',student.name||'',true)}
      <label>Programa<select name="program" required><option value="">Selecciona un programa</option><option value="MCIE" ${student.program==='MCIE'?'selected':''}>MCIE — Maestría en Ciencias de la Ingeniería Eléctrica</option><option value="DIE" ${student.program==='DIE'?'selected':''}>DIE — Doctorado en Ingeniería Eléctrica</option></select></label>
      ${field('Semestre','semester',student.semester||'',true)}${field('Director de tesis','director',student.director||'',true)}
      ${field('Título de tesis','thesis',student.thesis||'',true,'full')}
      <label class="full">Generación / cohorte<select name="periodId" required>${periods.map(p=>`<option value="${escapeHtml(p.id)}" ${p.id===selectedPeriod?'selected':''}>${escapeHtml(p.name)}</option>`).join('')}</select></label>
      <div class="full"><button class="button primary" type="submit">Guardar estudiante</button></div></form>`;
  }
  function evaluatorForm(evaluator={}) {
    return `<form id="evaluatorForm" class="form-grid">
      ${field('Nombre completo','name',evaluator.name||'',true)}${field('Correo','email',evaluator.email||'',true)}
      ${field('Usuario','username',evaluator.username||'',true)}${field('Contraseña temporal','password','',!evaluator.id,'',true)}
      <div class="full"><button class="button primary" type="submit">Guardar evaluador</button></div></form>`;
  }
  function field(label,name,value,required=false,extra='',password=false) {
    return `<label>${label}<input name="${name}" value="${value}" ${required?'required':''} ${password?'type="password"':''}></label>`.replace('<label>',`<label class="${extra}">`);
  }
  return {load,loadManagement,saveDemo,nextDemoId,forPeriod,dashboard,periods,periodForm,administrators,administratorForm,students,studentRows,evaluators,evaluatorRows,assignments,studentForm,evaluatorForm,formatDate};
})();
