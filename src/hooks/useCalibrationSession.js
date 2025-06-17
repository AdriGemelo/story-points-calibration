import { useState, useEffect, useCallback } from 'react';
import { SessionSync } from '../utils/sessionSync';

/**
 * Hook personalizado para manejar la sesión de calibración
 */
export const useCalibrationSession = (sessionId) => {
  const [session] = useState(() => new SessionSync(sessionId || SessionSync.generateSessionId()));
  const [participants, setParticipants] = useState([]);
  const [votes, setVotes] = useState({});
  const [consensus, setConsensus] = useState({});
  const [currentPhase, setCurrentPhase] = useState(0);
  const [currentTask, setCurrentTask] = useState(0);
  const [sessionStartTime] = useState(Date.now());

  // Cargar estado inicial
  useEffect(() => {
    const savedState = session.loadState();
    if (savedState) {
      setParticipants(savedState.participants || []);
      setVotes(savedState.votes || {});
      setConsensus(savedState.consensus || {});
      setCurrentPhase(savedState.currentPhase || 0);
      setCurrentTask(savedState.currentTask || 0);
    }
  }, [session]);

  // Guardar estado cuando cambie
  useEffect(() => {
    const state = {
      participants,
      votes,
      consensus,
      currentPhase,
      currentTask,
      sessionStartTime,
      lastUpdated: Date.now()
    };
    session.saveState(state);
  }, [session, participants, votes, consensus, currentPhase, currentTask, sessionStartTime]);

  // Funciones para manejar participantes
  const addParticipant = useCallback((name) => {
    if (name.trim() && !participants.includes(name.trim())) {
      setParticipants(prev => [...prev, name.trim()]);
      return true;
    }
    return false;
  }, [participants]);

  const removeParticipant = useCallback((name) => {
    setParticipants(prev => prev.filter(p => p !== name));
    setVotes(prev => {
      const newVotes = { ...prev };
      delete newVotes[name];
      return newVotes;
    });
  }, []);

  // Funciones para manejar votación
  const castVote = useCallback((participant, points) => {
    setVotes(prev => ({
      ...prev,
      [participant]: points
    }));
  }, []);

  const resetVotes = useCallback(() => {
    setVotes({});
  }, []);

  // Función para guardar consenso
  const saveConsensus = useCallback((taskId, points, notes = '') => {
    setConsensus(prev => ({
      ...prev,
      [taskId]: {
        points,
        notes,
        timestamp: Date.now(),
        participants: Object.keys(votes).length,
        votes: { ...votes }
      }
    }));
    // Limpiar votos después de guardar consenso
    resetVotes();
  }, [votes, resetVotes]);

  // Calcular estadísticas
  const getVotingStats = useCallback(() => {
    const voteValues = Object.values(votes);
    if (voteValues.length === 0) return null;

    const voteCount = {};
    voteValues.forEach(vote => {
      voteCount[vote] = (voteCount[vote] || 0) + 1;
    });

    const min = Math.min(...voteValues);
    const max = Math.max(...voteValues);
    const hasConsensus = max - min <= 1;

    const maxVotes = Math.max(...Object.values(voteCount));
    const mostVoted = Object.keys(voteCount).filter(point => voteCount[point] === maxVotes);

    return {
      voteCount,
      hasConsensus,
      range: `${min}-${max}`,
      totalVotes: voteValues.length,
      expectedVotes: participants.length,
      mostVoted: mostVoted.join(', '),
      needsDiscussion: !hasConsensus
    };
  }, [votes, participants.length]);

  // Obtener progreso de la sesión
  const getSessionProgress = useCallback(() => {
    const totalTasks = 11; // 4 baseline + 7 practice
    const completedTasks = Object.keys(consensus).length;
    const progressPercentage = (completedTasks / totalTasks) * 100;
    const sessionDuration = Date.now() - sessionStartTime;

    return {
      totalTasks,
      completedTasks,
      progressPercentage,
      sessionDuration,
      currentPhase,
      currentTask
    };
  }, [consensus, sessionStartTime, currentPhase, currentTask]);

  // Funciones de navegación
  const nextPhase = useCallback(() => {
    setCurrentPhase(prev => Math.min(prev + 1, 4));
  }, []);

  const previousPhase = useCallback(() => {
    setCurrentPhase(prev => Math.max(prev - 1, 0));
  }, []);

  const nextTask = useCallback(() => {
    setCurrentTask(prev => prev + 1);
  }, []);

  const previousTask = useCallback(() => {
    setCurrentTask(prev => Math.max(prev - 1, 0));
  }, []);

  // Limpiar sesión
  const clearSession = useCallback(() => {
    session.clearSession();
    setParticipants([]);
    setVotes({});
    setConsensus({});
    setCurrentPhase(0);
    setCurrentTask(0);
  }, [session]);

  // Cleanup
  useEffect(() => {
    return () => {
      session.stopPolling();
    };
  }, [session]);

  return {
    // Estado
    participants,
    votes,
    consensus,
    currentPhase,
    currentTask,
    sessionId: session.sessionId,

    // Acciones
    addParticipant,
    removeParticipant,
    castVote,
    resetVotes,
    saveConsensus,
    setCurrentPhase,
    setCurrentTask,
    nextPhase,
    previousPhase,
    nextTask,
    previousTask,
    clearSession,

    // Utilidades
    getVotingStats,
    getSessionProgress
  };
};

export default useCalibrationSession;