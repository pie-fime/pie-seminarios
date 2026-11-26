window.Reports = (() => {
  async function load(periodId) {
    if (!API.isDemo()) return API.call('reports', {periodId}, Auth.getSession()?.token);
    const data = await Admin.load();
    const periods=data.periods||[data.period];
    const period=periods.find(p=>p.id===periodId)||periods.find(p=>p.state==='Activo')||periods[0]||{};
    return {...Admin.forPeriod(data,period?.id),period,periods,rubric:Evaluator.getRubric()};
  }

  function workspace(data) {
    const periods = data.periods||[data.period].filter(Boolean);
    const periodOptions = periods.map(p=>`<option value="${escapeHtml(p.id)}" ${p.id===data.period?.id?'selected':''}>${escapeHtml(p.name)}</option>`).join('');
    const studentOptions = data.students.map(s=>`<option value="${escapeHtml(s.id)}">${escapeHtml(s.matricula)} — ${escapeHtml(s.name)}</option>`).join('');
    const evaluatorOptions = data.evaluators.map(e=>`<option value="${escapeHtml(e.id)}">${escapeHtml(e.name)}</option>`).join('');
    const filterOptions=key=>[...new Set(data.students.map(s=>String(s[key]??'').trim()).filter(Boolean))]
      .sort((a,b)=>a.localeCompare(b,'es',{numeric:true}))
      .map(value=>`<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join('');
    return `<section class="panel report-controls">
      <div class="panel-header"><h2>Generar reporte</h2></div>
      <div class="report-filter-grid">
        <label>Tipo de reporte
          <select id="reportType">
            <option value="student">Evaluaciones por alumno</option>
            <option value="generation">Evaluaciones por periodo</option>
            <option value="evaluator">Evaluaciones por revisor</option>
            <option value="assignments">Asignaciones por periodo</option>
          </select>
        </label>
        <label>Periodo de evaluación
          <select id="reportPeriod">${periodOptions}</select>
        </label>
        <label id="reportStudentFilter">Alumno
          <select id="reportStudent">${studentOptions}</select>
        </label>
        <label id="reportEvaluatorFilter" class="hidden">Revisor
          <select id="reportEvaluator">${evaluatorOptions}</select>
        </label>
        <label id="reportSemesterFilter" class="hidden">Semestre
          <select id="reportSemester"><option value="">Todos los semestres</option>${filterOptions('semester')}</select>
        </label>
        <label id="reportProgramFilter" class="hidden">Programa
          <select id="reportProgram"><option value="">Todos los programas</option>${filterOptions('program')}</select>
        </label>
      </div>
      <button class="button primary" id="viewReport">Visualizar reporte</button>
    </section>
    <div id="reportPreview" aria-live="polite"></div>`;
  }

  function createReport(data, type, selection={}) {
    if (type==='student') return studentReport(data,selection.studentId);
    if (type==='generation') return generationReport(data,selection);
    if (type==='evaluator') return evaluatorReport(data,selection.evaluatorId,selection);
    if (type==='assignments') return assignmentsReport(data);
    throw new Error('Tipo de reporte desconocido');
  }

  function assignmentsReport(data) {
    const headers=['Matrícula','Estudiante','Programa','Título de tesis','Director // Codirector','Evaluadores','Fecha de evaluación','Hora'];
    const rows=data.students.map(student=>{
      const active=data.assignments.filter(a=>a.student===student.id&&a.state==='Activa');
      const names=active.map(a=>data.evaluators.find(e=>e.id===a.evaluator)?.name||a.evaluator);
      return [student.matricula,student.name,student.program||'Sin asignar',student.thesis,student.director,names.join('\n')||'Sin asignar',active[0]?.date?Admin.formatDate(active[0].date):'Sin programar',active[0]?.time||'Sin programar'];
    });
    const html=`<article class="panel printable-report">
      ${reportHeading('Asignaciones por periodo',periodName(data))}
      <div class="table-wrap"><table class="report-table">
        <thead><tr>${headers.map(header=>`<th>${escapeHtml(header)}</th>`).join('')}</tr></thead>
        <tbody>${rows.map(row=>`<tr>${row.map((value,index)=>`<td>${index===5?escapeHtml(value).replace(/\n/g,'<br>'):escapeHtml(value)}</td>`).join('')}</tr>`).join('')||'<tr><td colspan="8">No hay estudiantes en este periodo.</td></tr>'}</tbody>
      </table></div>
    </article>`;
    return {html,csvRows:[['Asignaciones por periodo',periodName(data)],[],headers,...rows],filename:`reporte-asignaciones-${filePart(periodName(data))}.csv`};
  }

  function studentReport(data, studentId) {
    const student=data.students.find(s=>s.id===studentId);
    if(!student)throw new Error('Selecciona un alumno válido para el reporte.');
    const reviewers=reviewersFor(data,student.id);
    const evaluations=reviewers.map(r=>r.evaluation);
    const rubric=evaluations.find(e=>e?.rubric)?.rubric||data.rubric;
    const rows=rubric.map(c=>`<tr><th scope="row">${escapeHtml(c.name)}</th>${evaluations.map(e=>`<td>${scoreFor(e,c.id)}</td>`).join('')}</tr>`).join('');
    const final=completeFinal(data,student.id);
    const reviewerComments=reviewers.map((r,i)=>({label:`R${i+1}`,name:reviewerName(r.name),text:String(r.evaluation?.observations||'').trim()})).filter(r=>r.text);
    const comments=reviewerComments.map(r=>`${r.label}: ${r.text}`).join(' ');
    const html=`<article class="panel printable-report">
      ${reportHeading('Reporte individual del alumno',periodName(data,student.period||data.period?.id))}
      <dl class="report-meta">
        ${meta('Matrícula',student.matricula)}${meta('Nombre',student.name)}
        ${meta('Programa',student.program||'Sin asignar')}${meta('Semestre',student.semester)}${meta('Director // Codirector',student.director)}
        ${meta('Título de tesis',student.thesis)}
      </dl>
      <div class="table-wrap"><table class="report-table">
        <thead><tr><th>Criterio</th>${reviewers.map((r,i)=>`<th>R${i+1} · ${escapeHtml(r.name)}</th>`).join('')}</tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
      ${rubric.some(c=>c.hasTimePenalty)?'<p class="muted">Los puntajes mostrados incluyen la penalización por tiempo cuando corresponde.</p>':''}
      <p class="report-final"><strong>Calificación final:</strong> ${final===null?'Pendiente':`${final.toFixed(2)} / 100`}</p>
      <section class="report-comments-section">
        <h3>Comentarios de los revisores</h3>
        <div class="report-comments">${escapeHtml(comments)}</div>
      </section>
      <section class="report-signatures" aria-label="Firmas de revisores">
        ${reviewers.map((r,i)=>`<div class="report-signature"><div class="signature-line"></div><strong>${escapeHtml(r.name)}</strong><span>Revisor ${i+1}</span></div>`).join('')}
      </section>
    </article>`;
    const csvRows=[
      ['Reporte individual del alumno',periodName(data,student.period||data.period?.id)],
      ['Matrícula',student.matricula],['Nombre',student.name],['Programa',student.program||'Sin asignar'],['Semestre',student.semester],
      ['Director // Codirector',student.director],['Título de tesis',student.thesis],
      [],
      ['Criterio',...reviewers.map((r,i)=>`R${i+1} - ${r.name}`)],
      ...rubric.map(c=>[c.name,...evaluations.map(e=>scoreForCsv(e,c.id))]),
      ['Calificación final',final===null?'Pendiente':final.toFixed(2)],
      [],
      ['Comentarios de los revisores'],
      ...reviewerComments.map(r=>[r.name,r.text])
    ];
    return {html,csvRows,filename:`reporte-alumno-${student.matricula}.csv`};
  }

  function filterStudents(students,selection) {
    return students.filter(student=>
      (!selection.semester||String(student.semester??'').trim()===selection.semester)&&
      (!selection.program||String(student.program??'').trim()===selection.program));
  }
  function reportFilters(selection) {
    return [['Semestre',selection.semester],['Programa',selection.program]].filter(([,value])=>value);
  }
  function generationReport(data,selection) {
    const filtered=filterStudents(data.students,selection);
    const filters=reportFilters(selection);
    const students=filtered.map(student=>{
      const final=completeFinal(data,student.id);
      return `<tr><td>${escapeHtml(student.matricula)}</td><td>${escapeHtml(student.name)}</td><td>${escapeHtml(student.semester??'')}</td><td>${escapeHtml(student.program||'')}</td><td>${final===null?'Pendiente':final.toFixed(2)}</td></tr>`;
    }).join('');
    const completed=filtered.filter(s=>completeFinal(data,s.id)!==null).length;
    const html=`<article class="panel printable-report">
      ${reportHeading('Reportes por periodo de evaluación',periodName(data))}
      <dl class="report-meta">${meta('Periodo de evaluación',periodName(data))}${meta('Fecha de inicio',Admin.formatDate(data.period?.start))}${meta('Fecha de fin',Admin.formatDate(data.period?.end))}${filters.map(([label,value])=>meta(label,value)).join('')}${meta('Alumnos',String(filtered.length))}${meta('Calificaciones completas',`${completed} de ${filtered.length}`)}</dl>
      <div class="table-wrap"><table class="report-table">
        <thead><tr><th>Matrícula</th><th>Nombre del alumno</th><th>Semestre</th><th>Programa</th><th>Calificación final (0–100)</th></tr></thead>
        <tbody>${students||'<tr><td colspan="5">No hay alumnos que coincidan con los filtros en este periodo.</td></tr>'}</tbody>
      </table></div>
    </article>`;
    const csvRows=[
      ['Reportes por periodo de evaluación',periodName(data)],
      ...filters,
      ['Alumnos',filtered.length],['Calificaciones completas',`${completed} de ${filtered.length}`],
      [],
      ['Matrícula','Nombre del alumno','Semestre','Programa','Calificación final (0-100)'],
      ...filtered.map(s=>{const final=completeFinal(data,s.id);return [s.matricula,s.name,s.semester??'',s.program||'',final===null?'Pendiente':final.toFixed(2)];})
    ];
    return {html,csvRows,filename:`reporte-periodo-${filePart(periodName(data))}.csv`};
  }

  function evaluatorReport(data, evaluatorId,selection) {
    const evaluator=data.evaluators.find(e=>e.id===evaluatorId);
    if(!evaluator)throw new Error('Selecciona un revisor válido para el reporte.');
    const assignments=data.assignments.filter(a=>a.evaluator===evaluator.id&&a.state==='Activa');
    const studentIds=[...new Set(assignments.map(a=>a.student))];
    const students=filterStudents(studentIds.map(id=>data.students.find(s=>s.id===id)).filter(Boolean),selection);
    const filters=reportFilters(selection);
    const evaluations=students.map(student=>data.evaluations.find(e=>e.student===student.id&&e.evaluator===evaluator.id));
    const rows=students.map((student,i)=>`<tr><td>${escapeHtml(periodName(data,student.period||data.period?.id))}</td><td>${escapeHtml(student.matricula)}</td><td>${escapeHtml(student.name)}</td><td>${escapeHtml(student.semester??'')}</td><td>${escapeHtml(student.program||'')}</td><td>${evaluations[i]?formatScore(evaluations[i].individual):'Pendiente'}</td></tr>`).join('');
    const submitted=evaluations.filter(Boolean).length;
    const html=`<article class="panel printable-report">
      ${reportHeading('Reporte por revisor',periodName(data))}
      <dl class="report-meta">${meta('Revisor',evaluator.name)}${meta('Correo',evaluator.email)}${meta('Periodo',periodName(data))}${filters.map(([label,value])=>meta(label,value)).join('')}${meta('Alumnos asignados',String(students.length))}${meta('Evaluaciones enviadas',`${submitted} de ${students.length}`)}</dl>
      <div class="table-wrap"><table class="report-table">
        <thead><tr><th>Periodo</th><th>Matrícula</th><th>Nombre del alumno</th><th>Semestre</th><th>Programa</th><th>Calificación del revisor (0–100)</th></tr></thead>
        <tbody>${rows||'<tr><td colspan="6">No hay alumnos asignados a este revisor que coincidan con los filtros en este periodo.</td></tr>'}</tbody>
      </table></div>
    </article>`;
    const csvRows=[
      ['Reporte por revisor',evaluator.name],['Correo',evaluator.email],['Periodo',periodName(data)],...filters,
      ['Evaluaciones enviadas',`${submitted} de ${students.length}`],[],
      ['Periodo','Matrícula','Nombre del alumno','Semestre','Programa','Calificación del revisor (0-100)'],
      ...students.map((student,i)=>[periodName(data,student.period||data.period?.id),student.matricula,student.name,student.semester??'',student.program||'',evaluations[i]?formatScore(evaluations[i].individual):'Pendiente'])
    ];
    return {html,csvRows,filename:`reporte-revisor-${filePart(evaluator.name)}.csv`};
  }

  function reviewersFor(data,studentId) {
    const assignments=data.assignments.filter(a=>a.student===studentId&&a.state==='Activa');
    const assignedIds=[...new Set(assignments.map(a=>a.evaluator))];
    const fallback=data.evaluations.filter(e=>e.student===studentId).map(e=>e.evaluator);
    const selected=[...new Set([...assignedIds,...fallback])].slice(0,3);
    while(selected.length<3)selected.push('');
    return selected.map((id,index)=>{
      const evaluator=data.evaluators.find(e=>e.id===id);
      const evaluation=id?data.evaluations.find(e=>e.student===studentId&&e.evaluator===id):null;
      return {id,name:evaluator?.name||`Revisor ${index+1}`,evaluation};
    });
  }
  function reviewerName(name) {
    return name.replace(/^dr\.?\s+/i,'');
  }
  function completeFinal(data,studentId) {
    const reviewers=reviewersFor(data,studentId);
    if(reviewers.some(r=>!r.id||!r.evaluation||!validScore(r.evaluation.individual)))return null;
    return Calculations.finalAverage(reviewers.map(r=>r.evaluation.individual));
  }

  function scoreFor(evaluation,criterionId) {
    const value=evaluation?.criteria?.[criterionId];
    return value!==undefined&&value!==null&&value!==''&&Number.isFinite(Number(value))?escapeHtml(value):'—';
  }
  function scoreForCsv(evaluation,criterionId) {
    const value=evaluation?.criteria?.[criterionId];
    return value!==undefined&&value!==null&&value!==''&&Number.isFinite(Number(value))?value:'';
  }
  function validScore(score) {return score!==null&&score!==undefined&&!(typeof score==='string'&&!score.trim())&&Number.isFinite(Number(score));}
  function formatScore(score) { return validScore(score)?Number(score).toFixed(2):'Pendiente'; }
  function periodName(data,periodId=data.period?.id) {
    return data.periods?.find(p=>p.id===periodId)?.name||data.period?.name||periodId||'Sin generación';
  }
  function reportHeading(title,cohort) {
    return `<header class="report-heading"><p class="eyebrow">Posgrado en Ingeniería Eléctrica</p><h2>${escapeHtml(title)}</h2><p>${escapeHtml(cohort)}</p></header>`;
  }
  function meta(label,value) {
    return `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value||'—')}</dd></div>`;
  }
  function escapeHtml(value) {
    return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  }
  function filePart(value) {
    return String(value||'reporte').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'reporte';
  }
  function download(report) {
    Csv.download(report.csvRows,report.filename);
  }

  return {load,workspace,createReport,download};
})();
