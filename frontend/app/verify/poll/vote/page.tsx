"use client"
import { List, ListItem, Radio, Button } from "flowbite-react";

import 'sweetalert2/dist/sweetalert2.min.css'
import usePolleeStore from "../../../../store/polleeStore";
import { useState } from "react";
import { noSelectionWarning, voteError } from "../../../../utils/alerts";
import { useRouter } from "next/navigation";



const VotePage = () => {
    const [selection,setSelection] = useState(null)
    const {castVote} = usePolleeStore()
    const pollInfo = sessionStorage.getItem("poll")
    const [displayPoll] = useState(pollInfo? JSON.parse(pollInfo):{id:null,name:null, description:"",choices:[]})
    const router = useRouter()

    const voteButton = async ()=> {
        const token = sessionStorage.getItem("vote")

        if (token){
            if (selection)
            {

                const result = await castVote(selection,token)
                if (result){
                       router.push("/verify/poll/vote/success");
                      }
                else if (!result){

                    voteError()

                }
                }

            }else{
            noSelectionWarning()

        voteError()


    }}

    interface Choice {
    id: number;
    name: string ;
    description: string | null;
        }
    return (

        <div className="flex flex-col justify-center">
            <div className="bg-white h-auto w-full rounded-xl mx-auto  my-4 justify-center">
                <h1>{displayPoll.name}</h1>
                <h2>{displayPoll.description}</h2>
                <List className="list-none">
                    {displayPoll?.choices?.map((choice:Choice) => (
                            <ListItem key={choice.id} className="text-2xl place-content-between items-center text-bold text-black bg-stone-50 hover:bg-stone-100 rounded-lg border pl-4 py-5 border flex">

                                <div className="flex">
                                    <Radio checked={choice.id === selection} value={choice.id.toString()} onChange={()=>setSelection(choice.id)}/>
                                    <div className="flex flex-col">
                                        <div className="text-2xl font-bold text-black">{choice.name}</div>
                                        <p className="text-gray-400 text-md">{choice.description}</p>
                                    </div>
                                </div>
                            </ListItem>
                    ))}
                </List>
            </div>
            <Button onClick={()=>voteButton()}>Submit</Button>
        </div>
    )
}

export default VotePage
