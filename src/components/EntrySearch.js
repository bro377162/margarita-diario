/**
 * EntrySearch.js
 * Responsabilidad: Buscar texto en entradas del diario
 * SOLID: Single Responsibility - solo busca en entradas
 */

class EntrySearch {
  constructor(entries = [], options = {}) {
    this.entries = entries;
    this.options = {
      caseSensitive: options.caseSensitive ?? false,
      searchInMood: options.searchInMood ?? true
    };
  }

  /**
   * Normaliza el texto para búsqueda
   * @param {string} text - Texto a normalizar
   * @returns {string} Texto normalizado
   */
  _normalize(text) {
    if (this.options.caseSensitive) {
      return text;
    }
    return text.toLowerCase();
  }

  /**
   * Busca entradas que contengan el texto especificado
   * @param {string} query - Texto a buscar
   * @returns {Array} Entradas que coinciden
   */
  search(query) {
    if (!query || query.trim() === '') {
      return [];
    }

    const searchTerm = this._normalize(query.trim());

    return this.entries.filter(entry => {
      const contentMatch = this._normalize(entry.content).includes(searchTerm);
      
      if (this.options.searchInMood && entry.mood) {
        const moodMatch = this._normalize(entry.mood).includes(searchTerm);
        return contentMatch || moodMatch;
      }
      
      return contentMatch;
    });
  }

  /**
   * Busca entradas y devuelve resultados con texto resaltado
   * @param {string} query - Texto a buscar
   * @returns {Array} Entradas con contenido resaltado
   */
  searchWithHighlight(query) {
    if (!query || query.trim() === '') {
      return [];
    }

    const searchTerm = query.trim();
    const normalizedSearch = this._normalize(searchTerm);
    const results = this.search(query);

    return results.map(entry => {
      const highlightedContent = this._highlightText(entry.content, searchTerm);
      const highlightedMood = entry.mood 
        ? this._highlightText(entry.mood, searchTerm) 
        : entry.mood;

      return {
        ...entry,
        highlightedContent,
        highlightedMood
      };
    });
  }

  /**
   * Resalta las coincidencias en el texto
   * @param {string} text - Texto original
   * @param {string} query - Texto a resaltar
   * @returns {string} Texto con coincidencias resaltadas
   */
  _highlightText(text, query) {
    if (!text || !query) return text;

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const flags = this.options.caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(`(${escapedQuery})`, flags);

    return text.replace(regex, '<mark>$1</mark>');
  }

  /**
   * Sugiere palabras que empiezan con el prefijo dado
   * @param {string} prefix - Prefijo de búsqueda
   * @param {number} limit - Máximo de sugerencias
   * @returns {Array} Palabras sugeridas
   */
  getSuggestions(prefix, limit = 5) {
    if (!prefix || prefix.trim() === '') {
      return [];
    }

    const searchPrefix = this._normalize(prefix.trim());
    const words = new Set();

    this.entries.forEach(entry => {
      // Extraer palabras del contenido
      const contentWords = this._extractWords(entry.content);
      contentWords.forEach(word => {
        if (this._normalize(word).startsWith(searchPrefix)) {
          words.add(word.toLowerCase());
        }
      });

      // Extraer palabras del mood si está habilitado
      if (this.options.searchInMood && entry.mood) {
        const moodWords = this._extractWords(entry.mood);
        moodWords.forEach(word => {
          if (this._normalize(word).startsWith(searchPrefix)) {
            words.add(word.toLowerCase());
          }
        });
      }
    });

    return Array.from(words).slice(0, limit);
  }

  /**
   * Extrae palabras únicas de un texto
   * @param {string} text - Texto a procesar
   * @returns {Array} Palabras únicas
   */
  _extractWords(text) {
    if (!text) return [];
    return text.match(/\b\w+\b/g) || [];
  }

  /**
   * Obtiene todos los hashtags únicos de las entradas
   * @returns {Array} Hashtags sin el símbolo #
   */
  getAllTags() {
    const tags = new Set();

    this.entries.forEach(entry => {
      if (entry.content) {
        const matches = entry.content.match(/#(\w+)/g);
        if (matches) {
          matches.forEach(match => {
            tags.add(match.substring(1).toLowerCase());
          });
        }
      }
    });

    return Array.from(tags).sort();
  }
}

module.exports = EntrySearch;