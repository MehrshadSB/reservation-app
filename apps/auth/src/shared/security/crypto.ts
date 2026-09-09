import { createHmac, createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";

export function createId(): string {
  return randomUUID();
}

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function hmac(pepper: string, value: string): string {
  return createHmac("sha256", pepper).update(value).digest("hex");
}

export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

export function randomOtpCode(): string {
  const n = randomBytes(4).readUInt32BE(0) % 1_000_000;
  return n.toString().padStart(6, "0");
}

export function safeEqualHex(a: string, b: string): boolean {
  const left = Buffer.from(a, "hex");
  const right = Buffer.from(b, "hex");
  if (left.length !== right.length) {
    return false;
  }
  return timingSafeEqual(left, right);
}

export function signPayload(pepper: string, payload: string): string {
  const body = Buffer.from(payload, "utf8").toString("base64url");
  const signature = hmac(pepper, body);
  return `${body}.${signature}`;
}

export function verifySignedPayload(
  pepper: string,
  token: string,
): string | undefined {
  const separator = token.lastIndexOf(".");
  if (separator <= 0) {
    return undefined;
  }
  const body = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  const expected = hmac(pepper, body);
  if (!safeEqualHex(signature, expected)) {
    return undefined;
  }
  return Buffer.from(body, "base64url").toString("utf8");
}
