export type OtpChallengeStatus =
  | "pending"
  | "verified"
  | "locked"
  | "expired";

export type OtpChallenge = {
  id: string;
  phoneNumber: string;
  codeHash: string;
  expiresAt: Date;
  attemptCount: number;
  resendCount: number;
  status: OtpChallengeStatus;
  createdAt: Date;
  lastSentAt: Date;
};
