
import { create } from "zustand";




interface UserState {
    token: string | null;
    error: string | null;
    isLoading: boolean;
    login: (data: loginFormat) => Promise<boolean>;
    signup: (data: loginFormat) => Promise<boolean>;
    getUser: () => Promise<user>;
    clearError: () => void
    logout: () => void
    passwordChangeRequest: (data:email) => Promise<boolean>
    validateRequestToken: (token:string) => Promise<boolean>
    resetPassword: (data:password) => Promise<boolean>
}
type loginFormat = { email: string, password: string }

type user = { email: string, id: number }
type email = { email: string }
type password = { password: string }
const useUserStore = create<UserState>((set, get) => ({
    token: typeof window !== 'undefined' ? sessionStorage.getItem('token') : null,
    error: null,
    isLoading: false,

    login: async (loginData) => {
        const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL
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
        set({ token: null })
        sessionStorage.clear()
    },

    signup: async (registerData) => {
        const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${backendURL}user/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({email:registerData.email, password:registerData.password}),
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData || 'Login failed')
            }
            set({ isLoading: false })
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

    getUser: async () => {
        const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL
        set({ isLoading: true, error: null })
        const token = get().token
        try {
            const res = await fetch(`${backendURL}user`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData || 'Login failed')
            }
            const user = await res.json()

            set({ isLoading: false })
            return user
        } catch (err: unknown) {
            let message = 'Unexpected error'
            if (err instanceof Error) {
                message = err.message
                set({ error: message, isLoading: false })
            }
            return {email:"Connection error", id:null}
        }
    },


    passwordChangeRequest: async (data:email) => {
        const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${backendURL}reset-password/send-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData || 'Request failed')
            }
            set({ isLoading: false })
            return true
        } catch (err: unknown) {
            let message = 'Unexpected error'
            if (err instanceof Error) {
                message = err.message
                set({ error: message, isLoading: false })
            }
            return true
        }
    },


    validateRequestToken: async (token: string) => {
        const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${backendURL}reset-password`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData || 'Request failed')
            }
            set({ isLoading: false })
            sessionStorage.setItem("reset-password", token)
            return true
        } catch (err: unknown) {
            let message = 'Unexpected error'
            if (err instanceof Error) {
                message = err.message
                set({ error: message, isLoading: false })
            }
            return false
        }
    },


    resetPassword: async (data:password) => {
        const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL
        set({ isLoading: true, error: null })
        const token = sessionStorage.getItem("reset-password")
        try {
            const res = await fetch(`${backendURL}reset-password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json',  "Authorization": `Bearer ${token}` },
                body: JSON.stringify(data)
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData || 'Request failed')
            }
            set({ isLoading: false })
            return true
        } catch (err: unknown) {
            let message = 'Unexpected error'
            if (err instanceof Error) {
                message = err.message
                set({ error: message, isLoading: false })
            }
            return false
        }
    }



}));

export default useUserStore;
