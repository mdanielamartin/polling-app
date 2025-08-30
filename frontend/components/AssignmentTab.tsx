"use client"
import { Dropdown, DropdownItem, Button, Table, TableHead, TableHeadCell, TableRow, Checkbox, TableBody, TableCell, Tabs, TabItem } from "flowbite-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import useAssignStore from "../store/assignStore"
import useContactStore from "../store/contactStore"
import useUserStore from "../store/userStore"
import useListStore from "../store/listStore"
import usePollStore from "../store/pollStore"

const AssignmentTab = () => {
    const router = useRouter()
    const [newAssigments, setNewAssignments] = useState([])
    const [deleteAssignments, setDeleteAssignments] = useState([])
    const [unassigned, setUnassigned] = useState([])
    const [listIds, setListIds] = useState<number[]>([])
    const params = useParams()
    const slug = Number(params.slug)

    const { token } = useUserStore()
    const { getContacts, contacts } = useContactStore()
    const { getAssignments, assignments, addAssignments, removeAssignments } = useAssignStore()
    const { getLists, lists } = useListStore()
    const { activatePoll } = usePollStore()

    const launchPoll = async (id: number) => {
        const localNow = new Date();
        const utcNow = localNow.toISOString()
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        await activatePoll(id, utcNow, timezone, token)
        router.push(`/dashboard/live`)
    }
    interface ContactData {
        id: number,
        email: string
    }
    const handleCheck = (contact: ContactData) => {
        setNewAssignments(prev =>
            prev.some(c => c === contact.id) ? prev.filter(c => c !== contact.id) : [...prev, contact.id]
        )
    }

    const handleDeleteCheck = (id: number) => {
        setDeleteAssignments(prev =>
            prev.some(c => c === id) ? prev.filter(c => c !== id) : [...prev, id]
        )
    }

    const handleDeleteCheckAll = () => {
        setDeleteAssignments(deleteAssignments.length === assignments.length ? [] : assignments.map((a) => a.id))
    }

    const handleCheckAll = () => {
        setNewAssignments(newAssigments.length === unassigned.length ? [] : unassigned.map((c) => c.id))
        setListIds(newAssigments.length === unassigned.length ? [] : lists.map((l) => l.id))
    }


    const handleListSelection = (id: number) => {
        setListIds(prev =>
            prev.some(c => c === id) ? prev.filter(c => c !== id) : [...prev, id]
        )
    }

    const updateSelection = () => {
        const selectedPolleeIds = new Set();
        for (const id of listIds) {
            const list = lists.find(l => l.id === id);
            if (list) {
                for (const pollee of list.pollees) {
                    selectedPolleeIds.add(pollee.id);
                }
            }
        }
        const merged = Array.from(new Set([...selectedPolleeIds, ...newAssigments]))
        setNewAssignments(merged)
    }

    const onLoad = async () => {
        await getContacts(token)
        await getAssignments(token, slug)
        await getLists(token)
    }
    const handleAssignButton = async () => {
        await addAssignments(newAssigments, token, slug)
        setNewAssignments([])
        setListIds([])
    }

    const handleDeleteButton = async () => {
        await removeAssignments(deleteAssignments, token, slug)
        setDeleteAssignments([])
    }


    useEffect(() => {
        onLoad()
    }, [])

    useEffect(() => {

        if (assignments.length > 0) {
            const assignedIDs = new Set(assignments.map((a) => a.pollee_id))
            setUnassigned(contacts.filter(contact => !assignedIDs.has(contact.id)))
        } else {
            setUnassigned(contacts)
        }
        updateSelection()

    }, [assignments, contacts, listIds])

    return (

        <Tabs aria-label="Pills" variant="fullWidth">
            <TabItem title="Contacts & Contact Lists">
                <div className="grid grid-cols-1">
                    <div className=" flex  place-content-center space-x-4 mb-4">
                        <Dropdown color="light" label="Assign Contact List to Poll" value={4} className="w-full max-w-xs overflow-y-auto shadow-sm sm:text-sm text-xs" dismissOnClick={true}>
                            {lists?.map(list => (
                                <DropdownItem key={list.id} className="bg-gray-50 hover:bg-gray-100"><Checkbox className="mr-2"
                                    checked={listIds.some(c => c === list.id)}
                                    onChange={() => handleListSelection(list.id)} />{list.name}</DropdownItem>
                            ))}
                        </Dropdown>
                        <Button color="cyan" className="w-full max-w-xs py-3 shadow hover:shadow-lg sm:text-sm text-xs " onClick={() => handleAssignButton()}>Assign Selection to Poll</Button>
                    </div>
                    <div>
                        <Table className="w-full shadow-md rounded-md table-auto">
                            <TableHead>
                                <TableRow >
                                    <TableHeadCell className="bg-gray-200">
                                        <Checkbox checked={newAssigments.length === unassigned.length} onChange={() => handleCheckAll()} />
                                    </TableHeadCell>
                                    <TableHeadCell className="font-bold text-center text-sm sm:text-base text-black bg-gray-200">EMAIL</TableHeadCell>
                                </TableRow>
                            </TableHead>
                            <TableBody className="divide-y">
                                {
                                    unassigned.map((contact) => (
                                        <TableRow key={contact.id} className="bg-white hover:bg-gray-100">
                                            <TableCell>
                                                <Checkbox checked={newAssigments.some(c => c === contact.id)}
                                                    onChange={() => handleCheck(contact)} />
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap font-normal text-md text-start text-gray-700 ">
                                                {contact.email}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </TabItem>

            <TabItem title="Pollees">
                <div className="grid grid-cols-1">
                    <div className="flex  place-content-center space-x-4 mb-4">
                        <Button color="red" className="w-full max-w-xs py-3 shadow hover:shadow-lg sm:text-sm text-xs" onClick={() => handleDeleteButton()}>Remove Selection</Button>
                        <Button color="cyan" className="w-full max-w-xs py-3 shadow hover:shadow-lg sm:text-sm text-xs" onClick={() => launchPoll(slug)}>Launch Poll</Button>
                    </div>
                    <div>
                        <Table className="w-full shadow-md rounded-md table-auto">
                            <TableHead >
                                <TableRow>
                                    <TableHeadCell className="bg-gray-200">
                                        <Checkbox checked={assignments.length === deleteAssignments.length}
                                            onChange={() => handleDeleteCheckAll()} />
                                    </TableHeadCell>
                                    <TableHeadCell className="font-bold text-center text-sm sm:text-base text-black bg-gray-200 ">Email</TableHeadCell>
                                </TableRow>
                            </TableHead>
                            <TableBody className="divide-y">

                                {assignments.map(assignment => (

                                    <TableRow key={assignment.id} className="bg-white hover:bg-gray-100">
                                        <TableCell>
                                            <Checkbox checked={deleteAssignments.some(c => c === assignment.id)}
                                                onChange={() => handleDeleteCheck(assignment.id)} />
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap font-normal text-md text-start font-medium text-black ">
                                            {assignment.email}
                                        </TableCell>

                                    </TableRow>


                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </TabItem>

        </Tabs>

    )



}


export default AssignmentTab
