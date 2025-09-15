export type SpreadsheetType = "bug" | "rodent"

export interface SpreadsheetEntity {
  id: number,
  name: string,
  subsidiary_id: number,
  type: SpreadsheetType
}