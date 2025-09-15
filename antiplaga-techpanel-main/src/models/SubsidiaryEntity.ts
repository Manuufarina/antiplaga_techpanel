import { ClientEntity } from "./ClientEntity"

export interface SubsidiaryEntity {
  id: number,
  name: string,
  address?: string,
  client: ClientEntity,
  phone?: string,
  state: string,
}