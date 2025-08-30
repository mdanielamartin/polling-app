"use client"
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button} from "flowbite-react";
import usePollStore from "../../../store/pollStore";
import useUserStore from "../../../store/userStore";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toLocalTime } from "../../../utils/timezones";
import LoadingSpinner from "../../../components/LoadingSpinner";

const LivePolls = () => {

    const { polls, getPolls, isLoading } = usePollStore()
    const token = useUserStore.getState().token
    const router = useRouter()

    useEffect(() => {
        const onLoad = async () => {
            await getPolls(token)
        }
        onLoad()

    }, [])

    const livePolls = useMemo(() => {
        if (polls) {
            const live = polls.filter(poll => poll.status == "active")
            return live
        }

        return []


    }, [polls])

    if (isLoading && livePolls.length == 0) {
        return (
           <LoadingSpinner/>
        )
    }

    if (!isLoading && livePolls.length == 0) {
        return (
            <div className="flex min-h-screen w-full  items-center justify-center m-2">
                <div>
                    <h4>No active polls</h4>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen w-full items-center px-2 py-4">
            <div className="w-full max-w-7xl overflow-x-auto shadow-lg rounded-lg border border-gray-300">
                <Table className="w-full shadow-md rounded-md table-auto">
                    <TableHead>
                        <TableRow>
                            {["Name", "Creation Date", "Publish Date", "Closing Date", "Duration"].map((heading) => (
                                <TableHeadCell
                                    key={heading}
                                    className="font-bold text-center text-sm sm:text-base text-black bg-gray-200"
                                >
                                    {heading}
                                </TableHeadCell>
                            ))}
                            <TableHeadCell className="bg-gray-200">
                                <span className="sr-only bg-gray-200">Actions</span>
                            </TableHeadCell>
                        </TableRow>
                    </TableHead>

                    <TableBody className="divide-y divide-gray-300">
                        {livePolls?.map((poll) => (
                            <TableRow key={poll.id} className="bg-white hover:bg-gray-100 transition-colors">
                                <TableCell className="whitespace-nowrap text-center text-sm sm:text-base text-black">
                                    {poll.name}
                                </TableCell>
                                <TableCell className="text-center text-gray-700 text-sm sm:text-base">
                                    {toLocalTime(poll.created_at)}
                                </TableCell>
                                <TableCell className="text-center text-gray-700 text-sm sm:text-base">
                                    {toLocalTime(poll.publish_date)}
                                </TableCell>
                                <TableCell className="text-center text-gray-700 text-sm sm:text-base">
                                    {toLocalTime(poll.closing_date)}
                                </TableCell>
                                <TableCell className="text-center text-gray-700 text-sm sm:text-base">
                                    {poll.time_limit_days}
                                </TableCell>
                                <TableCell className="text-center text-gray-700 text-sm sm:text-base">
                                    <Button onClick={() => router.push(`/dashboard/live/poll/${poll.id}`)} color="alternative">View</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default LivePolls
