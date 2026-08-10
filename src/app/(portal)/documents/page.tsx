"use client";

import * as React from "react";
import {
  Download,
  FileText,
  FileSpreadsheet,
  FileArchive,
  FileImage,
  History,
  Lock,
  Search,
  Upload,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import type { DocumentCategory, PortalDocument } from "@/lib/types";
import { useDocumentStore } from "@/stores/document-store";
import { useAuthStore } from "@/stores/auth-store";
import { useActivityStore } from "@/stores/activity-store";
import { usePermissions } from "@/hooks/use-permissions";
import { cn } from "@/lib/utils";
import { downloadPlaceholder } from "@/lib/download";
import { formatDate, formatFileSize } from "@/lib/format";
import { ROLE_LABELS } from "@/lib/rbac";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Can } from "@/components/rbac/can";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const typeIcons = {
  pdf: FileText,
  docx: FileText,
  xlsx: FileSpreadsheet,
  png: FileImage,
  zip: FileArchive,
} as const;

const categories: (DocumentCategory | "all")[] = [
  "all",
  "contracts",
  "invoices",
  "reports",
  "deliverables",
  "compliance",
];

export default function DocumentsPage() {
  const documents = useDocumentStore((s) => s.documents);
  const upload = useDocumentStore((s) => s.upload);
  const user = useAuthStore((s) => s.user);
  const log = useActivityStore((s) => s.log);
  const { role, can } = usePermissions();

  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<DocumentCategory | "all">(
    "all",
  );
  const [versionsFor, setVersionsFor] = React.useState<PortalDocument | null>(
    null,
  );

  // Enforce document-level access as a real backend would (row-level security).
  const visible = documents.filter(
    (d) => !role || d.accessRoles.includes(role),
  );

  const filtered = visible.filter((d) => {
    const matchesQuery = d.name.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "all" || d.category === category;
    return matchesQuery && matchesCategory;
  });

  function handleDownload(doc: PortalDocument) {
    downloadPlaceholder(doc.name, `Category: ${doc.category}`);
    log("document_download", user?.name ?? "You", doc.name, {
      category: doc.category,
    });
    toast.success(`Downloading ${doc.name}`);
  }

  function handleUpload() {
    const name = `Uploaded File ${new Date().toISOString().slice(0, 10)}.pdf`;
    upload({
      name,
      category: "deliverables",
      owner: user?.name ?? "You",
      sizeKb: 320,
    });
    log("document_upload", user?.name ?? "You", name);
    toast.success("File uploaded");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description="Securely access contracts, reports and deliverables."
        actions={
          <Can permission="documents:upload">
            <Button onClick={handleUpload}>
              <Upload /> Upload
            </Button>
          </Can>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="group"
          aria-label="Filter documents by category"
          className="bg-muted flex flex-wrap gap-1 rounded-lg p-1"
        >
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={cn(
                "focus-visible:ring-ring rounded-md px-3 py-1 text-sm font-medium capitalize transition-colors focus-visible:ring-2 focus-visible:outline-none",
                category === c
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="relative max-w-xs">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents…"
            aria-label="Search documents"
            className="pl-9"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents found"
          description="Try a different category or search term."
        />
      ) : (
        <div className="grid gap-3">
          {filtered.map((doc) => {
            const Icon = typeIcons[doc.type];
            return (
              <Card key={doc.id}>
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="bg-muted text-muted-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-medium">{doc.name}</p>
                        {doc.confidential ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-amber-600">
                                <Lock className="h-3.5 w-3.5" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>Confidential</TooltipContent>
                          </Tooltip>
                        ) : null}
                      </div>
                      <p className="text-muted-foreground truncate text-xs">
                        {doc.owner} · {formatDate(doc.updatedAt)} ·{" "}
                        {formatFileSize(doc.sizeKb)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {doc.category}
                    </Badge>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Badge variant="secondary" className="gap-1">
                            <ShieldCheck className="h-3 w-3" />
                            {doc.accessRoles.length} roles
                          </Badge>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        Visible to:{" "}
                        {doc.accessRoles.map((r) => ROLE_LABELS[r]).join(", ")}
                      </TooltipContent>
                    </Tooltip>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Version history for ${doc.name}`}
                      onClick={() => setVersionsFor(doc)}
                    >
                      <History className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!can("documents:download")}
                      onClick={() => handleDownload(doc)}
                    >
                      <Download className="h-4 w-4" /> Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog
        open={!!versionsFor}
        onOpenChange={(open) => !open && setVersionsFor(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Version history</DialogTitle>
            <DialogDescription>{versionsFor?.name}</DialogDescription>
          </DialogHeader>
          <ol className="space-y-3">
            {versionsFor?.versions.map((v) => (
              <li
                key={v.version}
                className="flex items-start justify-between gap-3 rounded-md border p-3"
              >
                <div>
                  <p className="text-sm font-medium">{v.version}</p>
                  <p className="text-muted-foreground text-xs">
                    {v.uploadedBy} · {formatDate(v.uploadedAt)} ·{" "}
                    {formatFileSize(v.sizeKb)}
                  </p>
                  {v.note ? (
                    <p className="text-muted-foreground mt-1 text-xs">
                      {v.note}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </DialogContent>
      </Dialog>
    </div>
  );
}
