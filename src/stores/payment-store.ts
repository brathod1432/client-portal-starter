import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PaymentMethod {
  id: string;
  brand: "visa" | "mastercard" | "amex";
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

interface PaymentState {
  methods: PaymentMethod[];
  autoPay: boolean;
  addCard: (input: {
    brand: PaymentMethod["brand"];
    last4: string;
    expMonth: number;
    expYear: number;
  }) => void;
  removeCard: (id: string) => void;
  setDefault: (id: string) => void;
  setAutoPay: (on: boolean) => void;
}

const seed: PaymentMethod[] = [
  {
    id: "pm_1",
    brand: "visa",
    last4: "4242",
    expMonth: 8,
    expYear: 2028,
    isDefault: true,
  },
];

/**
 * Demo payment methods. NEVER store real card data client-side — production
 * uses a PCI-compliant provider (e.g. Stripe) that returns a token/last4 only;
 * the PAN never touches your servers. See docs/security-implementation.md.
 */
export const usePaymentStore = create<PaymentState>()(
  persist(
    (set) => ({
      methods: seed,
      autoPay: false,

      addCard(input) {
        set((state) => {
          const first = state.methods.length === 0;
          const card: PaymentMethod = {
            id: `pm_${Date.now()}`,
            ...input,
            isDefault: first,
          };
          return { methods: [...state.methods, card] };
        });
      },

      removeCard(id) {
        set((state) => {
          const remaining = state.methods.filter((m) => m.id !== id);
          // Ensure one default remains.
          if (remaining.length && !remaining.some((m) => m.isDefault)) {
            remaining[0] = { ...remaining[0], isDefault: true };
          }
          return { methods: remaining };
        });
      },

      setDefault(id) {
        set((state) => ({
          methods: state.methods.map((m) => ({
            ...m,
            isDefault: m.id === id,
          })),
        }));
      },

      setAutoPay(on) {
        set({ autoPay: on });
      },
    }),
    { name: "cps.payments" },
  ),
);
