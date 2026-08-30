/** Configuration dédiée aux tests unitaires et au rapport de couverture du cœur métier. */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Les mappers et services testés n'ont pas besoin d'un DOM simulé.
    environment: 'node',
    include: ['tests/unit/**/*.test.js'],
    // Un seul worker rend la sortie stable et évite les conflits de globals simulés.
    pool: 'threads',
    fileParallelism: false,
    maxWorkers: 1,
    restoreMocks: true,
    clearMocks: true,
    coverage: {
      // V8 mesure le code réellement exécuté sans instrumentation Babel supplémentaire.
      provider: 'v8',
      reportsDirectory: 'coverage',
      reporter: ['text', 'json-summary', 'html', 'lcov'],
      include: [
        // Le rapport cible le code déterministe ; UI et serveurs relèvent de tests d'intégration.
        'src/shared/api/**/*.js',
        'src/shared/observability/**/*.js',
        'src/features/**/domain/**/*.js',
        'src/features/formations/utils/**/*.js',
        'src/features/**/api/**/*.js',
        'src/utils/**/*.js',
      ],
      exclude: ['src/lib/**', 'src/hooks/**', 'src/utils/formationModalites.js'],
      thresholds: {
        // Une baisse sous ces valeurs fait échouer la CI au lieu de passer inaperçue.
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
