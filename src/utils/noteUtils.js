/**
 * Utilidades para gestión de notas y criterios editables en tiempo real
 */

export const NOTE_TYPES = {
  SETUP: 'SETUP',
  BASELINE: 'BASELINE',
  ESTIMACIÓN: 'ESTIMACIÓN',
  CONSENSO: 'CONSENSO',
  DISCUSIÓN: 'DISCUSIÓN',
  DUDA: 'DUDA',
  APRENDIZAJE: 'APRENDIZAJE',
  SPLIT: 'SPLIT',
  CRITERIO: 'CRITERIO'
};

export const QUICK_NOTES = {
  [NOTE_TYPES.SETUP]: [
    { text: "Equipo completo confirmado", icon: "✅", color: "green" },
    { text: "Objetivos explicados y aceptados", icon: "🎯", color: "blue" },
    { text: "Reglas de fibonacci confirmadas", icon: "🔢", color: "blue" },
    { text: "Herramientas configuradas", icon: "🛠️", color: "gray" }
  ],
  [NOTE_TYPES.BASELINE]: [
    { text: "Consenso alcanzado", icon: "📌", color: "blue" },
    { text: "Requirió ajuste de expectativas", icon: "🔄", color: "yellow" },
    { text: "Discrepancia significativa", icon: "⚠️", color: "red" },
    { text: "Baseline establecido correctamente", icon: "✨", color: "green" }
  ],
  [NOTE_TYPES.ESTIMACIÓN]: [
    { text: "Estimación compleja, requirió análisis detallado", icon: "🤔", color: "orange" },
    { text: "Estimación clara, consenso rápido", icon: "⚡", color: "green" },
    { text: "Candidata para split en tareas menores", icon: "✂️", color: "red" },
    { text: "Incertidumbre técnica identificada", icon: "❓", color: "yellow" }
  ],
  GENERAL: [
    { text: "Consenso alcanzado rápidamente", icon: "✅", color: "green" },
    { text: "Requirió discusión extensa", icon: "💬", color: "yellow" },
    { text: "Incertidumbre en estimación", icon: "❓", color: "orange" },
    { text: "Nuevo aprendizaje del equipo", icon: "💡", color: "blue" },
    { text: "Pausa necesaria", icon: "☕", color: "gray" },
    { text: "Acción requerida post-sesión", icon: "📋", color: "purple" }
  ]
};

/**
 * Formatea una nota con timestamp y contexto
 */
export const formatNote = (type, content, context = '') => {
  const timestamp = new Date().toLocaleTimeString();
  const contextStr = context ? ` - ${context}` : '';
  return `[${timestamp}] ${type}${contextStr}: ${content}`;
};

/**
 * Exporta notas en formato estructurado
 */
export const exportNotes = (sessionNotes, criteriaHistory, participants, consensus) => {
  const exportData = {
    session: {
      date: new Date().toISOString(),
      participants: participants,
      totalConsensus: Object.keys(consensus).length
    },
    notes: {
      raw: sessionNotes,
      structured: parseNotes(sessionNotes),
      wordCount: sessionNotes.split(' ').length,
      lineCount: sessionNotes.split('\n').filter(line => line.trim()).length
    },
    criteriaChanges: {
      total: criteriaHistory.length,
      changes: criteriaHistory,
      summary: summarizeCriteriaChanges(criteriaHistory)
    },
    insights: generateInsights(sessionNotes, criteriaHistory)
  };

  return exportData;
};

/**
 * Parsea las notas para extraer estructura
 */
const parseNotes = (notes) => {
  if (!notes.trim()) return [];

  return notes.split('\n')
    .filter(line => line.trim())
    .map(line => {
      const timestampMatch = line.match(/^\[(\d{1,2}:\d{2}:\d{2})\]/);
      const typeMatch = line.match(/\] ([A-Z]+)(?:\s*-\s*([^:]+))?:/);

      return {
        timestamp: timestampMatch ? timestampMatch[1] : null,
        type: typeMatch ? typeMatch[1] : 'GENERAL',
        context: typeMatch && typeMatch[2] ? typeMatch[2] : null,
        content: line.replace(/^\[[^\]]+\]\s*[A-Z]*(?:\s*-\s*[^:]*)?:\s*/, ''),
        fullLine: line
      };
    });
};

/**
 * Genera resumen de cambios de criterios
 */
const summarizeCriteriaChanges = (history) => {
  if (history.length === 0) return "No se realizaron cambios en los criterios";

  const changesByPoint = {};
  const changesByField = {};

  history.forEach(change => {
    changesByPoint[change.points] = (changesByPoint[change.points] || 0) + 1;
    changesByField[change.field] = (changesByField[change.field] || 0) + 1;
  });

  return {
    totalChanges: history.length,
    mostModifiedPoint: Object.entries(changesByPoint).sort((a, b) => b[1] - a[1])[0]?.[0],
    mostModifiedField: Object.entries(changesByField).sort((a, b) => b[1] - a[1])[0]?.[0],
    changesByPoint,
    changesByField
  };
};

/**
 * Genera insights automáticos de la sesión
 */
const generateInsights = (notes, criteriaHistory) => {
  const insights = [];
  const parsedNotes = parseNotes(notes);

  // Análisis de tipos de notas
  const noteTypes = {};
  parsedNotes.forEach(note => {
    noteTypes[note.type] = (noteTypes[note.type] || 0) + 1;
  });

  // Insights basados en patrones
  if (noteTypes['CONSENSO'] > noteTypes['DISCUSIÓN']) {
    insights.push("✅ Sesión eficiente: Más consensos que discusiones");
  }

  if (noteTypes['DUDA'] > 3) {
    insights.push("❓ Muchas dudas identificadas: Revisar claridad de tareas");
  }

  if (criteriaHistory.length > 5) {
    insights.push("⚙️ Criterios muy dinámicos: Considerar sesión de recalibración");
  }

  if (noteTypes['APRENDIZAJE'] > 0) {
    insights.push("💡 Sesión de aprendizaje: Nuevo conocimiento adquirido");
  }

  if (noteTypes['SPLIT'] > 2) {
    insights.push("✂️ Tendencia a sobrestimar: Revisar definición de tareas");
  }

  return insights;
};

/**
 * Sugiere mejoras para próximas sesiones
 */
export const generateRecommendations = (sessionData) => {
  const recommendations = [];
  const { notes, criteriaChanges, consensus } = sessionData;

  if (criteriaChanges.total > 3) {
    recommendations.push({
      type: "criterios",
      priority: "alta",
      text: "Revisar criterios antes de la próxima sesión para reducir cambios en vivo"
    });
  }

  const incertidumbreNotes = notes.structured.filter(note =>
    note.content.toLowerCase().includes('duda') ||
    note.content.toLowerCase().includes('incertidumbre')
  ).length;

  if (incertidumbreNotes > 2) {
    recommendations.push({
      type: "claridad",
      priority: "media",
      text: "Preparar definiciones más claras de tareas para reducir incertidumbre"
    });
  }

  return recommendations;
};

/**
 * Templates de notas predefinidas
 */
export const NOTE_TEMPLATES = {
  sessionStart: "Inicio de sesión de calibración con {participantCount} participantes",
  phaseComplete: "Fase {phaseName} completada. Tiempo utilizado: {time}",
  consensusReached: "Consenso alcanzado para '{taskName}': {points} puntos",
  criteriaModified: "Criterio {points} puntos modificado: {field} actualizado",
  sessionEnd: "Sesión finalizada. Total consensos: {totalConsensus}",
  actionItem: "Acción requerida: {action} - Responsable: {responsible}",
  insight: "Insight del equipo: {insight}",
  concern: "Preocupación identificada: {concern}",
  celebration: "Celebración: {achievement}"
};

/**
 * Aplica template de nota
 */
export const applyTemplate = (template, variables = {}) => {
  let note = NOTE_TEMPLATES[template] || template;

  Object.entries(variables).forEach(([key, value]) => {
    note = note.replace(new RegExp(`{${key}}`, 'g'), value);
  });

  return note;
};

export default {
  NOTE_TYPES,
  QUICK_NOTES,
  formatNote,
  exportNotes,
  generateRecommendations,
  NOTE_TEMPLATES,
  applyTemplate
};