import { AlertType } from "../enum"

export type Stat = {
  title: string
  value: number
  change: string
  changeDescription?: string //optional, used for cases like "N/A" or when no change is applicable
  description?: string
  icon: React.ElementType
  color: string
  valueColor?: string //optional, used to override the default value color
}

export type Alert = {
  type: AlertType
  message: string
  duration?: string //TODO: make this a number or date type
  time?: string
}