window.Evaluator = (() => {
  const rubric=DEFAULT_CRITERIA.map(c=>({id:c.id,name:c.name,weight:c.weight/100,scope:c.scope,levels:c.levels,hasTimePenalty:false,slider:!!c.slider}));
  async function load() {
    if (!API.isDemo()) return API.call('evaluatorDashboard', {}, Auth.getSession()?.token);
    const source=await Admin.load();
    const admin=Admin.forPeriod(source,source.period?.id);
    const evaluator=admin.evaluators.find(e=>e.username==='evaluador');
    const assigned=admin.assignments.filter(a=>a.evaluator===evaluator?.id&&a.state==='Activa').map(a=>a.student);
    const evaluations=admin.evaluations.filter(e=>(e.round||1)===2);
    return {evaluator,sourceData:source,period:admin.period,evaluations,
      students:admin.students.filter(s=>s.period===admin.period.id&&assigned.includes(s.id)),
      completed:evaluations.filter(e=>e.evaluator===evaluator?.id).map(e=>e.student),rubric};
  }
  function dashboard(data) {
    const pending=data.students.length-(data.completed?.length||0);
    return `<div class="stats-grid">${Admin ? '' : ''}${statCard('Estudiantes asignados',data.students.length)}${statCard('Completadas',data.completed?.length||0)}${statCard('Pendientes',pending)}${statCard('Periodo',data.period?.name||'Sin periodo')}</div>
      <section class="panel"><div class="panel-header"><h2>Estudiantes asignados</h2></div>${table(data)}</section>`;
  }
  function statCard(label,value) { return `<article class="stat-card"><span>${label}</span><strong>${value}</strong></article>`; }
  function table(data) {
    const rows=data.students.map(s=>{
      const done=data.completed.includes(s.id);
      return `<tr><td>${s.matricula}</td><td>${s.name}</td><td>${s.thesis}</td><td>${s.director}</td><td><span class="badge ${done?'ok':'warn'}">${done?'Completada':'Pendiente'}</span></td><td><button class="text-button" data-evaluate="${s.id}" data-done="${done}">${done?'Consultar':'Evaluar'}</button></td></tr>`;
    }).join('');
    return `<div class="table-wrap"><table><thead><tr><th>Matrícula</th><th>Estudiante</th><th>Tesis</th><th>Director</th><th>Estado</th><th>Acción</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }
  function rubricForm(student, selectedRubric, existing=null) {
    const criteria=selectedRubric.map(c=>`<section class="criterion"><div class="criterion-head"><div><strong>${escapeHtml(c.name)}</strong><div class="muted">Ponderación ${c.weight*100}%</div></div></div>
      <p class="muted">${escapeHtml(c.scope||'')}</p>
      <label><span>Puntaje (0–100): <output data-score-value>${existing?escapeHtml(existing.rawCriteria?.[c.id]??existing.criteria?.[c.id]??'—'):'Sin seleccionar'}</output></span>
        <input type="range" name="${escapeHtml(c.id)}" min="0" max="100" step="1" value="${escapeHtml(existing?.rawCriteria?.[c.id]??existing?.criteria?.[c.id]??50)}" data-score-slider aria-label="Puntaje de ${escapeHtml(c.name)}" ${existing?'disabled':'aria-valuetext="Sin seleccionar"'}></label>
      <p class="criterion-result" data-criterion-result>${existing?`${c.hasTimePenalty?`Puntaje ajustado: ${escapeHtml(existing.criteria[c.id])} · `:''}Puntos obtenidos: ${(Number(existing.criteria[c.id])*c.weight).toFixed(2)} / ${c.weight*100}`:`Puntos obtenidos: — / ${c.weight*100}`}</p>
      <details><summary>Ver rúbrica</summary><div class="table-wrap"><table><thead><tr><th>Nivel</th><th>Descriptor</th></tr></thead><tbody>${c.levels.map(l=>`<tr><td>${escapeHtml(l.lbl)} (${escapeHtml(l.rng)})</td><td>${escapeHtml(l.desc)}</td></tr>`).join('')}</tbody></table></div></details>
      ${c.hasTimePenalty?`<div class="time-fields"><p>Penalización por tiempo: hasta 1 min: 0; más de 1 a 3: −10; más de 3 a 5: −20; más de 5: −40 puntos en este criterio. La captura del tiempo es opcional.</p>
        <label>Tiempo asignado (min)<input type="number" name="timeAssigned" min="1" max="120" step="1" value="${escapeHtml(existing?.time?.assigned??10)}" ${existing?'readonly':''}></label>
        <label>Tiempo real (min)<input type="number" name="timeMinutes" min="0" max="120" step="1" value="${escapeHtml(existing?.time?.minutes??'')}" ${existing?'readonly':''}></label>
        <label>Tiempo real (seg)<input type="number" name="timeSeconds" min="0" max="59" step="1" value="${escapeHtml(existing?.time?.seconds??'')}" ${existing?'readonly':''}></label>
        <p data-penalty-result>${existing&&existing.time?.minutes!==''&&existing.time?.minutes!=null?`Penalización aplicada: ${Number(existing.rawCriteria[c.id])-Number(existing.criteria[c.id])} puntos`:'Sin tiempo real registrado.'}</p></div>`:''}</section>`).join('');
    return `<form id="evaluationForm">
      <div class="panel"><strong>${escapeHtml(student.name)}</strong><div class="muted">${escapeHtml(student.matricula)} · ${escapeHtml(student.semester)} · ${escapeHtml(student.director)}</div><div>${escapeHtml(student.thesis)}</div></div>
      <div class="rubric">${criteria}</div>
      <div class="evaluation-score"><span>Calificación individual</span><strong id="liveScore">${existing?Number(existing.individual).toFixed(2)+' pts':'--'}</strong></div>
      <p class="alert hidden" id="scoreError" role="status"></p>
      <label>Observaciones generales<textarea name="observations" rows="5" ${existing?'readonly':''}>${escapeHtml(existing?.observations||'')}</textarea></label>
      ${existing?'':`<div style="margin-top:14px"><button class="button primary" type="submit">Guardar y enviar evaluación</button></div>`}
    </form>`;
  }
  function escapeHtml(value) {return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
  function getRubric(){return rubric;}
  return {load,dashboard,rubricForm,getRubric};
})();
