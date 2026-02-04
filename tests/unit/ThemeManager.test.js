/**
 * ThemeManager.test.js
 * Tests unitarios para ThemeManager
 */

const ThemeManager = require('../../src/components/ThemeManager');

describe('ThemeManager', () => {
  let manager;
  
  // Mock localStorage
  const mockLocalStorage = {
    storage: {},
    getItem(key) {
      return this.storage[key] || null;
    },
    setItem(key, value) {
      this.storage[key] = value;
    }
  };
  
  // Mock document
  const mockDocument = {
    documentElement: {
      attributes: {},
      setAttribute(key, value) {
        this.attributes[key] = value;
      },
      getAttribute(key) {
        return this.attributes[key];
      }
    }
  };

  beforeEach(() => {
    // Resetear mocks
    mockLocalStorage.storage = {};
    mockDocument.documentElement.attributes = {};
    
    // Asignar mocks globales
    global.localStorage = mockLocalStorage;
    global.document = mockDocument;
    
    manager = new ThemeManager('test-theme-key');
  });

  describe('constructor', () => {
    test('inicializa con tema por defecto light', () => {
      expect(manager.getCurrentTheme()).toBe('light');
    });

    test('carga tema guardado si existe', () => {
      mockLocalStorage.storage['test-theme-key'] = 'dark';
      const newManager = new ThemeManager('test-theme-key');
      expect(newManager.getCurrentTheme()).toBe('dark');
    });
  });

  describe('setTheme', () => {
    test('cambia al tema oscuro', () => {
      manager.setTheme('dark');
      expect(manager.getCurrentTheme()).toBe('dark');
    });

    test('cambia al tema claro', () => {
      manager.setTheme('dark');
      manager.setTheme('light');
      expect(manager.getCurrentTheme()).toBe('light');
    });

    test('guarda tema en localStorage', () => {
      manager.setTheme('dark');
      expect(mockLocalStorage.storage['test-theme-key']).toBe('dark');
    });

    test('aplica tema al documento', () => {
      manager.setTheme('dark');
      expect(mockDocument.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    test('lanza error con tema inválido', () => {
      expect(() => manager.setTheme('invalid')).toThrow('Tema no válido');
    });
  });

  describe('toggle', () => {
    test('alterna de light a dark', () => {
      manager.toggle();
      expect(manager.getCurrentTheme()).toBe('dark');
    });

    test('alterna de dark a light', () => {
      manager.setTheme('dark');
      manager.toggle();
      expect(manager.getCurrentTheme()).toBe('light');
    });

    test('retorna el nuevo tema', () => {
      const result = manager.toggle();
      expect(result).toBe('dark');
    });
  });
});
