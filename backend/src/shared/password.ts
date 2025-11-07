import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const SALT_LENGTH_BYTES = 16;
const KEY_LENGTH_BYTES = 64;

/**
 * Génère un hash sécurisé à partir d'un mot de passe.
 * @param password Mot de passe en clair.
 * @returns Chaîne encodant sel et hash.
 */
export function hashPassword(password: string): string {
  const salt: Buffer = randomBytes(SALT_LENGTH_BYTES);
  const derived: Buffer = scryptSync(password, salt, KEY_LENGTH_BYTES);
  return `${salt.toString("hex")}::${derived.toString("hex")}`;
}

/**
 * Vérifie si un mot de passe correspond au hash stocké.
 * @param password Mot de passe en clair.
 * @param storedHash Hash précédemment généré via `hashPassword`.
 * @returns Résultat booléen de la comparaison.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  const [saltHex, hashHex] = storedHash.split("::");
  if (!saltHex || !hashHex) {
    return false;
  }

  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(password, salt, expected.length);
  return timingSafeEqual(actual, expected);
}

