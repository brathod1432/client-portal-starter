import { can, canAll, canAny, ROLE_PERMISSIONS, PERMISSIONS } from "@/lib/rbac";

describe("RBAC", () => {
  it("admin holds every permission", () => {
    expect(ROLE_PERMISSIONS.admin).toHaveLength(PERMISSIONS.length);
    for (const p of PERMISSIONS) {
      expect(can("admin", p)).toBe(true);
    }
  });

  it("clients cannot manage other users", () => {
    expect(can("client", "users:manage")).toBe(false);
    expect(can("client", "settings:manage:org")).toBe(false);
  });

  it("clients can create tickets but not assign them", () => {
    expect(can("client", "tickets:create")).toBe(true);
    expect(can("client", "tickets:assign")).toBe(false);
  });

  it("agents can assign tickets and upload documents", () => {
    expect(can("agent", "tickets:assign")).toBe(true);
    expect(can("agent", "documents:upload")).toBe(true);
  });

  it("only managers/admins can view org-wide activity", () => {
    expect(can("manager", "activity:view:all")).toBe(true);
    expect(can("admin", "activity:view:all")).toBe(true);
    expect(can("agent", "activity:view:all")).toBe(false);
    expect(can("client", "activity:view:all")).toBe(false);
  });

  it("denies by default for undefined role", () => {
    expect(can(undefined, "dashboard:view")).toBe(false);
  });

  it("canAny / canAll behave correctly", () => {
    expect(canAny("client", ["users:manage", "tickets:create"])).toBe(true);
    expect(canAll("client", ["users:manage", "tickets:create"])).toBe(false);
    expect(canAll("admin", ["users:manage", "tickets:create"])).toBe(true);
  });
});
