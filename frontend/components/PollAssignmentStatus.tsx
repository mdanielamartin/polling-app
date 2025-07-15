"use client"
import { Button, Table, TableHead, TableHeadCell, TableRow, TableBody, TableCell } from "flowbite-react"
import { useParams } from "next/navigation"
import { useEffect } from "react"
import useAssignStore from "../store/assignStore"
import useUserStore from "../store/userStore"


const PollAssignmentStatus = () => {

    const params = useParams()
    const slug = Number(params.slug)
    const { token } = useUserStore()
    const { assignments, getAssignments } = useAssignStore()

    const onLoad = async () => {
        await getAssignments(token, slug)
    }
    useEffect(() => {
        onLoad()
    }, [])



    return (

        <Table className="w-full shadow-md rounded-md table-auto">
            <TableHead>
                <TableRow >
                    <TableHeadCell className="font-bold text-center text-sm sm:text-base text-black bg-gray-200">EMAIL</TableHeadCell>
                    <TableHeadCell className="bg-gray-200">
                        <span className="sr-only bg-gray-200">Actions</span>
                    </TableHeadCell>
                </TableRow>
            </TableHead>
            <TableBody className="divide-y">
                {
                    assignments.map((contact) => (
                        <TableRow key={contact.id} className="bg-white hover:bg-gray-100">
                            <TableCell className="whitespace-nowrap font-normal text-md text-start text-gray-700 ">
                                {contact.email}
                            </TableCell>
                            <TableCell className="whitespace-nowrap font-normal text-md text-start text-gray-700 ">
                                <Button color="alternative">Resend Invite</Button>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>

    )



}


export default PollAssignmentStatus
