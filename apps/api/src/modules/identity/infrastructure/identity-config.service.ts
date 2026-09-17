import { Injectable } from "@nestjs/common";
import {
  loadAuthRuntimeConfig,
  type AuthRuntimeConfig,
} from "../../../shared/platform-env";

@Injectable()
export class IdentityConfigService {
  readonly values: AuthRuntimeConfig = loadAuthRuntimeConfig();
}
