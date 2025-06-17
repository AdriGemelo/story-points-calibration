/**
 * Utilidades para exportar resultados de la calibración
 */

/**
 * Exporta los resultados como JSON
 */
export const exportToJSON = (data) => {
  const results = {
    meta: {
      timestamp: new Date().toISOString(),
      tool: 'Story Points Calibration Tool',
      version: '1.0.0',
      session_id: data.sessionId || 'unknown'
    },
    session: {
      participants: data.participants || [],
      totalTasks: data.totalTasks || 0,
      completedTasks: Object.keys(data.consensus || {}).length,
      duration: data.duration || 0
    },
    consensus: data.consensus || {},
    criteria: {
      fibonacciSequence: [1, 2, 3, 5],
      splitRule: '5 points = mandatory split',
      adjustments: {
        backend: '+0 points (team strength)',
        frontend: '+1 point if complex components'
      }
    },
    summary: generateSummary(data)
  };

  const dataStr = JSON.stringify(results, null, 2);
  downloadFile(dataStr, 'story-points-calibration-results.json', 'application/json');
};

/**
 * Exporta los resultados como CSV
 */
export const exportToCSV = (data) => {
  const headers = ['Task ID', 'Task Title', 'Stack', 'Consensus Points', 'Notes', 'Timestamp'];
  const rows = Object.entries(data.consensus || {}).map(([taskId, consensusData]) => {
    const task = data.allTasks?.find(t => t.id === parseInt(taskId));
    return [
      taskId,
      task?.title || 'Unknown',
      task?.stack || 'Unknown',
      consensusData.points || '',
      consensusData.notes || '',
      consensusData.timestamp ? new Date(consensusData.timestamp).toLocaleString() : ''
    ];
  });

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  downloadFile(csvContent, 'story-points-calibration-results.csv', 'text/csv');
};

/**
 * Exporta un resumen ejecutivo
 */
export const exportSummary = (data) => {
  const summary = generateSummary(data);

  const summaryText = `
RESUMEN EJECUTIVO - CALIBRACIÓN STORY POINTS
============================================

Fecha: ${new Date().toLocaleDateString()}
Participantes: ${summary.totalParticipants}
Tareas Estimadas: ${summary.tasksEstimated}

DISTRIBUCIÓN DE PUNTOS:
${Object.entries(summary.pointsDistribution || {})
  .map(([points, count]) => `  ${points} puntos: ${count} tareas`)
  .join('\n')}

MÉTRICAS:
- Promedio de puntos: ${summary.averagePoints}
- Estimación más común: ${summary.mostCommonEstimate} puntos
- Tiempo promedio por tarea: ${summary.averageTimePerTask || 'N/A'} min

PRÓXIMOS PASOS:
☐ Aplicar criterios en próximo planning
☐ Revisar precisión en retrospectiva
☐ Ajustar criterios según velocity real
☐ Programar sesión de recalibración en 3-4 sprints

CRITERIOS ESTABLECIDOS:
- 1 punto: Cambio trivial (2-4h)
- 2 puntos: Tarea simple (4-8h)
- 3 puntos: Tarea moderada (1-2d)
- 5 puntos: SPLIT OBLIGATORIO (>2-3d)

AJUSTES POR STACK:
- Backend (Java+Spring): Sin ajustes (fortaleza del equipo)
- Frontend (Angular/React): +1 punto si componentes complejos nuevos
  `;

  downloadFile(summaryText, 'story-points-summary.txt', 'text/plain');
};

/**
 * Genera un resumen de la sesión
 */
const generateSummary = (data) => {
  const consensus = data.consensus || {};
  const pointsDistribution = {};

  Object.values(consensus).forEach(consensusData => {
    const points = consensusData.points;
    pointsDistribution[points] = (pointsDistribution[points] || 0) + 1;
  });

  return {
    totalParticipants: data.participants?.length || 0,
    tasksEstimated: Object.keys(consensus).length,
    averagePoints: calculateAveragePoints(consensus),
    pointsDistribution,
    mostCommonEstimate: getMostCommonEstimate(pointsDistribution),
    sessionDuration: data.duration || 0
  };
};

/**
 * Calcula el promedio de puntos
 */
const calculateAveragePoints = (consensus) => {
  const points = Object.values(consensus)
    .map(c => parseInt(c.points))
    .filter(p => !isNaN(p));

  return points.length > 0
    ? (points.reduce((a, b) => a + b, 0) / points.length).toFixed(1)
    : '0';
};

/**
 * Obtiene la estimación más común
 */
const getMostCommonEstimate = (distribution) => {
  if (Object.keys(distribution).length === 0) return 'N/A';

  return Object.entries(distribution)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
};

/**
 * Descarga un archivo
 */
const downloadFile = (content, filename, mimeType) => {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading file:', error);
    // Fallback: copiar al clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(content);
      alert('No se pudo descargar el archivo. Contenido copiado al clipboard.');
    }
  }
};

export default {
  exportToJSON,
  exportToCSV,
  exportSummary
};