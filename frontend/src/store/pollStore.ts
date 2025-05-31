import { create } from "zustand";

interface PollState {
  selectedPollId: number | null; // Stores the selected poll
  setSelectedPoll: (id: number) => void; // Function to update poll ID
}

const usePollStore = create<PollState>((set) => ({
  selectedPollId: null, // Default poll selection is none
  setSelectedPoll: (id) => set((state) => ({ ...state, selectedPollId: id })),


}));

export default usePollStore;
