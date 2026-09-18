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
