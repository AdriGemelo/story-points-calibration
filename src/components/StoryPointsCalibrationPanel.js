import React, { useState, useEffect } from 'react';
import { Users, Clock, Target, Award, BarChart3, Settings, Play, Pause, RotateCcw } from 'lucide-react';

const StoryPointsCalibrationPanel = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [newParticipant, setNewParticipant] = useState('');
  const [currentTask, setCurrentTask] = useState(0);
  const [votes, setVotes] = useState({});
  const [showVotes, setShowVotes] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [consensus, setConsensus] = useState({});
  const [notes, setNotes] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [showCriteriaEditor, setShowCriteriaEditor] = useState(false);
  const [editableCriteria, setEditableCriteria] = useState({
    1: { title: "Cambio Trivial", time: "2-4 horas", description: "Una sola capa, cambio menor, sin integraciones" },
    2: { title: "Tarea Simple", time: "4-8 horas", description: "Una capa principal, funcionalidad directa, integración conocida" },
    3: { title: "Tarea Moderada", time: "1-2 días", description: "Múltiples capas, lógica de negocio nueva, investigación menor" },
    5: { title: "SPLIT OBLIGATORIO", time: "> 2-3 días", description: "Alta complejidad, muchas incertidumbres, dividir en tareas menores" }
  });
  const [criteriaHistory, setCriteriaHistory] = useState([]);

  const fibonacciPoints = [1, 2, 3, 5];

  const phases = [
    { title: "Configuración", duration: 10, icon: Settings },
    { title: "Baseline", duration: 20, icon: Target },
    { title: "Criterios", duration: 25, icon: BarChart3 },
    { title: "Práctica", duration: 35, icon: Play },
    { title: "Resultados", duration: 10, icon: Award }
  ];

  const baselineTasks = [
    {
      id: 1,
      title: "Campo 'nickname' en PaymentMethod",
      description: "Agregar nuevo campo opcional 'nickname' a la entidad PaymentMethod existente",
      criteria: ["Añadir campo en entity JPA", "Actualizar DTO", "Agregar validación opcional"],
      stack: "Backend (Java + Spring)",
      expectedPoints: 1
    },
    {
      id: 2,
      title: "Endpoint GET payment methods",
      description: "Crear endpoint GET para listar payment methods de un usuario",
      criteria: ["Endpoint REST con paginación", "Filtros básicos por tipo", "Tests unitarios", "Documentación OpenAPI"],
      stack: "Backend (Java + Spring)",
      expectedPoints: 2
    },
    {
      id: 3,
      title: "Componente selección payment method",
      description: "Implementar componente de selección de payment method en frontend",
      criteria: ["Componente reutilizable en Angular", "Integración con API backend", "Validación de selección", "Responsive design básico"],
      stack: "Frontend (Angular) + API",
      expectedPoints: 3
    },
    {
      id: 4,
      title: "Sistema completo reglas de negocio",
      description: "Sistema completo de aplicación de reglas de negocio por tipo de usuario",
      criteria: ["Múltiples capas", "Reglas complejas", "Frontend y backend", "Múltiples integraciones"],
      stack: "Full Stack",
      expectedPoints: 5,
      splitRequired: true
    }
  ];

  const practicalTasks = [
    {
      id: 5,
      title: "Validación tarjeta en tiempo real",
      description: "Implementar validación de tarjeta de crédito en tiempo real con API externa",
      criteria: ["Integración API externa", "Validación en frontend", "Manejo de errores", "Cache de resultados"]
    },
    {
      id: 6,
      title: "Dashboard payment methods",
      description: "Dashboard de payment methods por usuario con métricas",
      criteria: ["Componente dashboard", "Gráficos interactivos", "Filtros avanzados", "Export a PDF"]
    },
    {
      id: 7,
      title: "Regla usuarios premium",
      description: "Regla: usuarios premium pueden tener 5+ métodos de pago",
      criteria: ["Validación backend", "UI condicional", "Tests de regla", "Migración de datos"]
    },
    {
      id: 8,
      title: "API webhooks",
      description: "API de webhooks para cambios de estado de payment",
      criteria: ["Endpoint webhooks", "Sistema de eventos", "Retry mechanism", "Documentación API"]
    },
    {
      id: 9,
      title: "Formulario creación payment",
      description: "Componente de formulario de creación de payment method",
      criteria: ["Formulario multi-step", "Validación avanzada", "Integración API", "UX optimizada"]
    },
    {
      id: 10,
      title: "Cache reglas con Redis",
      description: "Cache de reglas de negocio con Redis",
      criteria: ["Implementación Redis", "Estrategia cache", "Invalidación automática", "Monitoreo performance"]
    },
    {
      id: 11,
      title: "Tests e2e flujo pago",
      description: "Tests de integración end-to-end para flujo de pago",
      criteria: ["Scenarios completos", "Data setup", "Cucumber features", "CI/CD integration"]
    }
  ];

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const addParticipant = () => {
    if (newParticipant.trim() && !participants.includes(newParticipant.trim())) {
      setParticipants([...participants, newParticipant.trim()]);
      setNewParticipant('');
    }
  };

  // Componente para panel de notas
  const renderNotesPanel = () => (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg z-50 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900">📝 Notas de Sesión</h3>
        <button
          onClick={() => setShowNotesPanel(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* Notas rápidas */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">🚀 Notas Rápidas</h4>
        <div className="grid grid-cols-2 gap-1 mb-2">
          <button
            onClick={() => addQuickNote("CONSENSO", "Consenso alcanzado rápidamente")}
            className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs hover:bg-green-200"
          >
            ✅ Consenso OK
          </button>
          <button
            onClick={() => addQuickNote("DISCUSIÓN", "Requirió discusión extensa")}
            className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs hover:bg-yellow-200"
          >
            💬 Discusión
          </button>
          <button
            onClick={() => addQuickNote("DUDA", "Incertidumbre en estimación")}
            className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs hover:bg-orange-200"
          >
            ❓ Duda
          </button>
          <button
            onClick={() => addQuickNote("APRENDIZAJE", "Nuevo aprendizaje del equipo")}
            className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200"
          >
            💡 Learning
          </button>
        </div>
      </div>

      {/* Editor de notas personalizado */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">✏️ Nota Personalizada</h4>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Escribir nota rápida..."
            className="flex-1 px-2 py-1 border rounded text-sm"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                addSessionNote(e.target.value.trim());
                e.target.value = '';
              }
            }}
          />
        </div>
      </div>

      {/* Área de notas completas */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">📄 Notas Completas</h4>
        <textarea
          value={sessionNotes}
          onChange={(e) => setSessionNotes(e.target.value)}
          placeholder="Notas detalladas de la sesión..."
          className="w-full h-40 p-2 border rounded text-sm resize-none"
        />
      </div>

      {/* Historial de cambios de criterios */}
      {criteriaHistory.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">📊 Cambios de Criterios</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {criteriaHistory.map((change, idx) => (
              <div key={idx} className="text-xs bg-gray-50 p-2 rounded">
                <div className="font-medium">[{change.timestamp}] {change.points} pts</div>
                <div className="text-gray-600">{change.field}: "{change.oldValue}" → "{change.newValue}"</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="space-y-2">
        <button
          onClick={exportSessionData}
          className="w-full py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          💾 Exportar Todo
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(sessionNotes);
            alert('Notas copiadas al clipboard');
          }}
          className="w-full py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
        >
          📋 Copiar Notas
        </button>
      </div>
    </div>
  );

  // Componente para editor de criterios
  const renderCriteriaEditor = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900">⚙️ Editor de Criterios en Vivo</h3>
          <button
            onClick={() => setShowCriteriaEditor(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fibonacciPoints.map(points => (
            <div key={points} className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-2xl font-bold ${points === 5 ? 'text-red-600' : 'text-blue-600'}`}>
                  {points} {points === 5 ? '🔄' : 'pts'}
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Título</label>
                  <input
                    type="text"
                    value={editableCriteria[points].title}
                    onChange={(e) => {
                      const oldValue = editableCriteria[points].title;
                      updateCriteria(points, 'title', e.target.value);
                      if (e.target.value !== oldValue) {
                        saveCriteriaChange(points, oldValue, e.target.value, 'título');
                      }
                    }}
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Tiempo Estimado</label>
                  <input
                    type="text"
                    value={editableCriteria[points].time}
                    onChange={(e) => {
                      const oldValue = editableCriteria[points].time;
                      updateCriteria(points, 'time', e.target.value);
                      if (e.target.value !== oldValue) {
                        saveCriteriaChange(points, oldValue, e.target.value, 'tiempo');
                      }
                    }}
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Descripción</label>
                  <textarea
                    value={editableCriteria[points].description}
                    onChange={(e) => {
                      const oldValue = editableCriteria[points].description;
                      updateCriteria(points, 'description', e.target.value);
                      if (e.target.value !== oldValue) {
                        saveCriteriaChange(points, oldValue, e.target.value, 'descripción');
                      }
                    }}
                    className="w-full px-2 py-1 border rounded text-sm h-16 resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              setShowCriteriaEditor(false);
              addSessionNote("Criterios actualizados y guardados");
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            ✅ Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );

  const removeParticipant = (participant) => {
    setParticipants(participants.filter(p => p !== participant));
    const newVotes = { ...votes };
    delete newVotes[participant];
    setVotes(newVotes);
  };

  const castVote = (participant, points) => {
    setVotes({
      ...votes,
      [participant]: points
    });
  };

  const revealVotes = () => {
    setShowVotes(true);
  };

  const resetVoting = () => {
    setVotes({});
    setShowVotes(false);
  };

  const startTimer = (minutes) => {
    setTimer(minutes * 60);
    setIsTimerRunning(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateConsensus = () => {
    const voteValues = Object.values(votes);
    if (voteValues.length === 0) return null;

    const voteCount = {};
    voteValues.forEach(vote => {
      voteCount[vote] = (voteCount[vote] || 0) + 1;
    });

    const maxVotes = Math.max(...Object.values(voteCount));
    const mostVoted = Object.keys(voteCount).filter(point => voteCount[point] === maxVotes);

    const min = Math.min(...voteValues);
    const max = Math.max(...voteValues);
    const hasConsensus = max - min <= 1;

    return {
      hasConsensus,
      range: `${min}-${max}`,
      mostVoted: mostVoted.join(', '),
      needsDiscussion: !hasConsensus
    };
  };

  const saveConsensus = (taskId, points, notes) => {
    setConsensus({
      ...consensus,
      [taskId]: { points, notes }
    });
  };

  // Funciones para gestión de notas de sesión
  const addSessionNote = (note) => {
    const timestamp = new Date().toLocaleTimeString();
    const newNote = `[${timestamp}] ${note}\n`;
    setSessionNotes(prev => prev + newNote);
  };

  const addQuickNote = (type, content) => {
    const timestamp = new Date().toLocaleTimeString();
    const phase = phases[currentPhase].title;
    const quickNote = `[${timestamp}] ${type} - ${phase}: ${content}\n`;
    setSessionNotes(prev => prev + quickNote);
  };

  // Funciones para edición de criterios
  const updateCriteria = (points, field, value) => {
    setEditableCriteria(prev => ({
      ...prev,
      [points]: {
        ...prev[points],
        [field]: value
      }
    }));
  };

  const saveCriteriaChange = (points, oldValue, newValue, field) => {
    const timestamp = new Date().toLocaleTimeString();
    const change = {
      timestamp,
      points,
      field,
      oldValue,
      newValue,
      phase: phases[currentPhase].title
    };
    setCriteriaHistory(prev => [...prev, change]);
    addSessionNote(`CRITERIO MODIFICADO - ${points} pts: ${field} cambió de "${oldValue}" a "${newValue}"`);
  };

  const exportSessionData = () => {
    const sessionData = {
      date: new Date().toISOString(),
      participants,
      consensus,
      sessionNotes,
      criteriaChanges: criteriaHistory,
      finalCriteria: editableCriteria,
      duration: formatTime(timer)
    };

    const dataStr = JSON.stringify(sessionData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `story-points-session-${new Date().toLocaleDateString()}.json`;
    link.click();
  };

  const renderSetupPhase = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">👥 Gestión de Participantes</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newParticipant}
            onChange={(e) => setNewParticipant(e.target.value)}
            placeholder="Nombre del participante"
            className="flex-1 px-3 py-2 border rounded-md"
            onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
          />
          <button
            onClick={addParticipant}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Agregar
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {participants.map(participant => (
            <span
              key={participant}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {participant}
              <button
                onClick={() => removeParticipant(participant)}
                className="text-blue-600 hover:text-blue-800 ml-1"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-semibold text-green-900 mb-2">🎯 Objetivo de la Sesión</h3>
        <p className="text-green-800">
          Establecer criterios unificados para estimación con Fibonacci (1, 2, 3, 5) considerando:
        </p>
        <ul className="list-disc list-inside text-green-700 mt-2 space-y-1">
          <li>Experiencia del equipo: <strong>Expertos en Backend</strong> (Java + Spring)</li>
          <li>Área de crecimiento: <strong>Frontend</strong> (Angular + React)</li>
          <li>Dominio: <strong>Payment Methods</strong> con reglas de negocio</li>
          <li>Regla: <strong>5 puntos = Split obligatorio</strong></li>
        </ul>
      </div>

      {/* Panel de notas rápidas para setup */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-semibold text-yellow-900 mb-2">📝 Notas de Configuración</h3>
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => addQuickNote("SETUP", "Equipo completo confirmado")}
            className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
          >
            ✅ Equipo Completo
          </button>
          <button
            onClick={() => addQuickNote("SETUP", "Objetivos explicados y aceptados")}
            className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
          >
            🎯 Objetivos OK
          </button>
          <button
            onClick={() => addQuickNote("SETUP", "Reglas de fibonacci confirmadas")}
            className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
          >
            🔢 Fibonacci OK
          </button>
        </div>
      </div>
    </div>
  );

  const renderTaskCard = (task, isBaseline = false) => (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-gray-900">{task.title}</h4>
        {isBaseline && (
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
            Ref: {task.expectedPoints} pts
          </span>
        )}
        {task.splitRequired && (
          <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm">
            SPLIT REQUERIDO
          </span>
        )}
      </div>
      <p className="text-gray-600 mb-3">{task.description}</p>
      <div className="space-y-2">
        <div>
          <span className="font-medium text-sm text-gray-700">Stack: </span>
          <span className="text-sm">{task.stack}</span>
        </div>
        <div>
          <span className="font-medium text-sm text-gray-700">Criterios: </span>
          <ul className="text-sm text-gray-600 mt-1">
            {task.criteria.map((criterion, idx) => (
              <li key={idx}>• {criterion}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderVotingSection = () => (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-semibold mb-4">🗳️ Votación del Equipo</h4>

      {/* Voting Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {fibonacciPoints.map(point => (
          <button
            key={point}
            className="bg-white border-2 border-blue-200 hover:border-blue-400 rounded-lg p-4 text-center font-bold text-lg transition-colors"
            onClick={() => {
              // This would be used in a real voting scenario
            }}
          >
            {point}
          </button>
        ))}
      </div>

      {/* Participants Voting Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
        {participants.map(participant => (
          <div key={participant} className="flex items-center justify-between bg-white p-2 rounded border">
            <span className="text-sm font-medium">{participant}</span>
            <div className="flex gap-1">
              {fibonacciPoints.map(point => (
                <button
                  key={point}
                  onClick={() => castVote(participant, point)}
                  className={`w-8 h-8 rounded text-xs font-bold ${
                    votes[participant] === point
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {point}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Voting Controls */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={revealVotes}
          disabled={Object.keys(votes).length === 0}
          className="flex-1 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300"
        >
          Revelar Votos
        </button>
        <button
          onClick={resetVoting}
          className="py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Results */}
      {showVotes && Object.keys(votes).length > 0 && (
        <div className="bg-white p-4 rounded border">
          <h5 className="font-semibold mb-2">📊 Resultados</h5>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {fibonacciPoints.map(point => {
              const count = Object.values(votes).filter(v => v === point).length;
              return (
                <div key={point} className="text-center">
                  <div className="font-bold text-lg">{point}</div>
                  <div className="text-sm text-gray-600">{count} votos</div>
                  <div className="bg-blue-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all"
                      style={{width: `${(count / participants.length) * 100}%`}}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {(() => {
            const analysis = calculateConsensus();
            return analysis ? (
              <div className={`p-3 rounded ${analysis.hasConsensus ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                <div className="font-semibold">
                  {analysis.hasConsensus ? '✅ Consenso alcanzado' : '⚠️ Requiere discusión'}
                </div>
                <div className="text-sm">
                  Rango: {analysis.range} | Más votado: {analysis.mostVoted}
                </div>
              </div>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );

  const renderBaselinePhase = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-semibold text-yellow-900 mb-2">🎯 Establecimiento de Baseline</h3>
        <p className="text-yellow-800">
          Estimemos estas tareas de referencia para establecer nuestro baseline común.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {baselineTasks.map((task, idx) => (
            <div key={task.id} className={currentTask === idx ? 'ring-2 ring-blue-500' : ''}>
              {renderTaskCard(task, true)}
              {currentTask === idx && (
                <div className="mt-4">
                  {renderVotingSection()}
                  <div className="mt-2 bg-blue-50 p-2 rounded">
                    <div className="flex gap-1 flex-wrap">
                      <button
                        onClick={() => addQuickNote("BASELINE", `Tarea referencia ${task.expectedPoints}pt "${task.title}" - Consenso alcanzado`)}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200"
                      >
                        📌 Baseline OK
                      </button>
                      <button
                        onClick={() => addQuickNote("BASELINE", `Tarea referencia ${task.expectedPoints}pt "${task.title}" - Requirió ajuste de expectativas`)}
                        className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs hover:bg-yellow-200"
                      >
                        🔄 Ajuste
                      </button>
                      <button
                        onClick={() => addQuickNote("BASELINE", `Tarea referencia ${task.expectedPoints}pt "${task.title}" - Discrepancia significativa`)}
                        className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs hover:bg-red-200"
                      >
                        ⚠️ Discrepancia
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold mb-3">⏱️ Control de Tiempo</h4>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {formatTime(timer)}
              </div>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => startTimer(5)}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  5 min
                </button>
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button
                  onClick={() => {setTimer(0); setIsTimerRunning(false);}}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold mb-3">📝 Navegación de Tareas</h4>
            <div className="space-y-2">
              {baselineTasks.map((task, idx) => (
                <button
                  key={task.id}
                  onClick={() => setCurrentTask(idx)}
                  className={`w-full text-left p-2 rounded text-sm ${
                    currentTask === idx
                      ? 'bg-blue-100 text-blue-900 border border-blue-300'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {idx + 1}. {task.title}
                  {consensus[task.id] && (
                    <span className="float-right text-green-600 font-bold">
                      {consensus[task.id].points} pts ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCriteriaPhase = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="font-semibold text-purple-900 mb-2">📋 Definición de Criterios</h3>
        <p className="text-purple-800">
          Basándose en las estimaciones baseline, definamos nuestros criterios específicos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {fibonacciPoints.map(point => {
          const criteria = editableCriteria[point];
          const colorMap = { 1: "green", 2: "blue", 3: "yellow", 5: "red" };
          const color = colorMap[point];

          return (
            <div key={point} className={`bg-${color}-50 border border-${color}-200 rounded-lg p-4`}>
              <div className={`text-2xl font-bold text-${color}-800 mb-2`}>
                {point} {point === 5 ? '🔄' : 'pts'}
              </div>
              <h4 className={`font-semibold text-${color}-900 mb-1`}>{criteria.title}</h4>
              <div className={`text-sm text-${color}-700 mb-2`}>{criteria.time}</div>
              <div className={`text-xs text-${color}-600 mb-2`}>{criteria.description}</div>
              <button
                onClick={() => setShowCriteriaEditor(true)}
                className={`text-xs font-medium text-${color}-800 bg-${color}-100 px-2 py-1 rounded hover:bg-${color}-200`}
              >
                ✏️ Editar
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-4 rounded-lg border">
        <h4 className="font-semibold mb-3">⚖️ Factores de Ajuste por Stack</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-3 rounded">
            <h5 className="font-medium text-green-900 mb-2">💪 Backend (Java + Spring)</h5>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• <strong>+0 puntos</strong> - Área de fortaleza</li>
              <li>• <strong>+1 punto</strong> solo si tecnología completamente nueva</li>
              <li>• Estimación base sin ajustes</li>
            </ul>
          </div>
          <div className="bg-orange-50 p-3 rounded">
            <h5 className="font-medium text-orange-900 mb-2">📈 Frontend (Angular/React)</h5>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• <strong>+1 punto</strong> si componentes complejos nuevos</li>
              <li>• <strong>+0 puntos</strong> si modificación existente</li>
              <li>• <strong>+1 punto</strong> si nueva librería/integración</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">🎯 Reglas de Oro</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="font-medium text-blue-800 mb-2">✅ Hacer</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Comparar con tareas de referencia</li>
              <li>• Split obligatorio en 5 puntos</li>
              <li>• En duda, elegir el mayor</li>
              <li>• Re-calibrar según velocity</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-800 mb-2">❌ Evitar</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Estimar en horas durante planning</li>
              <li>• Asumir conocimiento perfecto</li>
              <li>• Ignorar la experiencia del equipo</li>
              <li>• Tareas > 5 puntos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPracticePhase = () => (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-semibold text-green-900 mb-2">🎲 Ejercicio Práctico</h3>
        <p className="text-green-800">
          Apliquemos los criterios establecidos a tareas reales del proyecto Payment Methods.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {practicalTasks.map((task, idx) => (
            <div key={task.id} className={currentTask === idx ? 'ring-2 ring-green-500' : ''}>
              {renderTaskCard(task)}
              {currentTask === idx && (
                <div className="mt-4">
                  {renderVotingSection()}
                  <div className="mt-4 bg-white p-3 rounded border">
                    <h5 className="font-medium mb-2">📝 Notas de Consenso</h5>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Razones del consenso, dudas discutidas, consideraciones especiales..."
                      className="w-full p-2 border rounded text-sm"
                      rows="3"
                    />
                    <button
                      onClick={() => {
                        const analysis = calculateConsensus();
                        if (analysis) {
                          saveConsensus(task.id, analysis.mostVoted, notes);
                          addSessionNote(`CONSENSO GUARDADO - Tarea "${task.title}": ${analysis.mostVoted} puntos. Notas: ${notes || 'Sin notas adicionales'}`);
                          setNotes('');
                        }
                      }}
                      className="mt-2 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      Guardar Consenso
                    </button>

                    {/* Botones de notas rápidas contextuales */}
                    <div className="mt-2 flex gap-1 flex-wrap">
                      <button
                        onClick={() => addQuickNote("ESTIMACIÓN", `"${task.title}" - Estimación compleja, requirió análisis detallado`)}
                        className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs hover:bg-orange-200"
                      >
                        🤔 Compleja
                      </button>
                      <button
                        onClick={() => addQuickNote("ESTIMACIÓN", `"${task.title}" - Estimación clara, consenso rápido`)}
                        className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs hover:bg-green-200"
                      >
                        ⚡ Rápida
                      </button>
                      <button
                        onClick={() => addQuickNote("SPLIT", `"${task.title}" - Candidata para split en tareas menores`)}
                        className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs hover:bg-red-200"
                      >
                        ✂️ Split
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold mb-3">📊 Progreso de Estimaciones</h4>
            <div className="space-y-2">
              {practicalTasks.map((task, idx) => (
                <button
                  key={task.id}
                  onClick={() => setCurrentTask(idx)}
                  className={`w-full text-left p-2 rounded text-sm ${
                    currentTask === idx
                      ? 'bg-green-100 text-green-900 border border-green-300'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {idx + 1}. {task.title}
                  {consensus[task.id] && (
                    <span className="float-right text-green-600 font-bold">
                      {consensus[task.id].points} pts ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="mt-3 bg-gray-100 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{width: `${(Object.keys(consensus).filter(k => parseInt(k) > 4).length / practicalTasks.length) * 100}%`}}
              />
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {Object.keys(consensus).filter(k => parseInt(k) > 4).length} de {practicalTasks.length} completadas
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold mb-3">📈 Análisis en Tiempo Real</h4>
            {Object.keys(consensus).length > 0 && (
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-2 text-center">
                  {fibonacciPoints.map(point => {
                    const count = Object.values(consensus).filter(c => c.points.includes(point.toString())).length;
                    return (
                      <div key={point} className="bg-gray-50 p-2 rounded">
                        <div className="font-bold">{point}</div>
                        <div className="text-xs text-gray-600">{count} tareas</div>
                      </div>
                    );
                  })}
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  Distribución de puntos del equipo
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderResultsPhase = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">🏆 Resultados y Documentación</h3>
        <p className="text-blue-800">
          Resumen de consensos alcanzados y próximos pasos para el equipo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold mb-3">📊 Tabla de Consenso Final</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Puntos</th>
                    <th className="text-left p-2">Criterio</th>
                    <th className="text-left p-2">Tiempo Est.</th>
                    <th className="text-left p-2">Tareas</th>
                  </tr>
                </thead>
                <tbody>
                  {fibonacciPoints.map(point => {
                    const tasksWithPoint = Object.entries(consensus).filter(([_, data]) =>
                      data.points.includes(point.toString())
                    ).length;
                    const criteria = {
                      1: "Cambio trivial",
                      2: "Tarea simple",
                      3: "Tarea moderada",
                      5: "SPLIT OBLIGATORIO"
                    };
                    const times = {
                      1: "2-4h",
                      2: "4-8h",
                      3: "1-2d",
                      5: ">2-3d"
                    };
                    return (
                      <tr key={point} className="border-b">
                        <td className="p-2 font-bold">{point}</td>
                        <td className="p-2">{criteria[point]}</td>
                        <td className="p-2">{times[point]}</td>
                        <td className="p-2">{tasksWithPoint}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold mb-3">📝 Consensos Alcanzados</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {Object.entries(consensus).map(([taskId, data]) => {
                const task = [...baselineTasks, ...practicalTasks].find(t => t.id === parseInt(taskId));
                return (
                  <div key={taskId} className="bg-gray-50 p-2 rounded text-sm">
                    <div className="font-medium">{task?.title}</div>
                    <div className="text-blue-600 font-bold">{data.points} puntos</div>
                    {data.notes && (
                      <div className="text-gray-600 text-xs mt-1">{data.notes}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-3">🎯 Próximos Pasos</h4>
            <div className="space-y-2 text-green-800">
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Sprint 1: Aplicar criterios en planning</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Retrospectiva: Revisar precisión estimaciones</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Ajuste: Refinar criterios según velocity real</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Refresh: Sesión cada 3-4 sprints</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-3">⚡ Casos Especiales</h4>
            <div className="text-yellow-800 text-sm space-y-1">
              <div><strong>Spike/Investigación:</strong> Max 2 puntos</div>
              <div><strong>Bug crítico:</strong> Como feature equivalente</div>
              <div><strong>Refactor:</strong> Max 3 puntos</div>
              <div><strong>Documentación:</strong> 1 punto por documento</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold mb-3">📈 Métricas a Trackear</h4>
            <div className="text-sm space-y-1">
              <div>• <strong>Precisión:</strong> % tareas completadas en sprint</div>
              <div>• <strong>Velocity:</strong> Puntos completados por sprint</div>
              <div>• <strong>Distribución:</strong> Tipos de tareas más comunes</div>
            </div>
          </div>

          <button
            onClick={() => {
              const results = {
                participants,
                consensus,
                criteria: "Fibonacci 1,2,3,5 with mandatory split at 5",
                date: new Date().toLocaleDateString()
              };
              const dataStr = JSON.stringify(results, null, 2);
              const dataBlob = new Blob([dataStr], {type: 'application/json'});
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'story-points-calibration-results.json';
              link.click();
            }}
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            📥 Exportar Resultados
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calibración Story Points</h1>
            <p className="text-gray-600">Equipo Payment Methods - Sesión de Estandarización</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Users size={16} />
              <span>{participants.length} participantes</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock size={16} />
              <span>{formatTime(timer)}</span>
            </div>

            {/* Botones de herramientas */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowNotesPanel(true)}
                className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${
                  sessionNotes.trim()
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                title="Abrir panel de notas"
              >
                📝 Notas
                {sessionNotes.trim() && (
                  <span className="bg-yellow-800 text-white rounded-full px-1 text-xs">
                    {sessionNotes.split('\n').filter(line => line.trim()).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowCriteriaEditor(true)}
                className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${
                  criteriaHistory.length > 0
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                title="Editar criterios en vivo"
              >
                ⚙️ Criterios
                {criteriaHistory.length > 0 && (
                  <span className="bg-purple-800 text-white rounded-full px-1 text-xs">
                    {criteriaHistory.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Phase Navigation */}
        <div className="flex gap-2 overflow-x-auto">
          {phases.map((phase, idx) => {
            const Icon = phase.icon;
            return (
              <button
                key={idx}
                onClick={() => setCurrentPhase(idx)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  currentPhase === idx
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon size={16} />
                {phase.title}
                <span className="text-xs opacity-75">({phase.duration}min)</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {currentPhase === 0 && renderSetupPhase()}
        {currentPhase === 1 && renderBaselinePhase()}
        {currentPhase === 2 && renderCriteriaPhase()}
        {currentPhase === 3 && renderPracticePhase()}
        {currentPhase === 4 && renderResultsPhase()}
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrentPhase(Math.max(0, currentPhase - 1))}
          disabled={currentPhase === 0}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-300"
        >
          ← Anterior
        </button>
        <button
          onClick={() => setCurrentPhase(Math.min(phases.length - 1, currentPhase + 1))}
          disabled={currentPhase === phases.length - 1}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300"
        >
          Siguiente →
        </button>
      </div>

      {/* Paneles flotantes */}
      {showNotesPanel && renderNotesPanel()}
      {showCriteriaEditor && renderCriteriaEditor()}
    </div>
  );
};

export default StoryPointsCalibrationPanel;