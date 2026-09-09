import { Injectable } from "@nestjs/common";
import {
  loadAuthRuntimeConfig,
  type AuthRuntimeConfig,
} from "./platform-env";

@Injectable()
export class AuthConfigService {
  readonly values: AuthRuntimeConfig = loadAuthRuntimeConfig();
}
