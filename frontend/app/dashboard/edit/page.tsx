"use client"
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button, ButtonGroup, Spinner} from "flowbite-react";
import usePollStore from "../../../store/pollStore";
import useUserStore from "../../../store/userStore";
import { useEffect} from "react";
import { useRouter } from "next/navigation";


const EditPolls = () => {

const {polls, getPolls, deletePoll, error, activatePoll, isLoading} = usePollStore()
const token = useUserStore.getState().token
const router = useRouter()
const launchPoll = async (id:number)=>{
  const localNow = new Date();
  const utcNow = localNow.toISOString()
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  await activatePoll(id,utcNow,timezone,token)
}

const editButton = (id:number)=>{
  router.push(`edit/poll/${id}`)

}
useEffect(()=>{
  const onLoad = async() => {
    await getPolls(token)
  }
  onLoad()

},[])

if (isLoading && polls.length == 0){
  return (
     <div className="flex min-h-screen w-full  items-center justify-center m-2">
      <div>
        <Spinner/>
        <h4>Loading Polls...</h4>
      </div>
     </div>
  )
}

if (!isLoading && polls.length == 0){
  return (
     <div className="flex min-h-screen w-full  items-center justify-center m-2">
      <div>
        <h4>No polls available for editing</h4>
      </div>
     </div>
  )
}

return (
<div className="flex flex-col min-h-screen w-full items-center px-2 py-4">
  <div className="w-full max-w-7xl overflow-x-auto shadow-md rounded-md">
    <Table className="min-w-max">
      <TableHead className="bg-gray-500">
        <TableRow className="bg-gray-100">
          <TableHeadCell className="font-bold text-center text-lg text-black normal-case whitespace-nowrap">
            Name
          </TableHeadCell>
          <TableHeadCell className="font-bold text-center text-lg text-black normal-case whitespace-nowrap">
            Creation Date
          </TableHeadCell>
          <TableHeadCell className="font-bold text-center text-lg text-black normal-case whitespace-nowrap">
            Duration
          </TableHeadCell>
          <TableHeadCell>
            <span className="sr-only">Actions</span>
          </TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody className="divide-y">
        {polls?.map((poll) => (
          <TableRow key={poll.id} className="bg-gray-50 hover:bg-gray-200">
            <TableCell className="text-center text-md text-black whitespace-nowrap">
              {poll.name}
            </TableCell>
            <TableCell className="text-center text-gray-800 whitespace-nowrap">
              {poll.created_at}
            </TableCell>
            <TableCell className="text-center text-gray-800 whitespace-nowrap">
              {poll.time_limit_days}
            </TableCell>
            <TableCell className="text-center whitespace-nowrap">
              <ButtonGroup>
                <Button
                  color="red"
                  onClick={async () => {
                    await deletePoll(poll.id, token);
                  }}
                >
                  Delete
                </Button>
                <Button color="alternative" onClick={() => launchPoll(poll.id)}>
                  Launch
                </Button>
                <Button color="alternative" onClick={()=>editButton(poll.id)}>Edit</Button>
              </ButtonGroup>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
</div>
  );
}

export default EditPolls
