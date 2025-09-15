import { ProductEntity } from "./ProductEntity"

export interface ProductAndDoseEntity {
  product: ProductEntity,
  dose?: string,
  lotNumber?: string
}