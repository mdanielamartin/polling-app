"use client"
import { Button, Table, TableHead, TableHeadCell, TableRow, TableBody, TableCell, Checkbox } from "flowbite-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import useAssignStore from "../store/assignStore"
import useUserStore from "../store/userStore"


const PollAssignmentStatus = () => {
    const [resends, setResends] = useState([])
    const params = useParams()
    const slug = Number(params.slug)
    const { token } = useUserStore()
    const { assignments, getAssignments, resendAssignments } = useAssignStore()

    const resend = async (id: number[]) => {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        await resendAssignments(id, slug, timezone, token)
    }

    const handleCheck = (id: number) => {
        setResends(prev =>
            prev.some(c => c === id) ? prev.filter(c => c !== id) : [...prev, id]
        )
    }

    const handleCheckAll = () => {
        setResends(resends.length === assignments.length ? [] : assignments.map((c) => c.id))

    }

    useEffect(() => {
        const onLoad = async () => {
            await getAssignments(token, slug)
        }
        onLoad()
    }, [])



    return (
        <>
            <div className=" flex  place-content-center space-x-4 mb-4">
                <Button color="cyan" className="w-full max-w-xs py-3 shadow hover:shadow-lg sm:text-sm text-xs " onClick={() => resend(resends)}>Resend Emails</Button>
            </div>
            <Table className="w-full shadow-md rounded-md table-auto">
                <TableHead>
                    <TableRow >
                        <TableHeadCell className="bg-gray-200">
                            <Checkbox checked={resends.length === assignments.length} onChange={() => handleCheckAll()} />
                        </TableHeadCell>
                        <TableHeadCell className="font-bold text-center text-sm sm:text-base text-black bg-gray-200">EMAIL</TableHeadCell>
                        <TableHeadCell className="font-bold text-center text-sm sm:text-base text-black bg-gray-200">Status</TableHeadCell>
                        <TableHeadCell className="bg-gray-200">
                            <span className="sr-only bg-gray-200">Actions</span>
                        </TableHeadCell>
                    </TableRow>
                </TableHead>
                <TableBody className="divide-y">
                    {
                        assignments.map((contact) => (
                            <TableRow key={contact.id} className="bg-white hover:bg-gray-100">
                                <TableCell>
                                    <Checkbox checked={resends.some(c => c === contact.id)}
                                        onChange={() => handleCheck(contact.id)} />
                                </TableCell>
                                <TableCell className="whitespace-nowrap font-normal text-md text-start text-gray-700 ">
                                    {contact.email}
                                </TableCell>
                                <TableCell className="whitespace-nowrap font-normal text-md text-start text-gray-700 ">
                                    {contact.status ? "Sent" : "Error"}
                                </TableCell>
                                <TableCell className="whitespace-nowrap font-normal text-md text-start text-gray-700 ">
                                    <Button onClick={() => resend([contact.id])} color="alternative">Resend Invite</Button>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </>

    )



}


export default PollAssignmentStatus
