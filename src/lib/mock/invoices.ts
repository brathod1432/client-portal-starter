import type { Invoice } from "@/lib/types";

export const invoices: Invoice[] = [
  {
    id: "inv_202508",
    number: "INV-2025-08",
    client: "Acme Retail Group",
    amount: 18400,
    currency: "USD",
    status: "pending",
    issuedDate: "2025-08-01",
    dueDate: "2025-08-31",
    lineItems: [
      {
        description: "Managed Support — August",
        quantity: 1,
        unitPrice: 12000,
      },
      {
        description: "SD-WAN circuits (120 sites)",
        quantity: 1,
        unitPrice: 6400,
      },
    ],
  },
  {
    id: "inv_202507",
    number: "INV-2025-07",
    client: "Acme Retail Group",
    amount: 18400,
    currency: "USD",
    status: "paid",
    issuedDate: "2025-07-01",
    dueDate: "2025-07-31",
    paidDate: "2025-07-18",
    lineItems: [
      { description: "Managed Support — July", quantity: 1, unitPrice: 12000 },
      {
        description: "SD-WAN circuits (120 sites)",
        quantity: 1,
        unitPrice: 6400,
      },
    ],
  },
  {
    id: "inv_202506",
    number: "INV-2025-06",
    client: "Acme Retail Group",
    amount: 24900,
    currency: "USD",
    status: "overdue",
    issuedDate: "2025-06-01",
    dueDate: "2025-06-30",
    lineItems: [
      { description: "Managed Support — June", quantity: 1, unitPrice: 12000 },
      {
        description: "Data migration milestone 2",
        quantity: 1,
        unitPrice: 12900,
      },
    ],
  },
  {
    id: "inv_202505",
    number: "INV-2025-05",
    client: "Acme Retail Group",
    amount: 18400,
    currency: "USD",
    status: "paid",
    issuedDate: "2025-05-01",
    dueDate: "2025-05-31",
    paidDate: "2025-05-20",
    lineItems: [
      { description: "Managed Support — May", quantity: 1, unitPrice: 12000 },
      {
        description: "SD-WAN circuits (120 sites)",
        quantity: 1,
        unitPrice: 6400,
      },
    ],
  },
  {
    id: "inv_202509",
    number: "INV-2025-09",
    client: "Acme Retail Group",
    amount: 12000,
    currency: "USD",
    status: "draft",
    issuedDate: "2025-09-01",
    dueDate: "2025-09-30",
    lineItems: [
      {
        description: "Managed Support — September",
        quantity: 1,
        unitPrice: 12000,
      },
    ],
  },
];
