window.Evaluator = (() => {
  const rubric=DEFAULT_CRITERIA.map(c=>({id:c.id,name:c.name,weight:c.weight/100,scope:c.scope,levels:c.levels,hasTimePenalty:!!c.hasTimePenalty,slider:!!c.slider}));
  const dayFormatter=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Monterrey',year:'numeric',month:'2-digit',day:'2-digit'});
  async function load() {
    if (!API.isDemo()) return API.call('evaluatorDashboard', {}, Auth.getSession()?.token);
    const source=await Admin.load();
    const admin=Admin.forPeriod(source,source.period?.id);
    const evaluator=admin.evaluators.find(e=>e.username===(Auth.getSession()?.username||'evaluador'));
    const assigned=admin.assignments.filter(a=>a.evaluator===evaluator?.id&&a.state==='Activa').map(a=>a.student);
    const students=admin.students.filter(s=>s.period===admin.period.id&&assigned.includes(s.id));
    const allEvaluations=admin.evaluations.filter(e=>(e.round||1)===2);
    const evaluations=allEvaluations.filter(e=>e.evaluator===evaluator?.id&&assigned.includes(e.student));
    const studentRubrics=students.map(s=>({student:s.id,rubric:allEvaluations.find(e=>e.student===s.id)?.rubric})).filter(item=>item.rubric);
    return {evaluator,period:admin.period,evaluations,students,studentRubrics,
      completed:evaluations.map(e=>e.student),rubric};
  }
  function dashboard(data) {
    const pending=data.students.length-(data.completed?.length||0);
    return `<div class="stats-grid">${Admin ? '' : ''}${statCard('Estudiantes asignados',data.students.length)}${statCard('Completadas',data.completed?.length||0)}${statCard('Pendientes',pending)}${statCard('Periodo',data.period?.name||'Sin periodo')}</div>
      <section class="panel"><div class="panel-header"><h2>Estudiantes asignados</h2></div>${table(data)}</section>`;
  }
  function statCard(label,value) { return `<article class="stat-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`; }
  function canEdit(evaluation,now=new Date()) {
    if(!evaluation?.submittedAt)return false;
    const submitted=new Date(evaluation.submittedAt);
    if(!Number.isFinite(submitted.getTime())||submitted>now)return false;
    return dayFormatter.format(submitted)===dayFormatter.format(now);
  }
  function table(data) {
    const rows=data.students.map(s=>{
      const done=data.completed.includes(s.id);
      const evaluation=data.evaluations.find(e=>e.student===s.id&&e.evaluator===data.evaluator?.id);
      return `<tr><td>${escapeHtml(s.matricula)}</td><td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.thesis)}</td><td>${escapeHtml(s.director)}</td><td><span class="badge ${done?'ok':'warn'}">${done?'Completada':'Pendiente'}</span></td><td><button class="text-button" data-evaluate="${escapeHtml(s.id)}" data-done="${done}">${done?(canEdit(evaluation)?'Editar':'Consultar'):'Evaluar'}</button></td></tr>`;
    }).join('');
    return `<div class="table-wrap"><table><thead><tr><th>Matrícula</th><th>Estudiante</th><th>Tesis</th><th>Director // Codirector</th><th>Estado</th><th>Acción</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }
  function rubricForm(student, selectedRubric, existing=null, editable=false) {
    const readOnly=existing&&!editable;
    const time=existing?.time;
    const scenario=time?.scenario??(time?.minutes!==''&&time?.minutes!=null&&time?.assigned!=null?String(Calculations.penalty(time.assigned,time.minutes,time.seconds??'')):null);
    const scenarios=[
      ['0','Escenario 1: Tiempo adecuado (atraso menor o igual a 1 minuto)','0 puntos'],
      ['10','Escenario 2: Más de 1 y hasta 3 minutos de atraso','−10 puntos'],
      ['20','Escenario 3: Más de 3 y hasta 5 minutos de atraso','−20 puntos'],
      ['40','Escenario 4: Más de 5 minutos de atraso','−40 puntos']
    ];
    const criteria=selectedRubric.map(c=>`<section class="criterion"><div class="criterion-head"><div><strong>${escapeHtml(c.name)}</strong><div class="muted">Ponderación ${c.weight*100}%</div></div></div>
      <p class="muted">${escapeHtml(c.scope||'')}</p>
      <label><span>Puntaje (0–100): <output data-score-value>${existing?escapeHtml(existing.rawCriteria?.[c.id]??existing.criteria?.[c.id]??'—'):'Sin seleccionar'}</output></span>
        <input type="range" name="${escapeHtml(c.id)}" min="0" max="100" step="1" value="${escapeHtml(existing?.rawCriteria?.[c.id]??existing?.criteria?.[c.id]??50)}" data-score-slider aria-label="Puntaje de ${escapeHtml(c.name)}" ${readOnly?'disabled':existing?'':'aria-valuetext="Sin seleccionar"'}></label>
      <p class="criterion-result" data-criterion-result>${existing?`${c.hasTimePenalty?`Puntaje ajustado: ${escapeHtml(existing.criteria[c.id])} · `:''}Puntos obtenidos: ${(Number(existing.criteria[c.id])*c.weight).toFixed(2)} / ${c.weight*100}`:`Puntos obtenidos: — / ${c.weight*100}`}</p>
      <details><summary>Ver rúbrica</summary><div class="table-wrap"><table><thead><tr><th>Nivel</th><th>Descriptor</th></tr></thead><tbody>${c.levels.map(l=>`<tr><td>${escapeHtml(l.lbl)} (${escapeHtml(l.rng)})</td><td>${escapeHtml(l.desc)}</td></tr>`).join('')}</tbody></table></div></details>
      ${c.hasTimePenalty?`<fieldset class="time-fields"><legend>Penalización por tiempo</legend><p>Tiempo asignado: 10 minutos. Selecciona un escenario de atraso:</p>
        ${time?.minutes!==''&&time?.minutes!=null?`<p class="muted">Tiempo registrado anteriormente: ${escapeHtml(time.minutes)} min ${escapeHtml(time.seconds||0)} s. La penalización anterior consideraba también las presentaciones que terminaban antes.</p>`:''}
        ${scenarios.map(([value,label,points])=>`<label class="time-option"><input type="radio" name="timeScenario" value="${value}" required ${scenario===value?'checked':''} ${readOnly?'disabled':''}><span>${label} (${points})</span></label>`).join('')}
        <p data-penalty-result>${scenario!==null?`Penalización por tiempo: ${escapeHtml(scenario)} puntos`:'Sin escenario seleccionado.'}</p></fieldset>`:''}</section>`).join('');
    return `<form id="evaluationForm">
      <div class="panel"><strong>${escapeHtml(student.name)}</strong><div class="muted">${escapeHtml(student.matricula)} · ${escapeHtml(student.semester)} · ${escapeHtml(student.director)}</div><div>${escapeHtml(student.thesis)}</div></div>
      <div class="rubric">${criteria}</div>
      <div class="evaluation-score"><span>Calificación individual</span><strong id="liveScore">${existing?Number(existing.individual).toFixed(2)+' pts':'--'}</strong></div>
      <p class="alert hidden" id="scoreError" role="status"></p>
      <label>Observaciones generales<textarea name="observations" rows="5" ${readOnly?'readonly':''}>${escapeHtml(existing?.observations||'')}</textarea></label>
      ${readOnly?'':`<div style="margin-top:14px"><button class="button primary" type="submit">${existing?'Guardar cambios':'Guardar y enviar evaluación'}</button></div>`}
    </form>`;
  }
  function escapeHtml(value) {return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
  function getRubric(){return rubric;}
  return {load,dashboard,rubricForm,getRubric,canEdit};
})();
