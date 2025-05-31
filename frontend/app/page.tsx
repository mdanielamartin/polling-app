'use client'

import usePollStore from "../src/store/pollStore";

const PollComponent = () => {
  const { selectedPollId, setSelectedPoll} = usePollStore();

  return (
    <div>
      <p>Selected Poll ID: {selectedPollId ?? "None"}</p>
      <button onClick={() => setSelectedPoll(42)}>Select Poll #42</button>

    </div>
  );
};

export default PollComponent;
