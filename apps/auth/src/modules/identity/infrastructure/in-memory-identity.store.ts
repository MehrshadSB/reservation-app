import { Injectable } from "@nestjs/common";
import type { Identity, SystemUser } from "../domain/identity";

@Injectable()
export class InMemoryIdentityStore {
  readonly identities = new Map<string, Identity>();
  readonly identitiesByPhone = new Map<string, string>();
  readonly users = new Map<string, SystemUser>();
  readonly usersByIdentity = new Map<string, string>();
}
