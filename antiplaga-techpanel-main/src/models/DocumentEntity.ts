export type DocumentType = "photo" | "receipt"

export interface DocumentEntity {
  base64image: string,
  type: DocumentType,
}