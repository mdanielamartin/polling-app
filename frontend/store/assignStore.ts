import { create } from "zustand";


const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL

interface AssigmentState {
    error: string | null;
    isLoading: boolean;
    assignments: Assignment[];
    activation: boolean;
    addAssignments: (ids: number[], token: string, pollId: number) => Promise<void>;
    removeAssignments: (ids: number[], token: string, pollId: number) => Promise<void>;
    getAssignments: (token: string, pollId: number) => Promise<void>;
    resendAssignments: (tids: number[], pollId: number, tz: string, token: string) => Promise<string>;
    clearError: () => void;
    clearActivation: () => void;

}


interface Assignment {
    id: number
    poll_id: number
    pollee_id: number
    email: string
    status: boolean
}
type ErrorResponse = { error: string }

const useAssignStore = create<AssigmentState>((set) => ({
    error: null,
    isLoading: false,
    assignments: [],
    activation: false,

    addAssignments: async (contactIds: number[], token: string, poll_id: number) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${backendURL}pollee/assignment/${poll_id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(contactIds),
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData || 'Login failed')
            }

            const data = await res.json()
            const assigned = data.assigned
            set((state) => ({ isLoading: false, assignments: [...state.assignments, ...assigned] }))
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

    removeAssignments: async (contactIds: number[], token: string, pollId: number) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${backendURL}pollee/assignment/${pollId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(contactIds),
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData || 'Login failed')
            }

            const data = await res.json()
            const deletions = new Set(data.deleted_ids)

            set((state) => ({
                isLoading: false, assignments: state.assignments.filter((c) =>
                    !deletions.has(c.id))
            }))

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

    getAssignments: async (token: string, pollId: number) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${backendURL}pollee/assignment/${pollId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData || 'Login failed')
            }
            const pollees = await res.json()
            set({ isLoading: false, assignments: pollees })
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

    resendAssignments: async (ids: number[], pollId: number, tz: string, token: string) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${backendURL}poll/resend/${pollId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ "assignments": ids, "user_timezone": tz })
            })

            if (!res.ok) {
                const errorData = await res.json();
                let errorMessage = "Activation failed";
                if (typeof errorData === "string") {
                    errorMessage = errorData;
                }
                else if (Array.isArray(errorData)) {
                    errorMessage = `Failed to send emails: ${errorData.join(", ")}`;
                }
                throw new Error(errorMessage);
            }
            set({ isLoading: false, activation: true })
            return "All emails sent"
        } catch (err: unknown) {
            set({ error: err instanceof Error ? err.message : "Unexpected error", isLoading: false, activation: true });
            return err instanceof Error ? err.message : "Unexpected error"

        }


    },
    clearError: () => {
        set({ error: null })
    },
    clearActivation: () => {
        set({ activation: false })
    },
}));

export default useAssignStore;
