
import { create } from "zustand";




const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL


interface UserState {
    token: string | null;
    error: string | null;
    isLoading: boolean;
    login: (data:loginFormat) => Promise<boolean>;
    signup: (data:loginFormat) => Promise<boolean>
    clearError: () => void
    logout: () => void
}
type loginFormat = {email:string,password:string}


const useUserStore = create<UserState>((set) => ({
    token: typeof window !== 'undefined' ? sessionStorage.getItem('token') : null,
    error: null,
    isLoading: false,

    login: async (loginData) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${backendURL}user/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            })
            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData || 'Login failed')
            }
            const userData = await res.json()
            const token = userData.access_token
            sessionStorage.setItem("token", token)
            set({ isLoading: false, token: token })
            return true
        } catch (err: unknown) {
            let message = 'Unexpected error'
            if (err instanceof Error) {
                message = err.message
            }
            set({ error: message, isLoading: false })
            return false
        }
    },
    clearError: () => {
        set({ error: null })
    },

    logout: () => {
        set({token:null})
        sessionStorage.clear()
    },

    signup: async (registerData) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${backendURL}user/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerData),
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData || 'Login failed')
            }
            set({isLoading: false})
            return true
        } catch (err: unknown) {
            let message = 'Unexpected error'
            if (err instanceof Error) {
                message = err.message
            }
            set({ error: message, isLoading: false })
            return false
        }
    },



}));

export default useUserStore;
