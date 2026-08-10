import { create } from "zustand";

import type { PortalDocument, Role } from "@/lib/types";
import { documents as seed } from "@/lib/mock/documents";

interface UploadInput {
  name: string;
  category: PortalDocument["category"];
  owner: string;
  sizeKb: number;
}

interface DocumentState {
  documents: PortalDocument[];
  upload: (input: UploadInput) => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  documents: seed,
  upload({ name, category, owner, sizeKb }) {
    const now = new Date().toISOString();
    const accessRoles: Role[] = ["client", "agent", "manager", "admin"];
    const ext = name.split(".").pop()?.toLowerCase();
    const type = (
      ["pdf", "docx", "xlsx", "png", "zip"].includes(ext ?? "") ? ext : "pdf"
    ) as PortalDocument["type"];

    const doc: PortalDocument = {
      id: `doc_${Date.now()}`,
      name,
      type,
      category,
      sizeKb,
      owner,
      updatedAt: now,
      confidential: false,
      accessRoles,
      versions: [
        { version: "v1.0", uploadedBy: owner, uploadedAt: now, sizeKb },
      ],
    };
    set((state) => ({ documents: [doc, ...state.documents] }));
  },
}));
