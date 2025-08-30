"use client"
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button, ButtonGroup } from "flowbite-react";
import usePollStore from "../../../store/pollStore";
import useUserStore from "../../../store/userStore";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toLocalTime } from "../../../utils/timezones";
import LoadingSpinner from "../../../components/LoadingSpinner";


const EditPolls = () => {

  const { polls, getPolls, deletePoll, activatePoll, isLoading } = usePollStore()
  const token = useUserStore.getState().token
  const router = useRouter()

  const launchPoll = async (id: number) => {
    const localNow = new Date();
    const utcNow = localNow.toISOString()
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    await activatePoll(id, utcNow, timezone, token)
    router.push(`/dashboard/live`)
  }

  const editButton = (id: number) => {
    router.push(`edit/poll/${id}`)

  }
  useEffect(() => {
    const onLoad = async () => {
      await getPolls(token)
    }
    onLoad()

  }, [])

  const draftPolls = useMemo(() => {
    if (polls) {
      const draft = polls.filter(poll => poll.status == "draft")
      return draft
    }

    return []


  }, [polls])

  if (isLoading && draftPolls.length == 0) {
    return (
      <LoadingSpinner/>
    )
  }

  if (!isLoading && draftPolls.length == 0) {
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
      <div className="w-full max-w-7xl overflow-x-auto shadow-lg rounded-lg border border-gray-300">
        <Table className="w-full shadow-md rounded-md table-auto">
          <TableHead>
            <TableRow>
              {["Name", "Creation Date", "Duration"].map((heading) => (
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
            {draftPolls?.map((poll) => (
              <TableRow key={poll.id} className="bg-white hover:bg-gray-100 transition-colors">
                <TableCell className="whitespace-nowrap text-center text-sm sm:text-base text-black">
                  {poll.name}
                </TableCell>
                <TableCell className="text-center text-gray-700 text-sm sm:text-base">
                  {toLocalTime(poll.created_at)}
                </TableCell>
                <TableCell className="text-center text-gray-700 text-sm sm:text-base">
                  {poll.time_limit_days}
                </TableCell>
                <TableCell className="text-center text-gray-700 text-sm sm:text-base">
                  <ButtonGroup>
                    <Button
                      color="red"
                      className="text-sm px-2 py-1"
                      onClick={async () => {
                        await deletePoll(poll.id, token);
                      }}
                    >
                      Delete
                    </Button>
                    <Button
                      color="alternative"
                      className="text-sm px-2 py-1"
                      onClick={() => launchPoll(poll.id)}
                    >
                      Launch
                    </Button>
                    <Button
                      color="alternative"
                      className="text-sm px-2 py-1"
                      onClick={() => editButton(poll.id)}
                    >
                      Edit
                    </Button>
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
