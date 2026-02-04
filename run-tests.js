/**
 * Simple test runner para ejecutar tests sin Jest
 * Usando Node.js assert
 */

const assert = require('assert');

// Mock simple de expect
const expect = (actual) => ({
  toBe(expected) {
    if (actual !== expected) {
      throw new Error(`Expected ${expected} but got ${actual}`);
    }
  },
  toEqual(expected) {
    assert.deepStrictEqual(actual, expected);
  },
  toHaveLength(expected) {
    if (actual.length !== expected) {
      throw new Error(`Expected length ${expected} but got ${actual.length}`);
    }
  },
  toContain(expected) {
    if (!actual.includes(expected)) {
      throw new Error(`Expected array to contain ${expected}`);
    }
  },
  toContainEqual(expected) {
    const found = actual.some(item => 
      JSON.stringify(item) === JSON.stringify(expected)
    );
    if (!found) {
      throw new Error(`Expected array to contain ${JSON.stringify(expected)}`);
    }
  },
  toThrow(expectedMessage) {
    let threw = false;
    let actualMessage = '';
    try {
      actual();
    } catch (err) {
      threw = true;
      actualMessage = err.message;
    }
    if (!threw) {
      throw new Error('Expected function to throw');
    }
    if (expectedMessage && !actualMessage.includes(expectedMessage)) {
      throw new Error(`Expected error with "${expectedMessage}" but got "${actualMessage}"`);
    }
  },
  toBeLessThanOrEqual(expected) {
    if (actual > expected) {
      throw new Error(`Expected ${actual} to be <= ${expected}`);
    }
  }
});

global.expect = expect;

// Mock simple de describe/it
const suites = [];
let currentSuite = null;

global.describe = (name, fn) => {
  currentSuite = { name, tests: [] };
  fn();
  if (currentSuite && currentSuite.tests.length > 0) {
    suites.push(currentSuite);
  }
  currentSuite = null;
};

global.test = (name, fn) => {
  if (currentSuite) {
    currentSuite.tests.push({ name, fn });
  }
};

global.beforeEach = () => {}; // No-op para compatibilidad

// Cargar los módulos a testear
global.localStorage = {
  storage: {},
  getItem(key) { return this.storage[key] || null; },
  setItem(key, value) { this.storage[key] = value; }
};

global.document = {
  documentElement: {
    attributes: {},
    setAttribute(key, value) { this.attributes[key] = value; },
    getAttribute(key) { return this.attributes[key]; }
  }
};

// Cargar tests
require('./tests/unit/EntryFilter.test.js');
require('./tests/unit/EntrySearch.test.js');

// Ejecutar tests
console.log('\n🧪 Ejecutando tests...\n');
let passed = 0;
let failed = 0;

suites.filter(s => s).forEach(suite => {
  console.log(`📁 ${suite.name}`);
  suite.tests.forEach(test => {
    try {
      test.fn();
      console.log(`  ✅ ${test.name}`);
      passed++;
    } catch (err) {
      console.log(`  ❌ ${test.name}`);
      console.log(`     ${err.message}`);
      failed++;
    }
  });
});

console.log(`\n📊 Resultados: ${passed} pasados, ${failed} fallidos`);

if (failed > 0) {
  process.exit(1);
}