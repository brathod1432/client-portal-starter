import { create } from "zustand";

import type { Invoice } from "@/lib/types";
import { invoices as seed } from "@/lib/mock/invoices";

interface InvoiceState {
  invoices: Invoice[];
  pay: (id: string) => void;
}

export const useInvoiceStore = create<InvoiceState>((set) => ({
  invoices: seed,
  pay(id) {
    set((state) => ({
      invoices: state.invoices.map((inv) =>
        inv.id === id
          ? {
              ...inv,
              status: "paid",
              paidDate: new Date().toISOString().slice(0, 10),
            }
          : inv,
      ),
    }));
  },
}));
