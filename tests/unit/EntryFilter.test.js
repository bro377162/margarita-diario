/**
 * EntryFilter.test.js
 * Tests unitarios para EntryFilter
 * Responsabilidad: Filtrar entradas por fecha/mes
 * Principio SOLID: Single Responsibility
 */

const EntryFilter = require('../../src/components/EntryFilter');

describe('EntryFilter', () => {
  const mockEntries = [
    { date: '2026-02-01', content: 'Primera entrada de febrero', mood: '😊' },
    { date: '2026-02-15', content: 'Segunda entrada de febrero', mood: '🤔' },
    { date: '2026-03-10', content: 'Entrada de marzo', mood: '😊' },
    { date: '2026-01-20', content: 'Entrada de enero', mood: '😢' },
    { date: '2025-12-25', content: 'Navidad 2025', mood: '🎄' }
  ];

  describe('constructor', () => {
    test('inicializa con array de entradas', () => {
      const filter = new EntryFilter(mockEntries);
      expect(filter.entries).toEqual(mockEntries);
    });

    test('inicializa con array vacío por defecto', () => {
      const filter = new EntryFilter();
      expect(filter.entries).toEqual([]);
    });
  });

  describe('filterByMonth', () => {
    test('filtra entradas de febrero 2026', () => {
      const filter = new EntryFilter(mockEntries);
      const result = filter.filterByMonth(2026, 2);
      
      expect(result).toHaveLength(2);
      expect(result[0].date).toBe('2026-02-01');
      expect(result[1].date).toBe('2026-02-15');
    });

    test('filtra entradas de marzo 2026', () => {
      const filter = new EntryFilter(mockEntries);
      const result = filter.filterByMonth(2026, 3);
      
      expect(result).toHaveLength(1);
      expect(result[0].date).toBe('2026-03-10');
    });

    test('devuelve array vacío cuando no hay entradas en ese mes', () => {
      const filter = new EntryFilter(mockEntries);
      const result = filter.filterByMonth(2024, 1);
      
      expect(result).toEqual([]);
    });

    test('devuelve array vacío cuando no hay entradas', () => {
      const filter = new EntryFilter([]);
      const result = filter.filterByMonth(2026, 2);
      
      expect(result).toEqual([]);
    });
  });

  describe('filterByYear', () => {
    test('filtra entradas de 2026', () => {
      const filter = new EntryFilter(mockEntries);
      const result = filter.filterByYear(2026);
      
      expect(result).toHaveLength(4);
      expect(result.every(e => e.date.startsWith('2026'))).toBe(true);
    });

    test('filtra entradas de 2025', () => {
      const filter = new EntryFilter(mockEntries);
      const result = filter.filterByYear(2025);
      
      expect(result).toHaveLength(1);
      expect(result[0].date).toBe('2025-12-25');
    });

    test('devuelve array vacío cuando no hay entradas de ese año', () => {
      const filter = new EntryFilter(mockEntries);
      const result = filter.filterByYear(2024);
      
      expect(result).toEqual([]);
    });
  });

  describe('filterByDateRange', () => {
    test('filtra entradas entre dos fechas', () => {
      const filter = new EntryFilter(mockEntries);
      const result = filter.filterByDateRange('2026-02-01', '2026-03-15');
      
      expect(result).toHaveLength(3);
      expect(result[0].date).toBe('2026-02-01');
      expect(result[1].date).toBe('2026-02-15');
      expect(result[2].date).toBe('2026-03-10');
    });

    test('incluye entradas en los límites exactos', () => {
      const filter = new EntryFilter(mockEntries);
      const result = filter.filterByDateRange('2026-02-01', '2026-02-01');
      
      expect(result).toHaveLength(1);
      expect(result[0].date).toBe('2026-02-01');
    });

    test('devuelve array vacío cuando el rango no coincide', () => {
      const filter = new EntryFilter(mockEntries);
      const result = filter.filterByDateRange('2027-01-01', '2027-12-31');
      
      expect(result).toEqual([]);
    });
  });

  describe('getAvailableMonths', () => {
    test('devuelve meses únicos con entradas', () => {
      const filter = new EntryFilter(mockEntries);
      const result = filter.getAvailableMonths();
      
      expect(result).toContainEqual({ year: 2025, month: 12 });
      expect(result).toContainEqual({ year: 2026, month: 1 });
      expect(result).toContainEqual({ year: 2026, month: 2 });
      expect(result).toContainEqual({ year: 2026, month: 3 });
      expect(result).toHaveLength(4);
    });

    test('no duplica meses con múltiples entradas', () => {
      const entries = [
        { date: '2026-02-01', content: 'A' },
        { date: '2026-02-15', content: 'B' }
      ];
      const filter = new EntryFilter(entries);
      const result = filter.getAvailableMonths();
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ year: 2026, month: 2 });
    });

    test('devuelve array vacío cuando no hay entradas', () => {
      const filter = new EntryFilter([]);
      const result = filter.getAvailableMonths();
      
      expect(result).toEqual([]);
    });
  });

  describe('getAvailableYears', () => {
    test('devuelve años únicos ordenados descendente', () => {
      const filter = new EntryFilter(mockEntries);
      const result = filter.getAvailableYears();
      
      expect(result).toEqual([2026, 2025]);
    });

    test('no duplica años', () => {
      const entries = [
        { date: '2026-02-01', content: 'A' },
        { date: '2026-03-01', content: 'B' }
      ];
      const filter = new EntryFilter(entries);
      const result = filter.getAvailableYears();
      
      expect(result).toHaveLength(1);
      expect(result[0]).toBe(2026);
    });
  });
});