import { generatePdfReport } from "@/lib/pdf/generate-pdf";
import { reportTemplates } from "@/lib/pdf/report-templates";

export const usePdfReport = () => {
  type ReportType = keyof typeof reportTemplates;

  const createReport = async (type: ReportType, data: Record<string, unknown>[]): Promise<void> => {
    const template = reportTemplates[type];
    if (!template) {
      console.error(`No template found for report type: ${type}`);
      return;
    }

    // Normalize headers to array of objects with header/key for compatibility
    let headers: { header: string; key: string }[] = [];
    if (Array.isArray(template.headers) && typeof template.headers[0] === "object") {
      headers = template.headers as { header: string; key: string }[];
    } else if (Array.isArray(template.headers)) {
      // Try to infer keys from the first data row if available
      const firstRow = data[0] || {};
      headers = (template.headers as string[]).map((header: string) => {
        // Try to find a matching key in the data row (case-insensitive)
        const key = Object.keys(firstRow).find(
          (k) => k.toLowerCase() === header.replace(/\s+/g, "").toLowerCase() ||
                 k.toLowerCase() === header.toLowerCase().replace(/[^a-z0-9]/g, "")
        ) || header;
        return { header, key };
      });
    }

    generatePdfReport({
      title: template.title,
      headers,
      rows: data,
      fileName: template.fileName,
    });
  };

  return { createReport };
};
