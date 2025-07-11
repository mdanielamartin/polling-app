
"use client"
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button } from "flowbite-react";
import usePollStore from "../../../store/pollStore";
import useUserStore from "../../../store/userStore";
import { useEffect, useMemo} from "react";

const CompletePolls = () => {
    const {getPolls,polls} = usePollStore()
    const token = useUserStore.getState().token
    useEffect(()=>{
      const onLoad = async() => {
        await getPolls(token)
      }
      onLoad()

    },[getPolls,token])

    const completePolls = useMemo(()=>{
        if (polls){

            return polls
        }

        return []


    },[polls])
    return (
        <div className="flex min-h-screen w-full justify-center m-2">
            <div className="overflow-x-auto min-w-8/10 max-w-9/10">
                <Table className="w-full shadow-md  rounded-md ">
                    <TableHead className="py-3 ">
                        <TableRow className="py-3 ">
                            <TableHeadCell className="font-bold text-center text-lg text-black normal-case bg-gray-200 ">Name</TableHeadCell>
                            <TableHeadCell className="font-bold text-center text-lg text-black normal-case bg-gray-200">Creation Date</TableHeadCell>
                            <TableHeadCell className="font-bold text-center text-lg text-black normal-case bg-gray-200">Durantion</TableHeadCell>
                            <TableHeadCell className="font-bold text-center text-lg text-black normal-case bg-gray-200">Launch Date</TableHeadCell>
                            <TableHeadCell className="font-bold text-center text-lg text-black normal-case bg-gray-200">Expiration Date</TableHeadCell>
                            <TableHeadCell className="font-bold text-center text-lg text-black normal-case bg-gray-200">
                                <span className="sr-only">Actions</span>
                            </TableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="divide-y">


                        {completePolls?.map((poll)=>(

                        <TableRow key={poll.id} className="bg-white hover:bg-gray-100">
                            <TableCell className="whitespace-nowrap font-normal text-md text-center font-medium text-black ">
                                {poll.name}
                            </TableCell>
                            <TableCell className="text-center text-dark">{poll.created_at}</TableCell>
                            <TableCell className="text-center text-dark">{poll.time_limit_days}</TableCell>
                            <TableCell className="text-center text-dark">{poll.publish_date}</TableCell>
                            <TableCell className="text-center text-dark">{poll.closing_date}</TableCell>
                            <TableCell className="text-center">
                                <Button color="alternative">View Results</Button>
                            </TableCell>
                        </TableRow>



                        ))}
                    </TableBody>
                </Table>

            </div>
        </div>
    );
}

export default CompletePolls
