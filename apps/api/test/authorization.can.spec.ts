import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { can, PERMISSIONS } from "@repo/contracts/authorization";
import { isResourceInTenant } from "../src/shared/kernel/tenant-context";

describe("can()", () => {
  it("grants OWNER booking.confirm", () => {
    assert.equal(
      can({
        isPlatformAdmin: false,
        role: "OWNER",
        permission: PERMISSIONS.BOOKING_CONFIRM,
      }),
      true,
    );
  });

  it("grants ADMIN booking.confirm", () => {
    assert.equal(
      can({
        isPlatformAdmin: false,
        role: "ADMIN",
        permission: PERMISSIONS.BOOKING_CONFIRM,
      }),
      true,
    );
  });

  it("denies MEMBER booking.confirm", () => {
    assert.equal(
      can({
        isPlatformAdmin: false,
        role: "MEMBER",
        permission: PERMISSIONS.BOOKING_CONFIRM,
      }),
      false,
    );
  });

  it("allows a platform admin without an organization role", () => {
    assert.equal(
      can({
        isPlatformAdmin: true,
        permission: PERMISSIONS.ORGANIZATION_UPDATE,
      }),
      true,
    );
  });

  it("denies when there is no membership and the user is not a platform admin", () => {
    assert.equal(
      can({
        isPlatformAdmin: false,
        permission: PERMISSIONS.BOOKING_READ,
      }),
      false,
    );
  });
});

describe("tenant isolation", () => {
  it("accepts a resource in the current organization", () => {
    assert.equal(
      isResourceInTenant("org-a", { organizationId: "org-a" }),
      true,
    );
  });

  it("rejects a resource from another organization", () => {
    assert.equal(
      isResourceInTenant("org-b", { organizationId: "org-a" }),
      false,
    );
  });
});
