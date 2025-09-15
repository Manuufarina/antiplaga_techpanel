import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Environment } from '../api/Antiplaga'

interface CommonState {
    environment: Environment
    globalLoader: boolean
}

interface CommonActions {
    showLoader: (show: boolean) => void
    changeEnvironment: (environment: Environment) => void
}

type CommonStore = CommonState & CommonActions

export const useCommonStore = create<CommonStore>()(
    persist(
        (set) => ({

            environment: "prod" as Environment,
            globalLoader: false,

            showLoader: (show: boolean) => set({ globalLoader: show }),
            changeEnvironment: (environment: Environment) => set({ environment }),
        }),
        {
            name: 'common',
        }
    )
)
