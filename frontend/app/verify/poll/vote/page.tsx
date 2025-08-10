"use client"
import { List, ListItem, Radio, Button } from "flowbite-react";
import 'sweetalert2/dist/sweetalert2.min.css'
import usePolleeStore from "../../../../store/polleeStore";
import { useState, useEffect} from "react";
import { noSelectionWarning, voteError } from "../../../../utils/alerts";
import { useRouter } from "next/navigation";

const VotePage = () => {
    const [selection, setSelection] = useState(null)
    const { castVote, token, poll , refreshPoll} = usePolleeStore()
    const [displayPoll] = useState(poll ? poll: { id: null, name: null, description: "", choices: [] })
    const router = useRouter()

    const voteButton = async () => {
        if (token) {
            if (selection) {
                const result = await castVote(selection, token)
                if (result) {
                    router.push("/verify/poll/vote/success");
                }
                else if (!result) {
                    voteError()
                }
            }
        } else {
            noSelectionWarning()
            voteError()
        }
    }

    interface Choice {
        id: number;
        name: string;
        description: string | null;
    }

    useEffect(()=>{
        refreshPoll()
    },[refreshPoll])

    return (

        <div className="flex flex-col items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
            <div className="bg-white w-full max-w-md sm:max-w-lg md:max-w-2xl rounded-xl shadow-md p-6 space-y-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-center text-black">{displayPoll.name}</h1>
                <h2 className="text-md sm:text-lg text-center text-gray-500">{displayPoll.description}</h2>

                <List className="list-none space-y-4">
                    {displayPoll?.choices?.map((choice: Choice) => (
                        <ListItem
                            key={choice.id}
                            className="flex items-start sm:items-center justify-between bg-stone-50 hover:bg-stone-100 rounded-lg border border-gray-300 px-4 py-4 gap-4"
                        >
                            <div className="flex items-start justify-center sm:items-center gap-3">
                                <Radio
                                    checked={choice.id === selection}
                                    value={choice.id.toString()}
                                    onChange={() => setSelection(choice.id)}
                                    className="mt-1 sm:mt-0 h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 cursor-pointer"
                                    color="yellow"

                                />
                                <div className="flex flex-col">
                                    <div className="text-lg sm:text-xl font-bold text-black break-words">{choice.name}</div>
                                    <p className="text-sm sm:text-base text-gray-500 break-words">{choice.description}</p>
                                </div>
                            </div>
                        </ListItem>
                    ))}
                </List>
            </div>

            <Button
                onClick={() => voteButton()}
                className="mt-6 w-full max-w-md sm:max-w-sm text-base sm:text-lg py-2"
            >
                Submit
            </Button>
        </div>


    )
}

export default VotePage
