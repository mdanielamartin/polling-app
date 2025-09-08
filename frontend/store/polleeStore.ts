
import { create } from "zustand";
import { BACKEND_URL } from "./config";


interface PolleeState {
    error: string | null;
    isLoading: boolean;
    poll: Poll;
    complete: boolean;
    status:number;
    token:string;
    getPoll: (token:string) => Promise<void>;
    castVote: (data:Vote, token:string) => Promise<boolean>;
    clearError: () => void;
    refreshPoll: () => void;

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
    token:null,

    getPoll: async ( token: string) => {
        
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${BACKEND_URL}poll/vote`, {
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
            set({isLoading: false, poll: poll, status:200, token:token})
        } catch (err) {
            set({  isLoading: false})
        }
    },


    castVote: async (data: Vote, token: string) => {
        
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`${BACKEND_URL}pollee/vote`, {
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

    refreshPoll: () => {

        const token = sessionStorage.getItem("vote")
        const poll = JSON.parse(sessionStorage.getItem("poll"))

        if (!token || !poll){
             set({isLoading:false, complete:false})
        }
        set({isLoading: false, poll: poll, status:200, token:token})
    }

}));

export default usePolleeStore;
