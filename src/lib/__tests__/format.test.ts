import { formatCurrency, formatFileSize, initials } from "@/lib/format";

describe("format helpers", () => {
  it("formats currency with no decimals", () => {
    expect(formatCurrency(18400)).toBe("$18,400");
    expect(formatCurrency(1000000, "USD")).toBe("$1,000,000");
  });

  it("formats file sizes", () => {
    expect(formatFileSize(512)).toBe("512 KB");
    expect(formatFileSize(2048)).toBe("2.0 MB");
  });

  it("derives initials from a name", () => {
    expect(initials("Ava Thompson")).toBe("AT");
    expect(initials("Devon")).toBe("D");
    expect(initials("Priya Kumari Nair")).toBe("PK");
  });
});
