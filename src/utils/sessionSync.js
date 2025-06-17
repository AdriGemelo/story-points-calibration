/**
 * Utilidades para sincronización de sesión
 * Permite compartir estado entre múltiples usuarios
 */

export class SessionSync {
  constructor(sessionId) {
    this.sessionId = sessionId;
    this.pollInterval = null;
    this.callbacks = new Set();
  }

  /**
   * Guarda el estado actual en localStorage
   */
  saveState(data) {
    const sessionData = {
      ...data,
      timestamp: Date.now(),
      sessionId: this.sessionId
    };

    try {
      localStorage.setItem(`session-${this.sessionId}`, JSON.stringify(sessionData));

      // Notificar a otros tabs/ventanas
      window.dispatchEvent(new StorageEvent('storage', {
        key: `session-${this.sessionId}`,
        newValue: JSON.stringify(sessionData)
      }));
    } catch (error) {
      console.error('Error saving session state:', error);
    }
  }

  /**
   * Carga el estado desde localStorage
   */
  loadState() {
    try {
      const saved = localStorage.getItem(`session-${this.sessionId}`);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error loading session state:', error);
      return null;
    }
  }

  /**
   * Inicia el polling para detectar cambios
   */
  startPolling(callback, interval = 1000) {
    this.callbacks.add(callback);

    if (!this.pollInterval) {
      this.pollInterval = setInterval(() => {
        const state = this.loadState();
        if (state) {
          this.callbacks.forEach(cb => {
            try {
              cb(state);
            } catch (error) {
              console.error('Error in polling callback:', error);
            }
          });
        }
      }, interval);
    }

    // Escuchar cambios en otras ventanas
    window.addEventListener('storage', this.handleStorageChange.bind(this));
  }

  /**
   * Detiene el polling
   */
  stopPolling(callback) {
    if (callback) {
      this.callbacks.delete(callback);
    } else {
      this.callbacks.clear();
    }

    if (this.callbacks.size === 0 && this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
      window.removeEventListener('storage', this.handleStorageChange.bind(this));
    }
  }

  /**
   * Maneja cambios de storage de otras ventanas
   */
  handleStorageChange(event) {
    if (event.key === `session-${this.sessionId}` && event.newValue) {
      try {
        const newState = JSON.parse(event.newValue);
        this.callbacks.forEach(cb => {
          try {
            cb(newState);
          } catch (error) {
            console.error('Error in storage change callback:', error);
          }
        });
      } catch (error) {
        console.error('Error parsing storage change:', error);
      }
    }
  }

  /**
   * Limpia la sesión
   */
  clearSession() {
    try {
      localStorage.removeItem(`session-${this.sessionId}`);
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }

  /**
   * Genera un ID único para la sesión
   */
  static generateSessionId() {
    return `sp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default SessionSync;