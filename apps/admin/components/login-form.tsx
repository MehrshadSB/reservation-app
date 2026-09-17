"use client";

import { useState, type FormEvent } from "react";
import { getApiUrl } from "../lib/auth";

export function LoginForm({ returnTo }: { returnTo: string }) {
  const apiUrl = getApiUrl();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [challengeId, setChallengeId] = useState<string | undefined>();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [pending, setPending] = useState(false);

  async function requestCode(event: FormEvent) {
    event.preventDefault();
    setError(undefined);
    setPending(true);
    try {
      const response = await fetch(`${apiUrl}/v1/identity/otp/request`, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });
      if (!response.ok) {
        setError("Unable to send code");
        return;
      }
      const body = (await response.json()) as { challengeId: string };
      setChallengeId(body.challengeId);
    } catch {
      setError("Unable to send code");
    } finally {
      setPending(false);
    }
  }

  async function verifyCode(event: FormEvent) {
    event.preventDefault();
    if (!challengeId) {
      return;
    }
    setError(undefined);
    setPending(true);
    try {
      const response = await fetch(`${apiUrl}/v1/identity/otp/verify`, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ challengeId, code }),
      });
      if (!response.ok) {
        setError("Invalid or expired code");
        return;
      }
      window.location.assign(returnTo);
    } catch {
      setError("Invalid or expired code");
    } finally {
      setPending(false);
    }
  }

  if (!challengeId) {
    return (
      <form onSubmit={requestCode}>
        <label>
          Phone number
          <input
            name="phoneNumber"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            autoComplete="tel"
            required
          />
        </label>
        <button type="submit" disabled={pending}>
          Send code
        </button>
        {error ? <p>{error}</p> : null}
      </form>
    );
  }

  return (
    <form onSubmit={verifyCode}>
      <label>
        One-time code
        <input
          name="code"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          inputMode="numeric"
          autoComplete="one-time-code"
          required
        />
      </label>
      <button type="submit" disabled={pending}>
        Verify
      </button>
      {error ? <p>{error}</p> : null}
    </form>
  );
}
