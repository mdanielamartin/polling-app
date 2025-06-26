
import { create } from "zustand";


const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL

interface ChoiceState {
    error: string | null;
    isLoading: boolean;
    choices: Choice[];
    addChoice: (data:ChoiceData, token:string, poll_id:number) => Promise<void>;
    updateChoice: (data:Choice, token:string, poll_id:number) => Promise<void>;
    deleteChoice: (choice_id:number, token:string, poll_id:number) => Promise<void>;
    getChoices: (poll_id:number,token:string) => Promise<void>;
    clearError: () => void;

}

interface Choice {
  id: number | null;
  name: string | null;
  description: string | null;
}

interface ChoiceData {
  name: string | null;
  description: string | null;
}

type ErrorResponse = { error: string }

const useChoiceStore = create<ChoiceState>((set) => ({
    error: null,
    isLoading: false,
    choices: [],

    addChoice: async (data: ChoiceData, token: string, poll_id:number) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${backendURL}poll/${poll_id}/add/choice`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData || 'Login failed')
            }

            const choice = await res.json()
            set((state) => ({isLoading: false, choices: [...state.choices,choice]}))
        } catch (err: unknown) {
            let message = 'Unexpected error'
            if (err instanceof Error) {
                message = err.message
            } else if (typeof err === 'object' && err !== null && 'error' in err) {
                message = (err as ErrorResponse).error
            }
            set({ error: message, isLoading: false })
        }
    },


    updateChoice: async (data: Choice, token: string, poll_id:number) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${backendURL}poll/${poll_id}/update/choice`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData || 'Login failed')
            }

            const updated_choice = await res.json()

            set((state)=>({isLoading:false, choices: state.choices.map((c)=>
            c.id === updated_choice.id ? {...c,...updated_choice}:c)}))

        } catch (err: unknown) {
            let message = 'Unexpected error'
            if (err instanceof Error) {
                message = err.message
            } else if (typeof err === 'object' && err !== null && 'error' in err) {
                message = (err as ErrorResponse).error
            }
            set({ error: message, isLoading: false })
        }
    },

    deleteChoice: async (choice_id: number, token: string, poll_id:number) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${backendURL}poll/${poll_id}/delete/choice/${choice_id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData || 'Login failed')
            }

            set((state)=>({isLoading:false, choices: state.choices.filter((c)=>
            c.id !== choice_id)}))

        } catch (err: unknown) {
            let message = 'Unexpected error'
            if (err instanceof Error) {
                message = err.message
            } else if (typeof err === 'object' && err !== null && 'error' in err) {
                message = (err as ErrorResponse).error
            }
            set({ error: message, isLoading: false })
        }
    },

    getChoices: async ( poll_id: number,token: string) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${backendURL}poll/${poll_id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData || 'Login failed')
            }
            const poll_data = await res.json()
            set({ isLoading: false, choices: poll_data.choices })
        } catch (err: unknown) {
            let message = 'Unexpected error'
            if (err instanceof Error) {
                message = err.message
            } else if (typeof err === 'object' && err !== null && 'error' in err) {
                message = (err as ErrorResponse).error
            }
            set({ error: message, isLoading: false })
        }
    },
    clearError: () => {
        set({ error: null })
    },
}));

export default useChoiceStore;
