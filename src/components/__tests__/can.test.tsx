import { render, screen } from "@testing-library/react";

import { Can } from "@/components/rbac/can";
import { useAuthStore } from "@/stores/auth-store";
import { demoUsers } from "@/lib/mock/users";

function setRole(role: "client" | "agent" | "manager" | "admin") {
  const user = demoUsers.find((u) => u.role === role)!;
  useAuthStore.setState({ user, hydrated: true });
}

describe("Can (RBAC UI gate)", () => {
  it("hides content the role lacks permission for", () => {
    setRole("client");
    render(
      <Can permission="users:manage">
        <span>Admin only</span>
      </Can>,
    );
    expect(screen.queryByText("Admin only")).not.toBeInTheDocument();
  });

  it("shows content the role is permitted to see", () => {
    setRole("admin");
    render(
      <Can permission="users:manage">
        <span>Admin only</span>
      </Can>,
    );
    expect(screen.getByText("Admin only")).toBeInTheDocument();
  });

  it("renders the fallback when denied", () => {
    setRole("client");
    render(
      <Can permission="invoices:manage" fallback={<span>No access</span>}>
        <span>Manage billing</span>
      </Can>,
    );
    expect(screen.getByText("No access")).toBeInTheDocument();
  });
});
