
import { create } from "zustand";


const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL

interface PollState {
    error: string | null;
    isLoading: boolean;
    poll: Poll;
    polls: Poll[];
    activation: boolean;
    createPoll: (data:PollCreate, token:string) => Promise<boolean>;
    updatePoll: (data:PollData, token:string) => Promise<void>;
    deletePoll: (id:number, token:string) => Promise<void>;
    getPolls: (token:string) => Promise<void>;
    getPoll: (data:number, token:string) => Promise<void>;
    activatePoll: (data:number, token:string) => Promise<void>;
    getResults: (data:number, token:string) => Promise<Result[]>;
    clearError: () => void;

}
interface Poll {
  name: string | null;
  id: number | null;
  user_id: number | null;
  created_at: string | null;
  publish_date: string | null;
  closing_date: string | null;
  time_limit_days: number | null;
  status: string | null;
  description: string | null;
}
interface PollData {
  id: number | null;
  name: string | null;
  time_limit_days: number | null;
  description: string | null;
}

interface PollCreate {
  name: string | null;
  time_limit_days: number | null;
  description: string | null;
}

interface Result {
    choice_id: number;
    label: string;
    description: string;
    value: number;

}



type ErrorResponse = { error: string }

const usePollStore = create<PollState>((set) => ({
    error: null,
    isLoading: false,
    polls: [],
    activation: false,
    poll: {name:null,id: null,user_id: null,created_at: null,publish_date:  null, closing_date:  null,time_limit_days: null,status: null,description:null},

    createPoll: async (data: PollCreate, token: string) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${backendURL}poll/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData || 'Login failed')
            }

            const poll = await res.json()
            set({ isLoading: false, poll: poll})
            return true

        } catch (err: unknown) {
            let message = 'Unexpected error'
            if (err instanceof Error) {
                message = err.message
            } else if (typeof err === 'object' && err !== null && 'error' in err) {
                message = (err as ErrorResponse).error
            }
            set({ error: message, isLoading: false })
            return false
        }
    },


    updatePoll: async (data: PollData, token: string) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${backendURL}poll/update/${data.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData || 'Login failed')
            }

            const poll = await res.json()
            set({ isLoading: false, poll: poll})

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

    deletePoll: async (pollId:number, token: string) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${backendURL}poll/delete/${pollId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData || 'Login failed')
            }
         set((state)=>({isLoading:false, polls: state.polls.filter((c)=>
            c.id !== pollId)}))
        } catch (err: unknown) {
            let message = 'Unexpected error'
            if (err instanceof Error) {
                message = err.message
            }
            set({ error: message, isLoading: false })
        }
    },

    getPolls: async ( token: string) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${backendURL}polls`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData || 'Login failed')
            }
            const polls = await res.json()
            set({ isLoading: false, polls: polls })
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

     getPoll: async ( pollId:number, token: string) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${backendURL}poll/${pollId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData || 'Login failed')
            }
            const poll = await res.json()
            const {choices, ...info} = poll
            set({ isLoading: false, poll: info })
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

    activatePoll: async (pollId:number, token:string) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${backendURL}poll/activate/${pollId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            })

             if (!res.ok) {
                const errorData = await res.json();
                let errorMessage = "Activation failed";
                if (typeof errorData === "string") {
                    errorMessage = errorData;}
                else if (Array.isArray(errorData)) {
                    errorMessage = `Failed to send emails: ${errorData.join(", ")}`;
                   }
                throw new Error(errorMessage);
            }
            set({ isLoading: false, activation: true})
        } catch (err: unknown) {
            set({ error: err instanceof Error ? err.message : "Unexpected error", isLoading: false });

        }


    },


         getResults: async ( pollId:number, token: string) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${backendURL}poll/results/${pollId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData || 'Login failed')
            }
            const results = await res.json()
            set({ isLoading: false})
            return results
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

    clearActivation: () => {
        set({ error: null, activation:false })
    },
}));

export default usePollStore;
