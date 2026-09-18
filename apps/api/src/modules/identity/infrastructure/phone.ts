export class InvalidPhoneNumberError extends Error {
  constructor(message = "Invalid phone number") {
    super(message);
    this.name = "InvalidPhoneNumberError";
  }
}

export function normalizePhoneNumber(input: string): string {
  const trimmed = input.trim().replace(/[\s-]/g, "");

  if (/^\+[1-9]\d{7,14}$/.test(trimmed)) {
    return trimmed;
  }

  if (/^09\d{9}$/.test(trimmed)) {
    return `+98${trimmed.slice(1)}`;
  }

  if (/^9\d{9}$/.test(trimmed)) {
    return `+98${trimmed}`;
  }

  throw new InvalidPhoneNumberError();
}
