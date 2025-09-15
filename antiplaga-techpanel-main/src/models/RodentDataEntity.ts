import { TrapEntity } from "./TrapEntity"
import { LocationEntity } from "./LocationEntity"

export interface RodentDataEntity {
  visit_id?: number,
  location: LocationEntity
  trap?: TrapEntity
}