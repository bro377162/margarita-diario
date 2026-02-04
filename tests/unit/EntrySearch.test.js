/**
 * EntrySearch.test.js
 * Tests unitarios para EntrySearch
 * Responsabilidad: Buscar texto en entradas
 * Principio SOLID: Single Responsibility
 */

const EntrySearch = require('../../src/components/EntrySearch');

describe('EntrySearch', () => {
  const mockEntries = [
    { 
      date: '2026-02-01', 
      content: 'Hoy aprendí sobre JavaScript y testing',
      mood: '🤓 Aprendiendo'
    },
    { 
      date: '2026-02-15', 
      content: 'El testing es fundamental para el desarrollo',
      mood: '💪 Productivo'
    },
    { 
      date: '2026-03-10', 
      content: 'Reflexiones sobre inteligencia artificial',
      mood: '🤔 Reflexivo'
    },
    { 
      date: '2026-01-20', 
      content: 'JavaScript async/await simplifica el código',
      mood: '😊 Contento'
    }
  ];

  describe('constructor', () => {
    test('inicializa con array de entradas', () => {
      const search = new EntrySearch(mockEntries);
      expect(search.entries).toEqual(mockEntries);
    });

    test('inicializa con array vacío por defecto', () => {
      const search = new EntrySearch();
      expect(search.entries).toEqual([]);
    });

    test('configura opciones por defecto', () => {
      const search = new EntrySearch(mockEntries);
      expect(search.options.caseSensitive).toBe(false);
      expect(search.options.searchInMood).toBe(true);
    });
  });

  describe('search', () => {
    test('encuentra entradas por palabra en contenido', () => {
      const search = new EntrySearch(mockEntries);
      const results = search.search('JavaScript');
      
      expect(results).toHaveLength(2);
      expect(results[0].date).toBe('2026-02-01');
      expect(results[1].date).toBe('2026-01-20');
    });

    test('búsqueda es case insensitive por defecto', () => {
      const search = new EntrySearch(mockEntries);
      const results = search.search('javascript');
      
      expect(results).toHaveLength(2);
    });

    test('búsqueda case sensitive cuando se configura', () => {
      const search = new EntrySearch(mockEntries, { caseSensitive: true });
      const results = search.search('javascript');
      
      expect(results).toHaveLength(0);
    });

    test('encuentra coincidencias parciales', () => {
      const search = new EntrySearch(mockEntries);
      const results = search.search('fundament');
      
      expect(results).toHaveLength(1);
      expect(results[0].date).toBe('2026-02-15');
    });

    test('devuelve array vacío cuando no hay coincidencias', () => {
      const search = new EntrySearch(mockEntries);
      const results = search.search('python');
      
      expect(results).toEqual([]);
    });

    test('devuelve array vacío cuando query está vacía', () => {
      const search = new EntrySearch(mockEntries);
      const results = search.search('');
      
      expect(results).toEqual([]);
    });

    test('busca en mood cuando searchInMood es true', () => {
      const search = new EntrySearch(mockEntries);
      const results = search.search('aprendiendo');
      
      expect(results).toHaveLength(1);
      expect(results[0].date).toBe('2026-02-01');
    });

    test('no busca en mood cuando searchInMood es false', () => {
      const search = new EntrySearch(mockEntries, { searchInMood: false });
      const results = search.search('aprendiendo');
      
      expect(results).toHaveLength(0);
    });
  });

  describe('searchWithHighlight', () => {
    test('devuelve resultados con texto resaltado', () => {
      const search = new EntrySearch(mockEntries);
      const results = search.searchWithHighlight('testing');
      
      expect(results).toHaveLength(2);
      expect(results[0].highlightedContent).toContain('<mark>testing</mark>');
    });

    test('resalta múltiples ocurrencias', () => {
      const entries = [
        { date: '2026-02-01', content: 'test test test', mood: '😊' }
      ];
      const search = new EntrySearch(entries);
      const results = search.searchWithHighlight('test');
      
      expect(results[0].highlightedContent.match(/mark/g)).toHaveLength(6); // 3 pares de tags
    });
  });

  describe('getSuggestions', () => {
    test('sugiere palabras que empiezan con el prefijo', () => {
      const search = new EntrySearch(mockEntries);
      const suggestions = search.getSuggestions('jav');
      
      expect(suggestions).toContain('javascript');
    });

    test('limita número de sugerencias', () => {
      const entries = [
        { date: '2026-01-01', content: 'apple apricot avocado', mood: '😊' }
      ];
      const search = new EntrySearch(entries);
      const suggestions = search.getSuggestions('a', 2);
      
      expect(suggestions.length).toBeLessThanOrEqual(2);
    });

    test('devuelve array vacío cuando prefijo está vacío', () => {
      const search = new EntrySearch(mockEntries);
      const suggestions = search.getSuggestions('');
      
      expect(suggestions).toEqual([]);
    });
  });

  describe('getAllTags', () => {
    test('extrae hashtags del contenido', () => {
      const entries = [
        { date: '2026-02-01', content: 'Hoy aprendí #javascript y #testing', mood: '😊' }
      ];
      const search = new EntrySearch(entries);
      const tags = search.getAllTags();
      
      expect(tags).toContain('javascript');
      expect(tags).toContain('testing');
    });

    test('no duplica tags', () => {
      const entries = [
        { date: '2026-02-01', content: '#coding es vida', mood: '😊' },
        { date: '2026-02-02', content: 'Amo el #coding', mood: '😊' }
      ];
      const search = new EntrySearch(entries);
      const tags = search.getAllTags();
      
      expect(tags.filter(t => t === 'coding')).toHaveLength(1);
    });
  });
});