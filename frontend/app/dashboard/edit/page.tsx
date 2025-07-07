"use client"
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button, ButtonGroup} from "flowbite-react";
import usePollStore from "../../../store/pollStore";
import useUserStore from "../../../store/userStore";
import { useEffect} from "react";
import { showPollError } from "../../../utils/alerts";

const EditPolls = () => {

const {polls, getPolls, deletePoll, error, activatePoll} = usePollStore()
const token = useUserStore.getState().token

const launchPoll = async (id:number)=>{

  await activatePoll(id,token)
}

useEffect(()=>{
  const onLoad = async() => {
    await getPolls(token)
  }
  onLoad()

},[])

return (
    <div className="flex min-h-screen w-full justify-center m-2">
      <Table className="w-full shadow-md rounded-md">
        <TableHead className="py-3 bg-gray-500">
          <TableRow className="py-3 bg-gray-100">
            <TableHeadCell className="font-bold text-center text-lg text-black normal-case">Name</TableHeadCell>
            <TableHeadCell className="font-bold text-center text-lg text-black normal-case">Creation Date</TableHeadCell>
            <TableHeadCell className="font-bold text-center text-lg text-black normal-case">Durantion</TableHeadCell>
            <TableHeadCell>
              <span className="sr-only">Actions</span>
            </TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {polls?.map((poll)=>(
          <TableRow key={poll.id} className="bg-gray-50 hover:bg-gray-200">
            <TableCell className="whitespace-nowrap font-normal text-md text-center font-medium text-black ">
              {poll.name}
            </TableCell>
            <TableCell className="text-center text-dark">{poll.created_at}</TableCell>
            <TableCell className="text-center text-dark">{poll.time_limit_days}</TableCell>
            <TableCell className="text-center">    <ButtonGroup>
            <Button color="red" onClick={async ()=>{await deletePoll(poll.id,token)}}>Delete</Button>
            <Button color="alternative" onClick={()=>launchPoll(poll.id)}>Launch</Button>
            <Button color="alternative">Edit</Button>
    </ButtonGroup></TableCell>
          </TableRow>

          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default EditPolls
