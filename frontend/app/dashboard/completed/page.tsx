
"use client"
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button } from "flowbite-react";
import usePollStore from "../../../store/pollStore";
import useUserStore from "../../../store/userStore";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

const CompletePolls = () => {
    const { getPolls, polls } = usePollStore()
    const token = useUserStore.getState().token
    const router = useRouter()

    useEffect(() => {
        const onLoad = async () => {
            await getPolls(token)
        }
        onLoad()

    }, [getPolls, token])

    const completePolls = useMemo(() => {
        if (polls) {

            return polls
        }

        return []


    }, [polls])
    return (
        <div className="flex min-h-screen w-full justify-center px-4 py-2">
            <div className="w-full overflow-x-auto max-w-6xl">
                <Table className="w-full shadow-md rounded-md table-auto">
                    <TableHead>
                        <TableRow>
                            <TableHeadCell className="font-bold text-center text-sm sm:text-base text-black bg-gray-200">
                                Name
                            </TableHeadCell>
                            <TableHeadCell className="font-bold text-center text-sm sm:text-base text-black bg-gray-200">
                                Creation Date
                            </TableHeadCell>
                            <TableHeadCell className="font-bold text-center text-sm sm:text-base text-black bg-gray-200">
                                Duration
                            </TableHeadCell>
                            <TableHeadCell className="font-bold text-center text-sm sm:text-base text-black bg-gray-200">
                                Launch Date
                            </TableHeadCell>
                            <TableHeadCell className="font-bold text-center text-sm sm:text-base text-black bg-gray-200">
                                Expiration Date
                            </TableHeadCell>
                            <TableHeadCell className="font-bold text-center text-sm sm:text-base text-black bg-gray-200">
                                <span className="sr-only">Actions</span>
                            </TableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="divide-y">
                        {completePolls?.map((poll) => (
                            <TableRow key={poll.id} className="bg-white hover:bg-gray-100 transition-colors">
                                <TableCell className="whitespace-nowrap text-center text-sm sm:text-base text-black">
                                    {poll.name}
                                </TableCell>
                                <TableCell className="text-center text-gray-700 text-sm sm:text-base">
                                    {poll.created_at}
                                </TableCell>
                                <TableCell className="text-center text-gray-700 text-sm sm:text-base">
                                    {poll.time_limit_days}
                                </TableCell>
                                <TableCell className="text-center text-gray-700 text-sm sm:text-base">
                                    {poll.publish_date}
                                </TableCell>
                                <TableCell className="text-center text-gray-700 text-sm sm:text-base">
                                    {poll.closing_date}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Button onClick={()=>router.push( `/dashboard/completed/poll/${poll.id}`)} color="alternative">View Results</Button>
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
