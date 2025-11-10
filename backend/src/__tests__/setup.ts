/**
 * Configuration globale pour les tests Jest.
 * S'exécute avant chaque suite de tests.
 */

// Configuration des variables d'environnement pour les tests
process.env.NODE_ENV = "test";
process.env.JWT_ACCESS_SECRET = "test-access-secret-key-for-jwt-tokens-minimum-32-chars";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret-key-for-jwt-tokens-minimum-32-chars";
process.env.JWT_ACCESS_EXPIRES_IN = "900";
process.env.JWT_REFRESH_EXPIRES_IN = "1209600";
process.env.PORT = "3001";

