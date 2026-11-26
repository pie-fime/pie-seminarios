const DEFAULT_CRITERIA = [
  {
    id:'C1', num:1, weight:15,
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
    id:'C2', num:2, weight:20,
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
    id:'C3', num:3, weight:20,
    name:'Metodología y seguimiento del plan de trabajo',
    scope:'Evalúa el rigor científico-técnico del enfoque metodológico, su adecuación para comprobar la hipótesis, y el cumplimiento del cronograma de investigación presentado.',
    levels:[
      {cls:'S',lbl:'Sobresaliente',rng:'90–100',
       desc:'La metodología es coherente con la hipótesis y los objetivos. Los métodos seleccionados (matemáticos, computacionales, experimentales) son los apropiados para el problema y se justifica cada decisión. Se presenta un cronograma claro con etapas definidas, y el avance reportado es consistente con lo planificado (≥ 90% de las actividades del período completadas).'},
      {cls:'B',lbl:'Satisfactorio',rng:'70–89',
       desc:'La metodología es adecuada y los métodos están identificados, aunque la justificación de su elección es parcial. El cronograma existe y es comprensible; el avance presenta retrasos menores (70–89% de las actividades del período completadas) con explicación razonable.'},
      {cls:'D',lbl:'En desarrollo',rng:'50–69',
       desc:'La metodología está descrita de manera general sin detallar métodos específicos. El cronograma es vago o poco realista, o el avance muestra retrasos significativos (50–69% completado) sin justificación.'},
      {cls:'I',lbl:'Insuficiente',rng:'0–49',
       desc:'La metodología es inapropiada o está ausente. No se presenta cronograma o el avance real es menor al 50% de lo planificado para el período sin ninguna justificación.'}
    ]
  },
  {
    id:'C4', num:4, weight:10,
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
    id:'C5', num:5, weight:20,
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
    id:'C6', num:6, weight:10,
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
  },
  {
    id:'C7', num:7, weight:5, hasTimePenalty:true,
    name:'Claridad en la presentación y comunicación efectiva',
    scope:'Evalúa la organización, legibilidad y manejo del tiempo durante la exposición. Incluye penalización por incumplimiento del tiempo asignado (10 min).',
    levels:[
      {cls:'S',lbl:'Sobresaliente',rng:'90–100',
       desc:'Las diapositivas son limpias, con jerarquía visual clara y sin exceso de texto. El expositor domina el tema, mantiene contacto visual y responde con solvencia las preguntas del Comité. Se respeta el tiempo asignado (dentro del margen de ±1 min).'},
      {cls:'B',lbl:'Satisfactorio',rng:'70–89',
       desc:'La presentación es ordenada y el expositor se expresa con claridad, aunque con algunas láminas sobrecargadas. Las respuestas al comité son adecuadas. Se respeta el tiempo con un desvío de entre 1 y 2 minutos.'},
      {cls:'D',lbl:'En desarrollo',rng:'50–69',
       desc:'La presentación presenta problemas de orden o legibilidad. El expositor lee de las diapositivas o muestra inseguridad ante preguntas del comité.'},
      {cls:'I',lbl:'Insuficiente',rng:'0–49',
       desc:'La presentación es desorganizada, las diapositivas son ilegibles o el expositor no demuestra dominio suficiente del tema.'}
    ]
  }
];
