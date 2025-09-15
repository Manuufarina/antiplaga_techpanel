import { LocationEntity } from "./LocationEntity"
import BugCaptureDataEntity from "./BugCaptureDataEntity"

export interface BugDataEntity {
  visit_id?: number,
  location: LocationEntity,
  bugsCaptured: BugCaptureDataEntity[]
}