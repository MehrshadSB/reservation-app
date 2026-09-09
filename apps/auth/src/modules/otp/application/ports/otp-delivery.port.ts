export type OtpDeliveryPort = {
  send(input: { phoneNumber: string; code: string }): Promise<void>;
};
