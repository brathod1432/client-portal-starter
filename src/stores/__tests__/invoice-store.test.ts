import { useInvoiceStore } from "@/stores/invoice-store";

describe("invoice store", () => {
  it("marks an invoice paid and records the paid date", () => {
    const target = useInvoiceStore
      .getState()
      .invoices.find((i) => i.status !== "paid")!;

    useInvoiceStore.getState().pay(target.id);

    const updated = useInvoiceStore
      .getState()
      .invoices.find((i) => i.id === target.id)!;
    expect(updated.status).toBe("paid");
    expect(updated.paidDate).toBeTruthy();
  });
});
