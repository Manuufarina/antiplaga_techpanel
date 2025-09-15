// import { create } from 'zustand'
// import Antiplaga from '../api/Antiplaga'
// import { SpreadsheetEntity } from '../models/SpreadsheetEntity'
//
// interface SpreadsheetsState {
//     list: SpreadsheetEntity[]
// }
//
// interface SpreadsheetsActions {
//     getSpreadsheets: (subsidiary_id: number) => Promise<void>
// }
//
// type SpreadsheetsStore = SpreadsheetsState & SpreadsheetsActions
//
// export const useSpreadsheetsStore = create<SpreadsheetsStore>((set) => ({
//     list: [],
//
//     getSpreadsheets: async (subsidiary_id: number) => {
//         const antiplaga = new Antiplaga()
//         try {
//             const result = await antiplaga.getSpreadsheets(subsidiary_id)
//
//             if (result.isSuccess) {
//                 set({ list: result.getValue()! })
//             } else {
//                 throw new Error("Error al obtener las hojas de cálculo")
//             }
//         } catch (error) {
//             console.error("Error en getSpreadsheets:", error)
//         }
//     },
// }))




import { create } from 'zustand'
import Antiplaga from '../api/Antiplaga'
import { SpreadsheetEntity } from '../models/SpreadsheetEntity'

interface SpreadsheetsState {
    list: SpreadsheetEntity[]
    loading: boolean
    error: string | null
    lastSubsidiaryId?: number
}

interface SpreadsheetsActions {
    getSpreadsheets: (subsidiary_id: number) => Promise<void>
}

export const useSpreadsheetsStore = create<
    SpreadsheetsState & SpreadsheetsActions
>((set, get) => ({
    list: [],
    loading: false,
    error: null,
    lastSubsidiaryId: undefined,

    getSpreadsheets: async (subsidiary_id: number) => {
        if (get().lastSubsidiaryId === subsidiary_id) {
            return
        }

        set({ loading: true, error: null })
        const antiplaga = new Antiplaga()
        try {
            const result = await antiplaga.getSpreadsheets(subsidiary_id)
            if (result.isSuccess) {
                set({
                    list: result.getValue()!,
                    loading: false,
                    lastSubsidiaryId: subsidiary_id,
                })
            } else {
                throw new Error('Error al obtener las hojas de cálculo')
            }
        } catch (error: any) {
            console.error('Error en getSpreadsheets:', error)
            set({
                loading: false,
                error: error.message || 'Error desconocido',
            })
        }
    },
}))
