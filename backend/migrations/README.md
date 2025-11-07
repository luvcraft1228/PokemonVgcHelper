# Migrations PostgreSQL

- Nommez les fichiers en respectant un préfixe numérique croissant, ex. `0001_create_users.sql`.
- Les fichiers sont exécutés dans l'ordre alphabétique et enregistrés dans la table `schema_migrations`.
- Écrire des migrations idempotentes lorsque possible, et toujours prévoir un `BEGIN`/`COMMIT` implicite pris en charge par le script (ne pas ajouter de clauses transactionnelles dans les fichiers).
- Les fichiers SQL sont encodés en UTF-8 sans BOM.

