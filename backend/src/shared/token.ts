import { createHmac, timingSafeEqual } from "node:crypto";

type JwtPayload = Record<string, unknown> & {
  readonly exp?: number;
  readonly iat?: number;
};

/**
 * Crée un JWT signé en HS256.
 * @param payload Données à encapsuler.
 * @param secret Secret partagé utilisé pour la signature.
 * @param expiresIn Secondes avant expiration (facultatif).
 * @returns Jeton JWT sérialisé.
 */
export function signToken(payload: JwtPayload, secret: string, expiresIn?: number): string {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const issuedAt = Math.floor(Date.now() / 1000);
  const fullPayload: JwtPayload = {
    ...payload,
    iat: issuedAt,
    ...(expiresIn ? { exp: issuedAt + expiresIn } : {}),
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const signature = createSignature(`${encodedHeader}.${encodedPayload}`, secret);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Vérifie un JWT signé en HS256.
 * @param token Jeton à vérifier.
 * @param secret Secret partagé utilisé pour la signature.
 * @returns Payload décodé si signature et expiration valides.
 */
export function verifyToken<T extends JwtPayload>(token: string, secret: string): T {
  const [headerPart, payloadPart, signaturePart] = token.split(".");
  if (!headerPart || !payloadPart || !signaturePart) {
    throw new Error("Invalid token structure");
  }

  const expectedSignature = createSignature(`${headerPart}.${payloadPart}`, secret);
  if (timingSafeCompare(signaturePart, expectedSignature) === false) {
    throw new Error("Invalid token signature");
  }

  const payload: T = JSON.parse(base64UrlDecode(payloadPart)) as T;
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Token expired");
  }

  return payload;
}

function base64UrlEncode(input: string): string {
  return Buffer.from(input, "utf-8").toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function base64UrlDecode(input: string): string {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  return Buffer.from(padded, "base64").toString("utf-8");
}

function createSignature(content: string, secret: string): string {
  return base64UrlEncode(createHmac("sha256", secret).update(content).digest("base64"));
}

function timingSafeCompare(a: string, b: string): boolean {
  const buffA = Buffer.from(a);
  const buffB = Buffer.from(b);
  if (buffA.length !== buffB.length) {
    return false;
  }

  return timingSafeEqual(buffA, buffB);
}

