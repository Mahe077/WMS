import { ReportStatus } from "../enum"

export type Report = {
  id: string
  name: string
  type: string // e.g., "inventory", "sales", "orders"
  generated: string // ISO date string
  status: ReportStatus // e.g., "completed", "processing", "failed"
  size: number // size in Kilobytes
  downloadUrl?: string // URL to download the report file
  parameters?: Record<string, unknown> // optional parameters used to generate the report
  customFields?: Record<string, unknown> // optional, for any additional report-specific data
}
