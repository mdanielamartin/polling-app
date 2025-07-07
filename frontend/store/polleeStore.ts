
import { create } from "zustand";


const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL

interface PolleeState {
    error: string | null;
    isLoading: boolean;
    poll: Poll;
    complete: boolean;
    status:number;
    getPoll: (token:string) => Promise<void>;
    castVote: (data:Vote, token:string) => Promise<boolean>;
    clearError: () => void;

}

interface Poll {
  id: number | null;
  name:string | null;
  description: string | null;
  choices: Choice[] | []
}

interface Choice {
    id: number;
    name: string ;
    description: string | null;
}

interface Vote {
    choice_id: number | null;
}






const usePolleeStore = create<PolleeState>((set) => ({
    error: null,
    isLoading: false,
    complete: false,
    poll: {id:null,name:null,description:null, choices:[]},
    status: null,

    getPoll: async ( token: string) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${backendURL}poll/vote`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            })

            if (!res.ok) {
                const status = res.status
                set({  isLoading: false, status: status })
                throw new Error("Invalid Token")
            }

            const poll = await res.json()
            sessionStorage.setItem('vote', token)
            sessionStorage.setItem("poll",JSON.stringify(poll))
            set({isLoading: false, poll: poll, status:200})
        } catch (err) {
            set({  isLoading: false})
        }
    },


    castVote: async (data: Vote, token: string) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${backendURL}pollee/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({choice_id:data}),
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData || 'Login failed')
            }

            set({isLoading:false, complete:true})
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

}));

export default usePolleeStore;
