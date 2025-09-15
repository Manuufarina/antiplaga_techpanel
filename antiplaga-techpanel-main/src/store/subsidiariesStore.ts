import { create } from 'zustand'
import Antiplaga from '../api/Antiplaga'
import { SubsidiaryEntity } from '../models/SubsidiaryEntity'

interface SubsidiariesState {
    list: SubsidiaryEntity[]
    loading: boolean
    error: string | null
}

interface SubsidiariesActions {
    getSubsidiaries: () => Promise<void>
}

type SubsidiariesStore = SubsidiariesState & SubsidiariesActions

export const useSubsidiariesStore = create<SubsidiariesStore>((set) => ({
    list: [],
    loading: false,
    error: null,

    getSubsidiaries: async () => {
        set({ loading: true, error: null })
        const antiplaga = new Antiplaga()
        try {
            const result = await antiplaga.getSubsidiaries()
            if (result.isSuccess) {
                set({ list: result.getValue()!, loading: false })
            } else {
                throw new Error("Error al obtener las subsidiarias")
            }
        } catch (error: any) {
            console.error("Error en getSubsidiaries:", error)
            set({ loading: false, error: error.message || 'Error desconocido' })
        }
    },
}))
