/**
 * EntryFilter.js
 * Responsabilidad: Filtrar entradas por fecha/mes
 * SOLID: Single Responsibility - solo filtra entradas
 */

class EntryFilter {
  constructor(entries = []) {
    this.entries = entries;
  }

  /**
   * Filtra entradas por mes y año específicos
   * @param {number} year - Año (ej: 2026)
   * @param {number} month - Mes (1-12)
   * @returns {Array} Entradas filtradas
   */
  filterByMonth(year, month) {
    return this.entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getFullYear() === year && 
             entryDate.getMonth() + 1 === month;
    });
  }

  /**
   * Filtra entradas por año específico
   * @param {number} year - Año (ej: 2026)
   * @returns {Array} Entradas filtradas
   */
  filterByYear(year) {
    return this.entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getFullYear() === year;
    });
  }

  /**
   * Filtra entradas por rango de fechas (inclusive)
   * @param {string} startDate - Fecha inicial (YYYY-MM-DD)
   * @param {string} endDate - Fecha final (YYYY-MM-DD)
   * @returns {Array} Entradas filtradas
   */
  filterByDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return this.entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= start && entryDate <= end;
    });
  }

  /**
   * Obtiene todos los meses únicos que tienen entradas
   * @returns {Array} Array de objetos {year, month} ordenados cronológicamente
   */
  getAvailableMonths() {
    const months = new Map();
    
    this.entries.forEach(entry => {
      const entryDate = new Date(entry.date);
      const year = entryDate.getFullYear();
      const month = entryDate.getMonth() + 1;
      const key = `${year}-${month}`;
      
      if (!months.has(key)) {
        months.set(key, { year, month });
      }
    });
    
    return Array.from(months.values()).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });
  }

  /**
   * Obtiene todos los años únicos que tienen entradas
   * @returns {Array} Array de años ordenados descendente (más reciente primero)
   */
  getAvailableYears() {
    const years = new Set();
    
    this.entries.forEach(entry => {
      const entryDate = new Date(entry.date);
      years.add(entryDate.getFullYear());
    });
    
    return Array.from(years).sort((a, b) => b - a);
  }
}

module.exports = EntryFilter;