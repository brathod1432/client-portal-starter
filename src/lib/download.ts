/**
 * Client-side download helpers. In this mock, "downloads" generate a small
 * placeholder file in the browser so the action is real and demoable. With a
 * backend, these would be replaced by short-lived signed URLs (see
 * docs/architecture.md → Document storage).
 */

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Download a plaintext placeholder representing a portal document. */
export function downloadPlaceholder(filename: string, description: string) {
  const contents =
    `Client Portal Starter — demo download\n` +
    `======================================\n\n` +
    `File: ${filename}\n` +
    `${description}\n\n` +
    `This is a placeholder generated in the browser. In production this action\n` +
    `resolves to a short-lived, access-controlled signed URL from object storage.\n`;
  triggerDownload(
    new Blob([contents], { type: "text/plain" }),
    `${filename}.txt`,
  );
}

/** Escape and export an array of records to CSV, then download it. */
export function downloadCsv<T extends Record<string, unknown>>(
  rows: T[],
  filename: string,
) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(",")),
  ].join("\n");
  triggerDownload(new Blob([csv], { type: "text/csv" }), filename);
}
