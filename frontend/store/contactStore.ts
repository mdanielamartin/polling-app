
import { create } from "zustand";


const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL

interface ContactState {
    error: string | null;
    isLoading: boolean;
    contacts: Contact[];
    addContact: (data:ContactData, token:string) => Promise<void>;
    updateContact: (data:Contact, token:string) => Promise<void>;
    deleteContacts: (ids: number[], token:string) => Promise<void>;
    getContacts: (token:string) => Promise<void>;
    clearError: () => void;

}

interface Contact {
  id: number | null;
  email: string | null;
}

interface ContactData {
    email: string | null;
}

type ErrorResponse = { error: string }

const useContactStore = create<ContactState>((set) => ({
    error: null,
    isLoading: false,
    contacts: [],

    addContact: async (data: ContactData, token: string) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${backendURL}pollee/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData || 'Login failed')
            }

            const contact = await res.json()
            set((state) => ({isLoading: false, contacts: [...state.contacts,contact]}))
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


    updateContact: async (data: Contact, token: string) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${backendURL}pollee/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData || 'Login failed')
            }

            const updated_contact = await res.json()

            set((state)=>({isLoading:false, contacts: state.contacts.map((c)=>
            c.id === updated_contact.id ? {...c,...updated_contact}:c)}))

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

    deleteContacts: async (contact_ids: number[], token: string) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${backendURL}pollee/delete`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(contact_ids),
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData || 'Login failed')
            }

            const data = await res.json()
            const deletions = new Set(data.deleted_ids)

            set((state)=>({isLoading:false, contacts: state.contacts.filter((c)=>
            !deletions.has(c.id) )}))

        } catch (err: unknown) {
            let message = 'Unexpected error'
            if (err instanceof Error) {
                message = err.message
            }
            set({ error: message, isLoading: false })
        }
    },

    getContacts: async ( token: string) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${backendURL}pollees`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData || 'Login failed')
            }
            const contacts = await res.json()
            set({ isLoading: false, contacts: contacts })
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

export default useContactStore;
