import { render } from "@testing-library/react";
import { axe } from "jest-axe";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { FolderKanban } from "lucide-react";

describe("accessibility (jest-axe)", () => {
  it("Button has no violations", async () => {
    const { container } = render(<Button>Save changes</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("PageHeader has no violations", async () => {
    const { container } = render(
      <PageHeader title="Projects" description="All engagements" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("StatCard has no violations", async () => {
    const { container } = render(
      <StatCard label="Open tickets" value={4} icon={FolderKanban} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
