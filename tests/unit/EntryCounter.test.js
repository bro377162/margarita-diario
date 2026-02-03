/**
 * EntryCounter.test.js
 * Tests unitarios para EntryCounter
 * Cobertura: 100% de métodos públicos
 */

const EntryCounter = require('../../src/components/EntryCounter');

describe('EntryCounter', () => {
  
  describe('getTotalCount', () => {
    test('devuelve 0 cuando no hay entradas', () => {
      const counter = new EntryCounter([]);
      expect(counter.getTotalCount()).toBe(0);
    });

    test('devuelve el número correcto de entradas', () => {
      const entries = [
        { date: '2026-02-01', content: 'Entrada 1' },
        { date: '2026-02-02', content: 'Entrada 2' },
        { date: '2026-02-03', content: 'Entrada 3' }
      ];
      const counter = new EntryCounter(entries);
      expect(counter.getTotalCount()).toBe(3);
    });
  });

  describe('getCountByMonth', () => {
    test('cuenta correctamente entradas de febrero 2026', () => {
      const entries = [
        { date: '2026-02-01', content: 'Feb 1' },
        { date: '2026-02-15', content: 'Feb 15' },
        { date: '2026-01-20', content: 'Ene 20' }
      ];
      const counter = new EntryCounter(entries);
      expect(counter.getCountByMonth(2026, 2)).toBe(2);
    });

    test('devuelve 0 cuando no hay entradas en ese mes', () => {
      const entries = [
        { date: '2026-03-01', content: 'Marzo' }
      ];
      const counter = new EntryCounter(entries);
      expect(counter.getCountByMonth(2026, 2)).toBe(0);
    });
  });

  describe('getCurrentMonthCount', () => {
    test('cuenta entradas del mes actual', () => {
      const now = new Date();
      const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
      const currentYear = now.getFullYear();
      
      const entries = [
        { date: `${currentYear}-${currentMonth}-01`, content: 'Este mes' },
        { date: `${currentYear}-${currentMonth}-15`, content: 'Este mes también' },
        { date: '2025-01-01', content: 'Mes anterior' }
      ];
      
      const counter = new EntryCounter(entries);
      expect(counter.getCurrentMonthCount()).toBe(2);
    });
  });
});
