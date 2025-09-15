import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import UserEntity from '../models/UserEntity'

interface AuthState {
    user: UserEntity | null
    token: string
}

interface AuthActions {
    saveAuthToken: (token: string) => void
    saveAuthUser: (user: UserEntity) => void
    logout: () => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            token: "",

            saveAuthToken: (token: string) => set({ token }),
            saveAuthUser: (user: UserEntity) => set({ user }),
            logout: () => set({ user: null, token: "" }),
        }),
        {
            name: 'auth',
        }
    )
)
