window.Calculations = (() => {
  function individual(criteriaScores, rubric) {
    if (!rubric || !rubric.length) throw new Error('No hay rúbrica configurada');
    const sumWeights = rubric.reduce((sum, c) => sum + Number(c.weight || 0), 0);
    if (Math.abs(sumWeights - 1) > 0.0001) throw new Error('La suma de ponderaciones debe ser 1');
    const weighted = rubric.reduce((sum, c) => {
      const value = criteriaScores[c.id];
      const score = Number(value);
      if (value === '' || value === null || value === undefined || !Number.isInteger(score) || score < 0 || score > 100) throw new Error(`Calificación inválida en ${c.name}`);
      return sum + Number(c.weight) * score;
    }, 0);
    return Math.round(weighted * 100) / 100;
  }
  function penalty(assigned,minutes,seconds) {
    if(minutes==='' && seconds==='')return 0;
    const a=Number(assigned),m=Number(minutes),s=seconds===''?0:Number(seconds);
    if(assigned===''||minutes===''||!Number.isInteger(a)||a<1||a>120||!Number.isInteger(m)||m<0||m>120||!Number.isInteger(s)||s<0||s>59)throw new Error('Revisa los tiempos de presentación');
    const deviation=Math.abs(m*60+s-a*60);
    return deviation<=60?0:deviation<=180?10:deviation<=300?20:40;
  }
  function scenarioPenalty(scenario) {
    if (!['0','10','20','40'].includes(scenario)) throw new Error('Selecciona un escenario de tiempo válido');
    return Number(scenario);
  }
  function finalAverage(individualScores) {
    if (!Array.isArray(individualScores) || individualScores.length !== 3) return null;
    const numbers = individualScores.map(Number);
    if (numbers.some(n => !Number.isFinite(n))) return null;
    return Math.round((numbers.reduce((a, b) => a + b, 0) / 3) * 100) / 100;
  }
  return { individual, penalty, scenarioPenalty, finalAverage };
})();
