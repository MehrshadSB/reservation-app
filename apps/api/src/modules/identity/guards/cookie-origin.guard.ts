import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import type { Request } from "express";
import { IdentityConfigService } from "../infrastructure/identity-config.service";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

@Injectable()
export class CookieOriginGuard implements CanActivate {
  constructor(private readonly config: IdentityConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    if (SAFE_METHODS.has(request.method)) {
      return true;
    }
    if (request.headers.authorization?.startsWith("Bearer ")) {
      return true;
    }
    if (!request.headers.cookie) {
      return true;
    }

    const origin = request.headers.origin ?? request.headers.referer;
    if (!origin) {
      return false;
    }
    try {
      const originUrl = new URL(origin);
      return this.config.values.allowedRedirectOrigins.includes(
        originUrl.origin,
      );
    } catch {
      return false;
    }
  }
}
