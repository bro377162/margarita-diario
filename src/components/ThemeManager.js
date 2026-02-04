/**
 * ThemeManager.js
 * Responsabilidad: Gestionar el tema actual (claro/oscuro)
 * SOLID: Single Responsibility - solo maneja temas
 */

class ThemeManager {
  constructor(storageKey = 'margarita-theme') {
    this.storageKey = storageKey;
    this.themes = ['light', 'dark'];
    this.currentTheme = this.loadTheme();
  }

  /**
   * Obtiene el tema guardado o devuelve 'light' por defecto
   */
  loadTheme() {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(this.storageKey);
      if (saved && this.themes.includes(saved)) {
        return saved;
      }
    }
    return 'light';
  }

  /**
   * Guarda el tema en localStorage
   */
  saveTheme(theme) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, theme);
    }
  }

  /**
   * Cambia al tema especificado
   */
  setTheme(theme) {
    if (!this.themes.includes(theme)) {
      throw new Error(`Tema no válido: ${theme}`);
    }
    this.currentTheme = theme;
    this.saveTheme(theme);
    this.applyTheme(theme);
    return theme;
  }

  /**
   * Aplica el tema al documento
   */
  applyTheme(theme) {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }

  /**
   * Alterna entre temas
   */
  toggle() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    return this.setTheme(newTheme);
  }

  /**
   * Devuelve el tema actual
   */
  getCurrentTheme() {
    return this.currentTheme;
  }
}

// Exportar para Node.js (tests)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
}
