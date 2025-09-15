export interface SectorEntity {
    id: number;
    name: string;
}

export interface LocationEntity {
    id: number;
    name: string;
    number: number;
    sector?: SectorEntity;
}