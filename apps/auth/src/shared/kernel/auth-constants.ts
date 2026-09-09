export const AUTH_CONSTANTS = {
  otpTtlMs: 5 * 60 * 1000,
  resendCooldownMs: 60 * 1000,
  maxVerifyAttempts: 5,
  maxResends: 5,
  otpPerPhoneMax: 3,
  otpPerPhoneWindowMs: 15 * 60 * 1000,
  otpPerIpMax: 10,
  otpPerIpWindowMs: 15 * 60 * 1000,
  accessTtlMs: 15 * 60 * 1000,
  refreshTtlMs: 7 * 24 * 60 * 60 * 1000,
  loginContextTtlMs: 10 * 60 * 1000,
  introspectionCacheMs: 30 * 1000,
} as const;
