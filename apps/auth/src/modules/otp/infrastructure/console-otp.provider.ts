import { Injectable, Logger } from "@nestjs/common";
import { AuthConfigService } from "../../../shared/config/auth-config.service";
import type { OtpDeliveryPort } from "../application/ports/otp-delivery.port";

@Injectable()
export class ConsoleOtpProvider implements OtpDeliveryPort {
  private readonly logger = new Logger(ConsoleOtpProvider.name);

  constructor(private readonly config: AuthConfigService) {}

  async send(input: { phoneNumber: string; code: string }): Promise<void> {
    if (this.config.values.nodeEnv === "production") {
      throw new Error("SMS OTP provider is not configured");
    }
    this.logger.warn(
      `OTP for ${input.phoneNumber}: ${input.code} (development mock)`,
    );
  }
}
