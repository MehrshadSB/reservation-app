import type { AuthenticatedUser } from "../identity/authenticated-identity.contract.js";

export type RequestOtpRequest = {
  phoneNumber: string;
};

export type RequestOtpResponse = {
  challengeId: string;
  expiresAt: string;
  resendAvailableAt: string;
};

export type VerifyOtpRequest = {
  challengeId: string;
  code: string;
};

export type VerifyOtpResponse = {
  user: AuthenticatedUser;
  expiresAt: string;
};

export type ResendOtpRequest = {
  challengeId: string;
};
