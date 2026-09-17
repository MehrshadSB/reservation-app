import { Injectable, Logger } from "@nestjs/common";
import type { OtpDeliveryPort } from "../../application/ports/otp-delivery.port";
import { IdentityConfigService } from "../identity-config.service";

@Injectable()
export class ConsoleOtpProvider implements OtpDeliveryPort {
  private readonly logger = new Logger(ConsoleOtpProvider.name);
  private readonly lastByPhone = new Map<string, string>();

  constructor(private readonly config: IdentityConfigService) {}

  async send(input: { phoneNumber: string; code: string }): Promise<void> {
    if (this.config.values.nodeEnv === "production") {
      throw new Error("SMS OTP provider is not configured");
    }
    this.lastByPhone.set(input.phoneNumber, input.code);
    this.logger.warn(
      `OTP for ${input.phoneNumber}: ${input.code} (development mock)`,
    );
  }

  peek(phoneNumber: string): string | undefined {
    return this.lastByPhone.get(phoneNumber);
  }
}
