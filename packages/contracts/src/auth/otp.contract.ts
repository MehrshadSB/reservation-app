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

export type ResendOtpRequest = {
  challengeId: string;
};
