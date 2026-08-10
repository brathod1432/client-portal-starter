import { useAuthStore } from "@/stores/auth-store";
import { DEMO_PASSWORD } from "@/lib/mock/users";

beforeEach(() => {
  useAuthStore.setState({
    user: null,
    failedAttempts: 0,
    lockedUntil: null,
  });
});

describe("auth store", () => {
  it("signs in a valid demo account and clears attempt counters", async () => {
    const result = await useAuthStore
      .getState()
      .login("client@acme.example", DEMO_PASSWORD);
    expect(result.ok).toBe(true);
    expect(useAuthStore.getState().user?.role).toBe("client");
    expect(useAuthStore.getState().failedAttempts).toBe(0);
  });

  it("returns a generic error for bad credentials (no enumeration)", async () => {
    const result = await useAuthStore
      .getState()
      .login("client@acme.example", "wrong-password");
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/invalid email or password/i);
  });

  it("locks the account after repeated failures (rate limiting)", async () => {
    for (let i = 0; i < 5; i++) {
      await useAuthStore.getState().login("client@acme.example", "nope");
    }
    expect(useAuthStore.getState().lockedUntil).toBeTruthy();

    const locked = await useAuthStore
      .getState()
      .login("client@acme.example", DEMO_PASSWORD);
    expect(locked.ok).toBe(false);
    expect(locked.error).toMatch(/too many attempts/i);
  }, 15000);

  it("changePassword rejects an incorrect current password", async () => {
    const result = await useAuthStore
      .getState()
      .changePassword("not-the-password", "BrandNewPass1!");
    expect(result.ok).toBe(false);
  });

  it("changePassword succeeds with the correct current password", async () => {
    const result = await useAuthStore
      .getState()
      .changePassword(DEMO_PASSWORD, "BrandNewPass1!");
    expect(result.ok).toBe(true);
  });
});
