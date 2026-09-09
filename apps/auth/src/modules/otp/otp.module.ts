import { Module } from "@nestjs/common";
import { RequestOtpUseCase } from "./application/request-otp.use-case";
import { ResendOtpUseCase } from "./application/resend-otp.use-case";
import { VerifyOtpUseCase } from "./application/verify-otp.use-case";
import { OTP_DELIVERY, OTP_REPOSITORY } from "./application/ports/tokens";
import { ConsoleOtpProvider } from "./infrastructure/console-otp.provider";
import { InMemoryOtpRepository } from "./infrastructure/in-memory-otp.repository";

@Module({
  providers: [
    RequestOtpUseCase,
    ResendOtpUseCase,
    VerifyOtpUseCase,
    { provide: OTP_REPOSITORY, useClass: InMemoryOtpRepository },
    { provide: OTP_DELIVERY, useClass: ConsoleOtpProvider },
  ],
  exports: [RequestOtpUseCase, ResendOtpUseCase, VerifyOtpUseCase],
})
export class OtpModule {}
