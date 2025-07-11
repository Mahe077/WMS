import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;

import type { TDocumentDefinitions, Content, TableCell } from "pdfmake/interfaces";
import { logoBase64 } from "../../../public/logo-base64";


interface PdfHeader {
  header: string;
  key: string;
}

interface GeneratePdfReportParams {
  title: string;
  headers: PdfHeader[];
  rows: Record<string, unknown>[];
  fileName: string;
}

export function generatePdfReport({ title, headers, rows, fileName }: GeneratePdfReportParams) {
  const docDefinition: TDocumentDefinitions = {
    content: [
      {
        image: logoBase64,
        width: 120, // adjust as needed
        alignment: 'center',
        margin: [0, 0, 0, 10]
      } as Content,
      { text: title, style: 'header', alignment: 'center', margin: [0, 0, 0, 20] } as Content,
      {
        table: {
          headerRows: 1,
          widths: headers.map(() => '*'),
          body: [
            headers.map(h => h.header) as TableCell[],
            ...rows.map(row => headers.map(h => row[h.key] ?? '') as TableCell[]),
          ],
        },
        layout: 'lightHorizontalLines'
      } as Content
    ],
    styles: {
      header: { fontSize: 18, bold: true },
    },
    defaultStyle: { fontSize: 10 },
    pageOrientation: 'landscape',
  };

  pdfMake.createPdf(docDefinition).download(`${fileName}.pdf`);
}
