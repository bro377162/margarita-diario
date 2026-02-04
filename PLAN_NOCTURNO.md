# Plan de Trabajo Nocturno - Diario de Margarita

## Horario: 00:00 - 07:00 (modo autónomo)

## Estructura del proyecto
```
margarita-diario/
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── utils/         # Utilidades y helpers
│   └── styles/        # CSS modular
├── tests/
│   ├── unit/          # Tests unitarios
│   └── integration/   # Tests de integración
├── public/
│   └── index.html
└── package.json
```

## Funcionalidades a implementar (priorizadas):

### Fase 1 - Noche 1 (03 feb) ✅ COMPLETADO
1. [x] Sistema de temas (claro/oscuro)
2. [x] Botón para cambiar entre temas
3. [x] Tests unitarios para el switcher de temas

### Fase 2 - Noche 2 (05 feb) ✅ COMPLETADO
4. [x] Filtro de entradas por fecha/mes/año (EntryFilter)
5. [x] Buscador de entradas con resaltado (EntrySearch)
6. [x] Tests para filtros y búsqueda (35 tests pasando)

### Fase 3 - Noche 3
7. [ ] Contador de palabras totales
8. [ ] Estadísticas (entradas por mes, estado de ánimo más frecuente)
9. [ ] Tests para estadísticas

### Fase 4 - Noche 4
10. [ ] Exportar diario a PDF
11. [ ] RSS feed
12. [ ] Tests finales

## Principios SOLID (obligatorios)

### S - Single Responsibility
Cada módulo/clase hace UNA sola cosa.
- ❌ `utils.js` con 500 líneas → ✅ `dateUtils.js`, `themeUtils.js`, `statsUtils.js`
- ❌ `app.js` monolito → ✅ Componentes separados

### O - Open/Closed
Extensible sin modificar código existente.
- Añadir nuevos temas = nuevo archivo, no tocar `themeManager.js`

### L - Liskov Substitution
Las implementaciones deben ser intercambiables.
- `ThemeProvider` funciona igual para dark/light sin cambiar código

### I - Interface Segregation
Interfaces pequeñas y específicas.
- `ThemeSwitcher` ≠ `StatsCalculator` ≠ `EntryRenderer`

### D - Dependency Inversion
Depender de abstracciones, no implementaciones.
- `EntryRepository` usa interfaz, no sabe si es localStorage/memory

## Reglas de oro:
- ✅ Cada función nueva = test unitario
- ✅ Si tests fallan → NO desplegar
- ✅ **NO FICHEROS INFINITOS** → Máximo 150 líneas por archivo
- ✅ Commits frecuentes con mensajes claros
- ✅ Al final de la noche: resumen en formato para el cron matutino
- ✅ Despliegue solo si todo pasa

## Framework de testing: Jest + jsdom
## CI/CD: GitHub Actions (opcional) o despliegue manual post-tests
