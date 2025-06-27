
import { create } from "zustand";


const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL

interface ListState {
    error: string | null;
    isLoading: boolean;
    lists: List[];
    createList: (data:ListData, token:string) => Promise<void>;
    updateList: (data:ListData,token:string) => Promise<void>;
    deleteList: (listId:number, token:string) => Promise<void>;
    addToList: (data:number[],listId:number, token:string) => Promise<void>;
    deleteFromList: (data:number[],listId:number, token:string) => Promise<void>;
    getLists: (token:string) => Promise<void>;
    clearError: () => void;

}

interface List {
  id: number | null;
  name: string | null;
  pollees: Pollee[]
}

interface Pollee {
    id: number;
    email: string;

}

interface ListData {
    id:string | null;
    name: string | null;
}

type ErrorResponse = { error: string }

const useListStore = create<ListState>((set) => ({
    error: null,
    isLoading: false,
    lists: [],

    createList: async (data: ListData, token: string) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${backendURL}list/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(data),
            })
            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData || 'Login failed')
            }
            const list = await res.json()
            set((state) => ({isLoading: false, lists: [...state.lists,list]}))
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


    updateList: async ( data:ListData,token: string) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${backendURL}list/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData || 'Login failed')
            }

            const updated_list = await res.json()

            set((state)=>({isLoading:false, lists: state.lists.map((c)=>
            c.id === updated_list.id ? {...c,...updated_list}:c)}))

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

    deleteList: async (listId: number, token: string) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${backendURL}list/delete/${listId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData || 'Login failed')
            }

            set((state)=>({isLoading:false, lists: state.lists.filter((c)=>
            c.id !== listId)}))

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

    addToList: async(idList:number[],listId:number,token:string) =>
        {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${backendURL}list/${listId}/add/pollee`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(idList),
            })
            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData || 'Login failed')
            }
            const updated_list = await res.json()
            set((state)=>({isLoading:false, lists: state.lists.map((c)=>
            c.id === updated_list.id ? {...c,...updated_list}:c)}))

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
        deleteFromList: async(idList:number[],listId:number,token:string) =>
        {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${backendURL}list/${listId}/delete/pollee`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(idList),
            })
            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData || 'Login failed')
            }
            const updated_list = await res.json()

            set((state)=>({isLoading:false, lists: state.lists.map((c)=>
            c.id === updated_list.id ? {...c,...updated_list}:c)}))

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

    getLists: async ( token: string) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${backendURL}lists`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData || 'Login failed')
            }
            const lists = await res.json()
            set({ isLoading: false, lists: lists })
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

export default useListStore;
