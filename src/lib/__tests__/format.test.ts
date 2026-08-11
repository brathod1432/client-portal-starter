import {
  formatCurrency,
  formatDate,
  formatFileSize,
  initials,
} from "@/lib/format";

describe("format helpers", () => {
  it("formats currency with no decimals", () => {
    expect(formatCurrency(18400)).toBe("$18,400");
    expect(formatCurrency(1000000, "USD")).toBe("$1,000,000");
  });

  it("respects an explicit locale and currency", () => {
    // Indian grouping (lakh) with USD.
    expect(formatCurrency(1000000, "USD", "en-IN")).toBe("$10,00,000");
    // Euro in German locale places the symbol after the amount.
    expect(formatCurrency(1000, "EUR", "de-DE")).toContain("€");
  });

  it("formats dates per locale", () => {
    // Midday UTC keeps the calendar day stable across runner timezones.
    // en-GB uses day-month order.
    expect(formatDate("2025-08-15T12:00:00.000Z", "en-GB")).toMatch(
      /15 Aug 2025/,
    );
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
