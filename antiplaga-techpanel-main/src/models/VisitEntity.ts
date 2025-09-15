import { RodentDataEntity } from "./RodentDataEntity"
import { BugDataEntity } from "./BugDataEntity"
import { TechnicalEntity } from "./TechnicalEntity"
import { SpreadsheetEntity } from "./SpreadsheetEntity"
import { ProductEntity } from "./ProductEntity"
import { DocumentEntity } from "./DocumentEntity"

export interface VisitEntity {
  id: number,
  date: string,
  responsible: string,
  spreadsheet: SpreadsheetEntity,
  no_visit: boolean,
  technical: TechnicalEntity,
  rodent_data: RodentDataEntity[],
  bug_data: BugDataEntity[],
  created_at: string,
  comments: string,
  documents: DocumentEntity[],
  products: ProductEntity[],
  number: string
}