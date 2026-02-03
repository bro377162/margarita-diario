/**
 * EntryCounter.js
 * Responsabilidad: Contar estadísticas básicas de las entradas
 * Principio SOLID: Single Responsibility
 */

class EntryCounter {
  constructor(entries = []) {
    this.entries = entries;
  }

  /**
   * Devuelve el número total de entradas
   */
  getTotalCount() {
    return this.entries.length;
  }

  /**
   * Devuelve el número de entradas de un mes específico
   * @param {number} year - Año (ej: 2026)
   * @param {number} month - Mes (1-12)
   */
  getCountByMonth(year, month) {
    return this.entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getFullYear() === year && 
             entryDate.getMonth() + 1 === month;
    }).length;
  }

  /**
   * Devuelve el número de entradas del mes actual
   */
  getCurrentMonthCount() {
    const now = new Date();
    return this.getCountByMonth(now.getFullYear(), now.getMonth() + 1);
  }
}

module.exports = EntryCounter;
