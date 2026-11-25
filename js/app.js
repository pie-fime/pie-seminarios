window.App = (() => {
  let session=null,data=null,reportData=null,directoryData=null,currentView='dashboard',evaluatorTimer=null;
  const studentTableState={search:'',director:'',period:'',sort:'matricula',direction:'asc',selected:new Set()};
  const evaluatorTableState={search:'',status:'',sort:'name',direction:'asc',selected:new Set()};
  const els={loginView:document.getElementById('loginView'),appView:document.getElementById('appView'),loginForm:document.getElementById('loginForm'),loginError:document.getElementById('loginError'),content:document.getElementById('content'),nav:document.getElementById('mainNav'),title:document.getElementById('pageTitle'),period:document.getElementById('activePeriodLabel'),userName:document.getElementById('userName'),badge:document.getElementById('connectionBadge'),modal:document.getElementById('modal'),modalTitle:document.getElementById('modalTitle'),modalBody:document.getElementById('modalBody')};

  function toast(message) {
    const t=document.createElement('div');t.className='toast';t.textContent=message;document.getElementById('toastRegion').appendChild(t);setTimeout(()=>t.remove(),3500);
  }
  function openModal(title,body) { els.modalTitle.textContent=title;els.modalBody.innerHTML=body;els.modal.classList.remove('hidden'); }
  function closeModal(){els.modal.classList.add('hidden');}
  function setMenuOpen(open,restoreFocus=false){
    const sidebar=document.getElementById('sidebar');
    const button=document.getElementById('menuButton');
    sidebar.classList.toggle('open',open);
    document.getElementById('menuBackdrop').classList.toggle('hidden',!open);
    button.setAttribute('aria-expanded',String(open));
    button.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');
    if(!open&&restoreFocus&&window.innerWidth<=900)button.focus();
  }

  async function init(){
    els.loginForm.addEventListener('submit',login);
    document.getElementById('logoutButton').addEventListener('click',logout);
    document.getElementById('modalClose').addEventListener('click',closeModal);
    document.getElementById('menuButton').addEventListener('click',()=>setMenuOpen(!document.getElementById('sidebar').classList.contains('open')));
    document.getElementById('closeMenuButton').addEventListener('click',()=>setMenuOpen(false,true));
    document.getElementById('menuBackdrop').addEventListener('click',()=>setMenuOpen(false,true));
    els.nav.addEventListener('click',event=>{if(event.target.closest('.nav-button')&&document.getElementById('sidebar').classList.contains('open'))setMenuOpen(false,true);});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&document.getElementById('sidebar').classList.contains('open'))setMenuOpen(false,true);});
    window.addEventListener('resize',()=>{if(window.innerWidth>900&&document.getElementById('sidebar').classList.contains('open'))setMenuOpen(false);});
    els.badge.textContent=API.isDemo()?'Modo demostración':'Servidor conectado';
    els.badge.className=`badge ${API.isDemo()?'neutral':'ok'}`;
    const saved=Auth.getSession();
    if(saved){session=saved;await enterApp();}
  }
  async function login(ev){
    ev.preventDefault();els.loginError.classList.add('hidden');
    try {session=await Auth.login(document.getElementById('username').value.trim(),document.getElementById('password').value);
      if(!API.isDemo())Auth.saveSession(session);else Auth.saveSession(session);
      await enterApp();
    }catch(error){els.loginError.textContent=error.message;els.loginError.classList.remove('hidden');}
  }
  async function logout(){
    await Auth.logout();
    clearInterval(evaluatorTimer);evaluatorTimer=null;
    session=null;closeModal();setMenuOpen(false);
    els.modalBody.replaceChildren();els.content.replaceChildren();els.nav.replaceChildren();
    els.loginForm.reset();els.loginError.classList.add('hidden');
    els.appView.classList.add('hidden');els.loginView.classList.remove('hidden');
    window.location.reload();
  }
  async function enterApp(){
    els.loginView.classList.add('hidden');els.appView.classList.remove('hidden');els.userName.textContent=session.name;
    if(session.role==='admin'){await loadAdmin();buildAdminNav();renderAdmin('dashboard');}
    else{await loadEvaluator();buildEvaluatorNav();renderEvaluator('dashboard');}
    document.getElementById('profileButton').onclick=openProfile;
  }
  async function loadAdmin(){data=await Admin.load();}
  async function loadEvaluator(){data=await Evaluator.load();}
  function buildAdminNav(){
    els.nav.innerHTML=['dashboard','periods','administrators','evaluators','students','assignments','reports'].map(k=>`<button class="nav-button" data-view="${k}">${{dashboard:'Resumen',periods:'Periodos',students:'Estudiantes',evaluators:'Evaluadores',administrators:'Administradores',assignments:'Asignaciones',reports:'Reportes'}[k]}</button>`).join('');
    els.nav.querySelectorAll('button').forEach(b=>b.onclick=()=>renderAdmin(b.dataset.view));
  }
  function buildEvaluatorNav(){
    els.nav.innerHTML='<button class="nav-button active" data-view="dashboard">Mis estudiantes</button>';
  }
  async function openProfile(){
    setMenuOpen(false);
    let profile;
    try{profile=await Auth.getProfile();}catch(error){toast(error.message);return;}
    openModal('Mi perfil',`<form id="profileForm" class="form-grid">
      <label>Nombre completo<input name="name" required></label>
      <label>Usuario<input name="username" required></label>
      ${session.role==='evaluator'?'<label>Correo<input type="email" name="email" required></label>':''}
      <label class="full">Contraseña actual<input type="password" name="currentPassword" autocomplete="current-password" required></label>
      <label>Nueva contraseña <span class="muted">(opcional)</span><input type="password" name="newPassword" minlength="12" autocomplete="new-password"></label>
      <label>Confirmar nueva contraseña<input type="password" name="confirmation" minlength="12" autocomplete="new-password"></label>
      <div class="full"><button class="button primary" type="submit">Guardar cambios</button></div>
    </form>`);
    const form=document.getElementById('profileForm');
    form.elements.name.value=profile.name;
    form.elements.username.value=profile.username;
    if(session.role==='evaluator')form.elements.email.value=profile.email;
    form.onsubmit=async event=>{
      event.preventDefault();const button=form.querySelector('[type=submit]');button.disabled=true;
      try{
        const fields=new FormData(form),newPassword=String(fields.get('newPassword'));
        if(newPassword!==String(fields.get('confirmation')))throw new Error('Las nuevas contraseñas no coinciden');
        const result=await Auth.updateProfile({name:String(fields.get('name')).trim(),username:String(fields.get('username')).trim(),email:String(fields.get('email')||'').trim(),currentPassword:String(fields.get('currentPassword')),newPassword});
        session={...session,...result};els.userName.textContent=session.name;closeModal();toast('Perfil actualizado.');
        if(session.role==='evaluator'){await loadEvaluator();renderEvaluator('dashboard');}
      }catch(error){button.disabled=false;toast(error.message);}
    };
  }
  async function renderAdmin(view){
    currentView=view;els.nav.querySelectorAll('.nav-button').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
    els.period.textContent=data.period?.name||'Sin periodo activo';
    const titles={dashboard:'Resumen',periods:'Periodos escolares',students:'Estudiantes',evaluators:'Evaluadores',administrators:'Administradores',assignments:'Asignaciones',reports:'Reportes'};
    els.title.textContent=titles[view];
    if(view==='dashboard')els.content.innerHTML=Admin.dashboard(data);
    if(view==='students'){
      directoryData=await Admin.loadManagement();
      studentTableState.selected.clear();
      els.content.innerHTML=Admin.students(directoryData,studentTableState);
      wireStudentActions();
    }
    if(view==='evaluators'){
      directoryData=await Admin.loadManagement();
      evaluatorTableState.selected.clear();
      els.content.innerHTML=Admin.evaluators(directoryData,evaluatorTableState);
      wireEvaluatorActions();
    }
    if(view==='administrators'){
      let administrators;
      try{
        administrators=API.isDemo()
          ? await Admin.loadManagement().then(d=>[d.demoDefaultAdmin||{name:'Administrador',username:'admin'},...(d.demoAdmins||[])].map(a=>({name:a.name,username:a.username,state:'Activo'})))
          : await API.call('administrators',{},session.token);
      }catch(error){
        els.content.innerHTML='<section class="panel"><p>No se pudo cargar la lista de administradores.</p></section>';
        toast(error.message);return;
      }
      els.content.innerHTML=Admin.administrators(administrators);
      document.getElementById('newAdministrator').onclick=()=>{
        openModal('Nuevo administrador',Admin.administratorForm());
        const form=document.getElementById('administratorForm');
        form.onsubmit=async event=>{
          event.preventDefault();
          const button=form.querySelector('[type=submit]');button.disabled=true;
          try{
            const fields=new FormData(form);
            const user={name:String(fields.get('name')).trim(),username:String(fields.get('username')).trim(),password:String(fields.get('password'))};
            if(!user.name||!user.username||/\s/.test(user.username)||user.name.startsWith('=')||user.username.startsWith('='))throw new Error('Introduce un nombre y un usuario válidos, sin espacios en el usuario');
            if(user.password.length<12||!user.password.trim())throw new Error('La contraseña debe tener al menos 12 caracteres y no estar vacía');
            if(user.password!==fields.get('confirmation'))throw new Error('Las contraseñas no coinciden');
            if(API.isDemo())await Auth.createDemoAdmin(user);
            else await API.call('createAdministrator',{administrator:user},session.token);
          }catch(error){button.disabled=false;toast(error.message);return;}
          closeModal();toast('Administrador creado.');
          try{await loadAdmin();await renderAdmin('administrators');}catch(error){toast(`Se creó el administrador, pero no se pudo actualizar la vista: ${error.message}`);}
        };
      };
    }
    if(view==='assignments'){
      els.content.innerHTML='<section class="panel"><p>Cargando asignaciones...</p></section>';
      try{await loadAdmin();}catch(error){
        if(currentView===view){els.content.innerHTML='<section class="panel"><p>No se pudieron cargar las asignaciones.</p></section>';toast(error.message);}
        return;
      }
      if(currentView!==view)return;
      els.period.textContent=data.period?.name||'Sin periodo activo';
      els.content.innerHTML=Admin.assignments(API.isDemo()?Admin.forPeriod(data,data.period?.id):data);wireAssignmentActions();
    }
    if(view==='periods'){
      directoryData=await Admin.loadManagement();
      els.content.innerHTML=Admin.periods(directoryData);
      const inputs=[...els.content.querySelectorAll('[name="selectedPeriod"]')];
      const selectAll=document.getElementById('selectAllPeriods');
      const updatePeriodSelection=()=>{
        const count=inputs.filter(input=>input.checked).length;
        selectAll.checked=inputs.length>0&&count===inputs.length;
        selectAll.indeterminate=count>0&&count<inputs.length;
        document.getElementById('deletePeriod').disabled=count===0;
      };
      selectAll.onchange=()=>{inputs.forEach(input=>{input.checked=selectAll.checked;});updatePeriodSelection();};
      inputs.forEach(input=>input.onchange=updatePeriodSelection);
      document.getElementById('activatePeriod').onclick=()=>{
        const selected=inputs.filter(input=>input.checked);
        if(selected.length!==1){toast('Selecciona exactamente un periodo para activar.');return;}
        const period=(directoryData.periods||[directoryData.period]).find(p=>p?.id===selected[0].value);
        if(!period){toast('No se encontró el periodo seleccionado.');return;}
        openModal('Activar periodo',`<p>¿Activar <strong id="periodToActivate"></strong>?</p><p>El periodo activo anterior se desactivará.</p>
          <div class="button-group modal-actions"><button type="button" class="button secondary" id="cancelActivate">Cancelar</button><button type="button" class="button primary" id="confirmActivate">Activar periodo</button></div>`);
        document.getElementById('periodToActivate').textContent=period.name;
        document.getElementById('cancelActivate').onclick=closeModal;
        document.getElementById('confirmActivate').onclick=async event=>{
          event.target.disabled=true;
          try{
            if(!API.isDemo())await API.call('activatePeriod',{id:period.id},session.token);
            else{
              const current=await Admin.loadManagement();
              const periods=current.periods||[current.period].filter(p=>p?.id);
              if(periods.filter(p=>p.id===period.id).length!==1)throw new Error('No se encontró un periodo único con ese identificador');
              current.periods=periods.map(p=>({...p,state:p.id===period.id?'Activo':p.state==='Activo'?'Inactivo':p.state}));
              current.period=current.periods.find(p=>p.id===period.id);
              Admin.saveDemo(current);
            }
          }catch(error){event.target.disabled=false;toast(error.message);return;}
          closeModal();toast('Periodo activado.');
          try{await loadAdmin();await renderAdmin('periods');}catch(error){toast(`Se activó el periodo, pero no se pudo actualizar la vista: ${error.message}`);}
        };
      };
      document.getElementById('newPeriod').onclick=()=>{
        openModal('Nuevo periodo',Admin.periodForm());
        const form=document.getElementById('periodForm');
        form.onsubmit=async event=>{
          event.preventDefault();
          const button=form.querySelector('[type=submit]');button.disabled=true;
          try{
            const fields=new FormData(form);
            const period={name:String(fields.get('name')).trim(),start:fields.get('start'),end:fields.get('end')};
            if(!period.name||period.name.startsWith('='))throw new Error('Introduce un nombre de periodo válido');
            if(period.start>period.end)throw new Error('La fecha de fin no puede ser anterior a la fecha de inicio');
            if(!API.isDemo())await API.call('createPeriod',{period},session.token);
            else{
              const current=await Admin.loadManagement();
              const periods=current.periods||[current.period].filter(p=>p?.id);
              if(periods.some(p=>String(p.name).trim().toLocaleLowerCase('es')===period.name.toLocaleLowerCase('es')))throw new Error('Ya existe un periodo con ese nombre');
              current.periods=[...periods,{...period,id:Admin.nextDemoId(periods,'PER'),state:'Inactivo'}];
              Admin.saveDemo(current);
            }
          }catch(error){button.disabled=false;toast(error.message);return;}
          closeModal();toast('Periodo creado como inactivo.');
          try{await loadAdmin();await renderAdmin('periods');}catch(error){toast(`Se creó el periodo, pero no se pudo actualizar la vista: ${error.message}`);}
        };
      };
      document.getElementById('deletePeriod').onclick=confirmDeletePeriod;
    }
    if(view==='reports'){
      reportData=await Reports.load(data.period?.id);
      els.content.innerHTML=Reports.workspace(reportData);
      wireReportActions();
    }
    function confirmDeletePeriod(){
      const ids=[...els.content.querySelectorAll('[name="selectedPeriod"]:checked')].map(input=>input.value);
      if(!ids.length)return;
      openModal('Confirmar borrado',`<p>¿Borrar ${ids.length} periodo(s) seleccionado(s)?</p><p>Se bloqueará toda la operación si alguno tiene estudiantes, asignaciones o evaluaciones asociadas.</p>
        <div class="button-group modal-actions"><button type="button" class="button secondary" id="cancelDelete">Cancelar</button><button type="button" class="button danger" id="confirmDelete">Borrar periodo</button></div>`);
      document.getElementById('cancelDelete').onclick=closeModal;
      document.getElementById('confirmDelete').onclick=async event=>{
        event.target.disabled=true;
        try{
          if(!API.isDemo())await API.call('deletePeriods',{ids},session.token);
          else{
            const current=await Admin.loadManagement();
            const periods=current.periods||[current.period].filter(p=>p?.id);
            const selected=new Set(ids);
            if(periods.filter(p=>selected.has(p.id)).length!==ids.length)throw new Error('No se encontraron todos los periodos seleccionados');
            const studentIds=new Set(current.students.filter(s=>selected.has(s.period)).map(s=>s.id));
            if(studentIds.size||current.assignments.some(a=>selected.has(a.period)||studentIds.has(a.student))||current.evaluations.some(e=>selected.has(e.period)||studentIds.has(e.student)))throw new Error('No se puede borrar: hay estudiantes, asignaciones o evaluaciones asociadas');
            current.periods=periods.filter(p=>!selected.has(p.id));
            current.period=current.periods.find(p=>p.state==='Activo')||{};
            Admin.saveDemo(current);
          }
        }catch(error){event.target.disabled=false;toast(error.message);return;}
        closeModal();toast(`${ids.length} periodo(s) eliminado(s).`);
        try{await loadAdmin();await renderAdmin('periods');}catch(error){toast(`Se borraron los periodos, pero no se pudo actualizar la vista: ${error.message}`);}
      };
    }
  }
  function wireStudentActions(){
    document.getElementById('newStudent').onclick=()=>{openModal('Nuevo estudiante',Admin.studentForm(directoryData));wireStudentForm();};
    document.getElementById('importStudents').onclick=()=>openCsvImport('students');
    document.getElementById('studentSearch').oninput=e=>{studentTableState.search=e.target.value;renderStudentRows();};
    document.getElementById('studentDirector').onchange=e=>{studentTableState.director=e.target.value;renderStudentRows();};
    document.getElementById('studentPeriod').onchange=e=>{studentTableState.period=e.target.value;renderStudentRows();};
    document.getElementById('selectAllStudents').onchange=e=>{
      visibleRowIds('studentRows').forEach(id=>e.target.checked?studentTableState.selected.add(id):studentTableState.selected.delete(id));
      renderStudentRows();
    };
    document.getElementById('exportStudents').onclick=()=>exportSelected('students');
    document.getElementById('deleteStudents').onclick=()=>confirmDelete('students');
    document.querySelectorAll('#content [data-sort]').forEach(button=>button.onclick=()=>{
      setSort(studentTableState,button.dataset.sort);renderStudentRows();
    });
    updateSortIndicators('students');
    wireStudentRowActions();
    updateSelectionUi('students');
  }
  function wireStudentRowActions(){
    document.querySelectorAll('#studentRows .row-select').forEach(input=>input.onchange=()=>{
      if(input.checked)studentTableState.selected.add(input.value);
      else studentTableState.selected.delete(input.value);
      updateSelectionUi('students');
    });
    document.querySelectorAll('#studentRows [data-edit-student]').forEach(button=>button.onclick=()=>{
      const student=directoryData.students.find(item=>item.id===button.dataset.editStudent);
      openModal('Editar estudiante',Admin.studentForm(directoryData,student));
      wireStudentForm();
    });
  }
  function wireEvaluatorActions(){
    document.getElementById('newEvaluator').onclick=()=>{openModal('Nuevo evaluador',Admin.evaluatorForm());wireEvaluatorForm();};
    document.getElementById('importEvaluators').onclick=()=>openCsvImport('evaluators');
    document.getElementById('evaluatorSearch').oninput=e=>{evaluatorTableState.search=e.target.value;renderEvaluatorRows();};
    document.getElementById('evaluatorState').onchange=e=>{evaluatorTableState.status=e.target.value;renderEvaluatorRows();};
    document.getElementById('selectAllEvaluators').onchange=e=>{
      visibleRowIds('evaluatorRows').forEach(id=>e.target.checked?evaluatorTableState.selected.add(id):evaluatorTableState.selected.delete(id));
      renderEvaluatorRows();
    };
    document.getElementById('exportEvaluators').onclick=()=>exportSelected('evaluators');
    document.getElementById('deleteEvaluators').onclick=()=>confirmDelete('evaluators');
    document.querySelectorAll('#content [data-sort]').forEach(button=>button.onclick=()=>{
      setSort(evaluatorTableState,button.dataset.sort);renderEvaluatorRows();
    });
    updateSortIndicators('evaluators');
    wireEvaluatorRowActions();
    updateSelectionUi('evaluators');
  }
  function wireEvaluatorRowActions(){
    document.querySelectorAll('#evaluatorRows .row-select').forEach(input=>input.onchange=()=>{
      if(input.checked)evaluatorTableState.selected.add(input.value);
      else evaluatorTableState.selected.delete(input.value);
      updateSelectionUi('evaluators');
    });
    document.querySelectorAll('#evaluatorRows [data-edit-evaluator]').forEach(button=>button.onclick=()=>{
      const evaluator=directoryData.evaluators.find(item=>item.id===button.dataset.editEvaluator);
      openModal('Editar evaluador',Admin.evaluatorForm(evaluator));
      wireEvaluatorForm();
    });
  }
  function visibleRowIds(bodyId){
    return [...document.querySelectorAll(`#${bodyId} tr[data-row-id]`)].map(row=>row.dataset.rowId);
  }
  function setSort(state,key){
    if(state.sort===key)state.direction=state.direction==='asc'?'desc':'asc';
    else{state.sort=key;state.direction='asc';}
  }
  function renderStudentRows(){
    document.getElementById('studentRows').innerHTML=Admin.studentRows(directoryData,studentTableState);
    wireStudentRowActions();updateSortIndicators('students');updateSelectionUi('students');
  }
  function renderEvaluatorRows(){
    document.getElementById('evaluatorRows').innerHTML=Admin.evaluatorRows(directoryData,evaluatorTableState);
    wireEvaluatorRowActions();updateSortIndicators('evaluators');updateSelectionUi('evaluators');
  }
  function updateSortIndicators(type){
    const state=type==='students'?studentTableState:evaluatorTableState;
    document.querySelectorAll('#content [data-sort]').forEach(button=>{
      const active=state.sort===button.dataset.sort;
      button.textContent=button.dataset.label+(active?(state.direction==='asc'?' ▲':' ▼'):'');
      button.closest('th').setAttribute('aria-sort',active?(state.direction==='asc'?'ascending':'descending'):'none');
    });
  }
  function updateSelectionUi(type){
    const isStudents=type==='students';
    const state=isStudents?studentTableState:evaluatorTableState;
    const allId=isStudents?'selectAllStudents':'selectAllEvaluators';
    const exportId=isStudents?'exportStudents':'exportEvaluators';
    const bodyId=isStudents?'studentRows':'evaluatorRows';
    const visible=visibleRowIds(bodyId);
    const selectAll=document.getElementById(allId);
    if(selectAll){
      const selectedVisible=visible.filter(id=>state.selected.has(id)).length;
      selectAll.checked=visible.length>0&&selectedVisible===visible.length;
      selectAll.indeterminate=selectedVisible>0&&selectedVisible<visible.length;
    }
    const exportButton=document.getElementById(exportId);
    if(exportButton)exportButton.disabled=state.selected.size===0;
    const deleteButton=document.getElementById(isStudents?'deleteStudents':'deleteEvaluators');
    if(deleteButton)deleteButton.disabled=state.selected.size===0;
  }
  function confirmDelete(type){
    const isStudents=type==='students';
    const selected=isStudents?studentTableState.selected:evaluatorTableState.selected;
    const ids=[...selected];
    if(!ids.length)return;
    const label=isStudents?'estudiante(s)':'evaluador(es)';
    openModal('Confirmar borrado',`<p>¿Borrar ${ids.length} ${label} seleccionado(s), incluidos los que no estén visibles por los filtros?</p>
      <p>La operación se bloqueará si alguno tiene asignaciones o evaluaciones. ${isStudents?'':'Las cuentas de acceso asociadas se desactivarán.'}</p>
      <div class="button-group modal-actions"><button type="button" class="button secondary" id="cancelDelete">Cancelar</button><button type="button" class="button danger" id="confirmDelete">Borrar</button></div>`);
    document.getElementById('cancelDelete').onclick=closeModal;
    document.getElementById('confirmDelete').onclick=async event=>{
      event.target.disabled=true;
      try{
        if(!API.isDemo())await API.call(isStudents?'deleteStudents':'deleteEvaluators',{ids},session.token);
        else{
          const current=await Admin.loadManagement();
          const selectedIds=new Set(ids);
          const key=isStudents?'student':'evaluator';
          if(current[type].filter(item=>selectedIds.has(item.id)).length!==ids.length)throw new Error('No se encontraron todos los registros seleccionados');
          if(current.assignments.some(item=>selectedIds.has(item[key]))||current.evaluations.some(item=>selectedIds.has(item[key])))throw new Error('No se puede borrar: hay asignaciones o evaluaciones asociadas');
          current[type]=current[type].filter(item=>!selectedIds.has(item.id));
          Admin.saveDemo(current);
        }
      }catch(error){event.target.disabled=false;toast(error.message);return;}
      closeModal();toast(`${ids.length} ${label} eliminado(s).`);
      try{await loadAdmin();await renderAdmin(type);}catch(error){toast(`Se borraron los registros, pero no se pudo actualizar la vista: ${error.message}`);}
    };
  }
  function exportSelected(type){
    const isStudents=type==='students';
    const selected=isStudents?studentTableState.selected:evaluatorTableState.selected;
    const source=isStudents?directoryData.students:directoryData.evaluators;
    const records=source.filter(item=>selected.has(item.id));
    if(isStudents){
      Csv.download(
        [['Matrícula','Nombre','Programa','Semestre','Título de tesis','Director // Codirector','Periodo'],...records.map(s=>[s.matricula,s.name,s.program||'',s.semester,s.thesis,s.director,periodName(directoryData,s.period)])],
        'estudiantes.csv'
      );
    }else{
      Csv.download(
        [['Nombre','Correo','Usuario','Estado'],...records.map(e=>[e.name,e.email,e.username,e.state])],
        'evaluadores.csv'
      );
    }
  }
  function periodName(source,id){
    return (source.periods||[source.period].filter(Boolean)).find(period=>period.id===id)?.name||id||'';
  }
  function wireAssignmentActions(){
    document.querySelectorAll('[data-edit-assignment]').forEach(b=>b.onclick=()=>{
      const student=data.students.find(s=>s.id===b.dataset.editAssignment);
      const currentData=API.isDemo()?Admin.forPeriod(data,data.period?.id):data;
      const currentAssignments=currentData.assignments;
      const ids=currentAssignments.filter(a=>a.student===student.id&&a.state==='Activa').map(a=>a.evaluator);
      const evaluated=currentData.evaluations.filter(e=>e.student===student.id&&(e.round||1)===2).map(e=>e.evaluator);
      openModal(`Asignar evaluadores · ${student.name}`,`<form id="assignmentForm"><div id="assignmentOptions"></div><p class="muted">Selecciona hasta tres evaluadores. Los que ya enviaron su evaluación no pueden retirarse.</p><button class="button primary" type="submit">Guardar asignación</button></form>`);
      const form=document.getElementById('assignmentForm'),options=document.getElementById('assignmentOptions');
      data.evaluators.filter(e=>e.state==='Activo'||ids.includes(e.id)).forEach(e=>{
        const label=document.createElement('label'),input=document.createElement('input'),name=document.createElement('span');
        label.className='assignment-option';input.type='checkbox';input.name='evaluator';input.value=e.id;
        input.checked=ids.includes(e.id);input.disabled=evaluated.includes(e.id);
        name.textContent=`${e.name}${e.state==='Activo'?'':' (inactivo)'}${input.disabled?' · evaluación enviada':''}`;
        label.append(input,name);options.appendChild(label);
        input.onchange=()=>{if(form.querySelectorAll('input:checked').length>3){input.checked=false;toast('Puedes asignar hasta tres evaluadores');}};
      });
      if(!options.children.length)options.textContent='No hay evaluadores activos disponibles.';
      form.onsubmit=async e=>{
        e.preventDefault();const selected=[...form.querySelectorAll('input:checked')].map(i=>i.value);
        if(selected.length>3)return toast('Puedes asignar hasta tres evaluadores');
        const button=form.querySelector('[type=submit]');button.disabled=true;
        try{
          if(!API.isDemo())await API.call('saveAssignment',{studentId:student.id,evaluatorIds:selected},session.token);
          else{
            const current=await Admin.load(),active=Admin.forPeriod(current,current.period?.id);
            if(current.period?.id!==data.period?.id||!active.students.some(s=>s.id===student.id))throw new Error('El estudiante o el periodo activo ya no está disponible');
            const assigned=active.assignments.filter(a=>a.student===student.id&&a.state==='Activa');
            const completed=active.evaluations.filter(e=>e.student===student.id&&(e.round||1)===2).map(e=>e.evaluator);
            if(completed.some(id=>!selected.includes(id)))throw new Error('No se puede retirar a un evaluador que ya envió su evaluación');
            if(selected.some(id=>!current.evaluators.some(ev=>ev.id===id&&(ev.state==='Activo'||(assigned.some(a=>a.evaluator===id)&&completed.includes(id))))))throw new Error('Alguno de los evaluadores ya no está disponible');
            current.assignments.forEach(a=>{if(assigned.includes(a)&&!selected.includes(a.evaluator))a.state='Inactiva';});
            selected.filter(id=>!assigned.some(a=>a.evaluator===id)).forEach(evaluator=>current.assignments.push({id:Admin.nextDemoId(current.assignments,'AS'),period:current.period.id,student:student.id,evaluator,state:'Activa'}));
            Admin.saveDemo(current);
          }
        }catch(error){button.disabled=false;toast(error.message);return;}
        closeModal();toast('Asignación guardada');await renderAdmin('assignments');
      };
    });
  }
  function wireStudentForm(){
    const form=document.getElementById('studentForm');
    form.onsubmit=async e=>{
      e.preventDefault();const fd=new FormData(form);const student=Object.fromEntries(fd.entries());
      try{
        if(!['MCIE','DIE'].includes(student.program))throw new Error('Selecciona el programa MCIE o DIE');
        if(!API.isDemo())await API.call('saveStudent',{student},session.token);
        else{
          if(student.id){
            const index=directoryData.students.findIndex(item=>item.id===student.id);
            if(index<0)throw new Error('No se encontró el estudiante seleccionado');
            directoryData.students[index]={...directoryData.students[index],...student,period:student.periodId};
          }else{
            student.id=Admin.nextDemoId(directoryData.students,'EST');
            student.period=student.periodId;
            student.state='Activo';
            directoryData.students.push(student);
          }
          Admin.saveDemo(directoryData);
        }
        closeModal();toast('Estudiante guardado');renderAdmin('students');
      }catch(error){toast(error.message);}
    };
  }
  function wireEvaluatorForm(){
    const form=document.getElementById('evaluatorForm');
    form.onsubmit=async e=>{
      e.preventDefault();const fd=new FormData(form);const evaluator=Object.fromEntries(fd.entries());
      try{
        if(!API.isDemo())await API.call('saveEvaluator',{evaluator},session.token);
        else{
          const current=await Admin.loadManagement(),username=evaluator.username.trim().toLowerCase();
          if(Auth.demoUsernameTaken(current,username))throw new Error('El usuario ya existe');
          evaluator.id=Admin.nextDemoId(current.evaluators,'EV');evaluator.state='Activo';current.evaluators.push(evaluator);Admin.saveDemo(current);
        }
        closeModal();toast('Evaluador guardado');renderAdmin('evaluators');
      }catch(error){toast(error.message);}
    };
  }
  function openCsvImport(type){
    const config=type==='students'?{
      title:'Importar estudiantes desde CSV',
      required:['matricula','nombre','programa','semestre','titulodetesis','directordetesis'],
      header:'Matrícula,Nombre,Programa,Semestre,Título de tesis,Director // Codirector,Periodo',
      description:'Columnas requeridas: matrícula, nombre, programa (MCIE o DIE), semestre, título de tesis y director // codirector. El periodo es opcional; si se omite, se usa el periodo activo.',
      action:'Importar estudiantes'
    }:{
      title:'Importar evaluadores desde CSV',
      required:['nombre','correo','usuario','contrasenatemporal'],
      header:'Nombre,Correo,Usuario,Contraseña temporal',
      description:'Columnas requeridas: nombre, correo, usuario y contraseña temporal. Por seguridad, las contraseñas no se incluyen en las exportaciones CSV.',
      action:'Importar evaluadores'
    };
    openModal(config.title,`<div class="csv-import-guide">
      <p>${config.description}</p>
      <p>Guarda el archivo como CSV en UTF-8. Puedes usar coma o punto y coma como separador; los valores entre comillas pueden contener comas.</p>
      <div class="button-group csv-file-actions">
        <button type="button" class="button secondary" id="downloadCsvTemplate">Descargar plantilla CSV</button>
        <label for="csvImportFile" class="button primary file-picker">Seleccionar archivo CSV</label>
        <input id="csvImportFile" type="file" accept=".csv,text/csv" class="visually-hidden-file">
      </div>
      <div id="csvImportStatus" class="csv-import-status" role="status">Aún no se ha seleccionado un archivo.</div>
      <div id="csvImportErrors" class="alert hidden" role="alert"></div>
      <div class="modal-actions"><button type="button" class="button primary" id="confirmCsvImport" disabled>${config.action}</button></div>
    </div>`);
    let records=[];
    let errors=[];
    document.getElementById('downloadCsvTemplate').onclick=()=>Csv.download([config.header.split(',')],`${type}-plantilla.csv`);
    document.getElementById('csvImportFile').onchange=async event=>{
      records=[];errors=[];
      const file=event.target.files[0];
      if(!file)return;
      try{
        const rows=Csv.parse(await file.text());
        if(rows.length<2)throw new Error('El CSV debe incluir encabezados y al menos un registro.');
        const headers=rows[0].map(normalizeCsvHeader);
        const indexes=headerIndexes(type,headers);
        const missing=config.required.filter(key=>indexes[key]===undefined);
        if(missing.length)throw new Error(`Faltan columnas requeridas: ${missing.join(', ')}.`);
        rows.slice(1).forEach((row,index)=>{
          if(row.length>headers.length){
            errors.push(`Fila ${index+2}: hay más columnas que encabezados. Encierra entre comillas los valores que contienen el separador.`);
            return;
          }
          const parsed=parseImportRow(type,row,indexes,index+2);
          if(parsed.error)errors.push(parsed.error);
          else records.push(parsed.record);
        });
        validateImportRecords(type,records,errors);
        document.getElementById('csvImportStatus').textContent=`${file.name}: ${records.length} registro(s) válido(s).`;
        const errorBox=document.getElementById('csvImportErrors');
        if(errors.length){
          errorBox.textContent=errors.slice(0,8).join(' ')+(errors.length>8?` Y ${errors.length-8} error(es) más.`:'');
          errorBox.classList.remove('hidden');
        }else{
          errorBox.textContent='';
          errorBox.classList.add('hidden');
        }
        document.getElementById('confirmCsvImport').disabled=records.length===0||errors.length>0;
      }catch(error){
        document.getElementById('csvImportStatus').textContent=file.name;
        const errorBox=document.getElementById('csvImportErrors');
        errorBox.textContent=error.message;
        errorBox.classList.remove('hidden');
        document.getElementById('confirmCsvImport').disabled=true;
      }
    };
    document.getElementById('confirmCsvImport').onclick=async()=>{
      try{
        if(type==='students'){
          if(!API.isDemo())await API.call('importStudents',{students:records},session.token);
          else{
            records.forEach(record=>directoryData.students.push({...record,id:Admin.nextDemoId(directoryData.students,'EST'),state:'Activo',period:record.periodId}));
            Admin.saveDemo(directoryData);
          }
        }else if(!API.isDemo())await API.call('importEvaluators',{evaluators:records},session.token);
        else{
          records.forEach(record=>{
            const {password,...evaluator}=record;
            directoryData.evaluators.push({...evaluator,id:Admin.nextDemoId(directoryData.evaluators,'EV'),state:'Activo'});
          });
          Admin.saveDemo(directoryData);
        }
        const count=records.length;
        closeModal();toast(`${count} registro(s) importado(s) correctamente.`);renderAdmin(type);
      }catch(error){toast(error.message);}
    };
  }
  function normalizeCsvHeader(header){
    return String(header||'').trim().toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
  }
  function headerIndexes(type,headers){
    const aliases=type==='students'?{
      matricula:['matricula'],nombre:['nombre','nombrecompleto','name'],programa:['programa','program'],semestre:['semestre','semester'],
      titulodetesis:['titulodetesis','titulotesis','titulodelatesis','titulo','thesistitle'],
      directordetesis:['directordetesis','directortesis','nombredeldirectordetesis','director','thesisdirector','directorcodirector'],
      period:['generacioncohorte','cohorte','generacion','periodo','period','periodoescolar','idperiodo']
    }:{
      nombre:['nombre','name'],correo:['correo','email'],usuario:['usuario','username'],
      contrasenatemporal:['contrasenatemporal','contrasena','password','temporarypassword']
    };
    return Object.fromEntries(Object.entries(aliases).map(([field,names])=>[field,headers.findIndex(h=>names.includes(h))]).filter(([,index])=>index>=0));
  }
  function parseImportRow(type,row,indexes,lineNumber){
    const value=field=>String(row[indexes[field]]??'').trim();
    if(type==='students'){
      const periodValue=indexes.period===undefined?'':value('period');
      const periods=directoryData.periods||[directoryData.period].filter(Boolean);
      const period=periodValue?periods.find(item=>item.id.toLocaleLowerCase('es')===periodValue.toLocaleLowerCase('es')||item.name.toLocaleLowerCase('es')===periodValue.toLocaleLowerCase('es')):directoryData.period;
      if(!period?.id)return {error:periodValue?`Fila ${lineNumber}: no se encontró la cohorte "${periodValue}".`:`Fila ${lineNumber}: indica una cohorte o activa un periodo antes de importar estudiantes.`};
      const record={matricula:value('matricula'),name:value('nombre'),program:value('programa').toUpperCase(),semester:value('semestre'),thesis:value('titulodetesis'),director:value('directordetesis'),periodId:period?.id};
      const missing=['matricula','name','program','semester','thesis','director'].filter(key=>!record[key]);
      if(missing.length)return {error:`Fila ${lineNumber}: faltan datos requeridos (${missing.join(', ')}).`};
      if(!['MCIE','DIE'].includes(record.program))return {error:`Fila ${lineNumber}: el programa debe ser MCIE o DIE.`};
      return {record};
    }
    const record={name:value('nombre'),email:value('correo'),username:value('usuario'),password:value('contrasenatemporal')};
    const missing=['name','email','username','password'].filter(key=>!record[key]);
    if(missing.length)return {error:`Fila ${lineNumber}: faltan datos requeridos (${missing.join(', ')}).`};
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email))return {error:`Fila ${lineNumber}: el correo no tiene un formato válido.`};
    return {record};
  }
  function validateImportRecords(type,records,errors){
    const keys=new Set();
    if(type==='students'){
      records.forEach((record,index)=>{
        const key=`${record.periodId}|${record.matricula.toLocaleLowerCase('es')}`;
        if(keys.has(key)||directoryData.students.some(s=>s.period===record.periodId&&String(s.matricula).toLocaleLowerCase('es')===record.matricula.toLocaleLowerCase('es')))errors.push(`Fila ${index+2}: la matrícula ${record.matricula} ya existe en esa cohorte.`);
        keys.add(key);
      });
    }else{
      const emails=new Set();
      records.forEach((record,index)=>{
        const username=record.username.toLocaleLowerCase('es');
        const email=record.email.toLocaleLowerCase('es');
        if(keys.has(username)||directoryData.evaluators.some(e=>e.username.toLocaleLowerCase('es')===username)||(API.isDemo()&&Auth.demoUsernameTaken(directoryData,username)))errors.push(`Fila ${index+2}: el usuario ${record.username} ya existe.`);
        if(emails.has(email)||directoryData.evaluators.some(e=>e.email.toLocaleLowerCase('es')===email))errors.push(`Fila ${index+2}: el correo ${record.email} ya existe.`);
        keys.add(username);
        emails.add(email);
      });
    }
  }
  function wireReportActions(){
    const type=document.getElementById('reportType');
    const studentFilter=document.getElementById('reportStudentFilter');
    const evaluatorFilter=document.getElementById('reportEvaluatorFilter');
    const semesterFilter=document.getElementById('reportSemesterFilter');
    const programFilter=document.getElementById('reportProgramFilter');
    const updateFilters=()=>{
      studentFilter.classList.toggle('hidden',type.value!=='student');
      evaluatorFilter.classList.toggle('hidden',type.value!=='evaluator');
      semesterFilter.classList.toggle('hidden',!['generation','evaluator'].includes(type.value));
      programFilter.classList.toggle('hidden',!['generation','evaluator'].includes(type.value));
    };
    type.addEventListener('change',updateFilters);
    updateFilters();
    ['reportType','reportStudent','reportEvaluator','reportSemester','reportProgram'].forEach(id=>{
      document.getElementById(id).addEventListener('change',()=>{document.getElementById('reportPreview').innerHTML='';});
    });
    document.getElementById('reportPeriod').addEventListener('change',async event=>{
      const selectedType=type.value;
      try{
        reportData=await Reports.load(event.target.value);
        els.content.innerHTML=Reports.workspace(reportData);
        document.getElementById('reportType').value=selectedType;
        wireReportActions();
      }catch(error){toast(error.message);}
    });
    document.getElementById('viewReport').addEventListener('click',()=>{
      try{
        const selectedType=type.value;
        const result=Reports.createReport(reportData,selectedType,{
          studentId:document.getElementById('reportStudent').value,
          evaluatorId:document.getElementById('reportEvaluator').value,
          semester:document.getElementById('reportSemester').value,
          program:document.getElementById('reportProgram').value
        });
        const preview=document.getElementById('reportPreview');
        preview.innerHTML=`${result.html}<div class="report-actions"><button class="button secondary" id="downloadReport">Descargar CSV</button><button class="button primary" id="printReport">Imprimir / Guardar PDF</button></div>`;
        document.getElementById('downloadReport').addEventListener('click',()=>Reports.download(result));
        document.getElementById('printReport').addEventListener('click',()=>window.print());
        preview.scrollIntoView({behavior:'smooth',block:'start'});
      }catch(error){toast(error.message);}
    });
  }
  async function renderEvaluator(){
    clearInterval(evaluatorTimer);
    els.period.textContent=data.period?.name||'Sin periodo activo';els.title.textContent='Mis estudiantes';
    els.content.innerHTML=Evaluator.dashboard(data);
    evaluatorTimer=setInterval(()=>{
      els.content.querySelectorAll('[data-evaluate][data-done="true"]').forEach(button=>{
        const evaluation=data.evaluations.find(e=>e.student===button.dataset.evaluate&&e.evaluator===data.evaluator.id);
        button.textContent=Evaluator.canEdit(evaluation)?'Editar':'Consultar';
      });
    },1000);
    els.content.querySelectorAll('[data-evaluate]').forEach(b=>b.onclick=()=>{
      const student=data.students.find(s=>s.id===b.dataset.evaluate);
      const existing=data.evaluations.find(e=>e.student===student.id&&e.evaluator===data.evaluator.id);
      const prior=data.evaluations.find(e=>e.student===student.id);
      const rubric=existing?.rubric||prior?.rubric||data.rubric;
      const editable=existing&&Evaluator.canEdit(existing);
      openModal(existing?(editable?'Editar evaluación':'Consulta de evaluación'):'Formulario de evaluación',Evaluator.rubricForm(student,rubric,existing,editable));
      wireEvaluation(existing,student.id,rubric,editable);
    });
  }
  function wireEvaluation(existing, studentId,rubric,editable){
    const form=document.getElementById('evaluationForm');
    if(existing&&!editable)return;
    if(!existing)form.querySelectorAll('[data-score-slider]').forEach(slider=>slider.setCustomValidity('Selecciona un puntaje para este criterio.'));
    const read=()=>{
      const fd=new FormData(form),rawCriteria={};
      rubric.forEach(c=>{const slider=form.elements.namedItem(c.id);rawCriteria[c.id]=slider.validity.valid?fd.get(c.id):'';});
      const time={assigned:fd.get('timeAssigned'),minutes:fd.get('timeMinutes'),seconds:fd.get('timeSeconds')};
      const criteria={...rawCriteria};
      const penalized=rubric.find(c=>c.hasTimePenalty);
      if(penalized&&rawCriteria[penalized.id]!=='')criteria[penalized.id]=Math.max(0,Number(rawCriteria[penalized.id])-Calculations.penalty(time.assigned,time.minutes,time.seconds));
      return {rawCriteria,criteria,time,observations:fd.get('observations')};
    };
    const update=()=>{
      const score=document.getElementById('liveScore');
      const errorBox=document.getElementById('scoreError');
      try{
        const values=read();
        form.querySelectorAll('.criterion').forEach((section,index)=>{
          const c=rubric[index],raw=values.rawCriteria[c.id],number=Number(raw);
          const valid=raw!==''&&Number.isInteger(number)&&number>=0&&number<=100;
          section.querySelector('[data-criterion-result]').textContent=valid?`${c.hasTimePenalty?`Puntaje ajustado: ${values.criteria[c.id]} · `:''}Puntos obtenidos: ${(Number(values.criteria[c.id])*c.weight).toFixed(2)} / ${c.weight*100}`:`Puntos obtenidos: — / ${c.weight*100}`;
          if(c.hasTimePenalty){
            const penalty=Calculations.penalty(values.time.assigned,values.time.minutes,values.time.seconds);
            section.querySelector('[data-penalty-result]').textContent=values.time.minutes===''?'Sin tiempo real registrado.':`Penalización por tiempo: ${penalty} puntos`;
          }
        });
        errorBox.classList.add('hidden');
        score.textContent=form.checkValidity()?Calculations.individual(values.criteria,rubric).toFixed(2)+' pts':'--';
      }catch(error){score.textContent='--';errorBox.textContent=error.message;errorBox.classList.remove('hidden');}
    };
    const selectScore=slider=>{
      slider.setCustomValidity('');
      slider.removeAttribute('aria-valuetext');
      slider.closest('.criterion').querySelector('[data-score-value]').textContent=slider.value;
    };
    form.addEventListener('input',event=>{
      if(event.target.matches('[data-score-slider]'))selectScore(event.target);
      update();
    });
    form.addEventListener('pointerup',event=>{
      if(event.target.matches('[data-score-slider]')&&!event.target.validity.valid){selectScore(event.target);update();}
    });
    update();
    form.onsubmit=async e=>{
      e.preventDefault();
      const button=form.querySelector('[type=submit]');button.disabled=true;
      try{const values=read();Calculations.individual(values.rawCriteria,rubric);let score=Calculations.individual(values.criteria,rubric);
        if(!API.isDemo()){
          const result=await API.call(existing?'updateEvaluation':'submitEvaluation',{studentId,...values,rubric},session.token);
          score=result.individual;
        }
        else{
          const current=await Admin.load();
          if(current.period?.id!==data.period?.id)throw new Error('El periodo activo cambió; abre de nuevo el formulario');
          const evaluations=Admin.forPeriod(current,current.period?.id).evaluations;
          const saved=evaluations.find(e=>(e.round||1)===2&&e.student===studentId&&e.evaluator===data.evaluator.id);
          if(existing&&!saved)throw new Error('La evaluación ya no está disponible');
          if(!existing&&saved)throw new Error('Ya existe una evaluación enviada');
          if(saved&&!Evaluator.canEdit(saved))throw new Error('Solo puedes editar la evaluación el día en que la enviaste');
          const prior=evaluations.find(e=>(e.round||1)===2&&e.student===studentId);
          if(prior&&JSON.stringify(prior.rubric)!==JSON.stringify(rubric))throw new Error('La rúbrica cambió; abre de nuevo el formulario');
          if(saved)Object.assign(saved,{individual:score,...values});
          else current.evaluations.push({period:current.period.id,student:studentId,evaluator:data.evaluator.id,round:2,individual:score,...values,rubric,submittedAt:new Date().toISOString()});
          Admin.saveDemo(current);
        }
        closeModal();toast(`Evaluación ${existing?'actualizada':'enviada'}: ${score.toFixed(2)} puntos`);
        await loadEvaluator();renderEvaluator();
      }catch(error){button.disabled=false;toast(error.message);}
    };
  }
  document.addEventListener('DOMContentLoaded',init);
})();
