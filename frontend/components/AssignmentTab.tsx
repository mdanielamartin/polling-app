"use client"
import { Dropdown, DropdownItem, Button, Table, TableHead, TableHeadCell, TableRow, Checkbox, TableBody, TableCell, Tabs, TabItem } from "flowbite-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import useAssignStore from "../src/store/assignStore"
import useContactStore from "../src/store/contactStore"
import useUserStore from "../src/store/userStore"
import useListStore from "../src/store/listStore"

const AssignmentTab = () => {

    const [newAssigments, setNewAssignments] = useState([])
    const [deleteAssignments, setDeleteAssignments] = useState([])
    const [unassigned,setUnassigned] = useState([])
    const [listIds, setListIds] = useState<number[]>([])
    const params = useParams()
    const slug = Number(params.slug)

    const {token} = useUserStore()
    const {getContacts, contacts} = useContactStore()
    const {getAssignments, assignments, addAssignments, removeAssignments} = useAssignStore()
    const {getLists,lists} = useListStore()


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
        setDeleteAssignments(deleteAssignments.length === assignments.length ? [] : assignments.map((a)=>a.id))
    }

    const handleCheckAll = () => {
        setNewAssignments(newAssigments.length === unassigned.length ? [] : unassigned.map((c)=>c.id))
        setListIds(newAssigments.length === unassigned.length ? [] : lists.map((l)=>l.id))
    }


    const handleListSelection = (id:number) =>{
        setListIds(prev =>
            prev.some(c => c === id) ? prev.filter(c => c !== id) : [...prev, id]
        )
    }

    const updateSelection = ()=>{
        const selectedPolleeIds = new Set();
        for (const id of listIds) {
        const list = lists.find(l => l.id === id);
        if (list) {
            for (const pollee of list.pollees) {
                selectedPolleeIds.add(pollee.id);
            }
        }
    }
    const merged = Array.from(new Set([...selectedPolleeIds,...newAssigments]))
    setNewAssignments(merged)
    }



    const onLoad = async () => {
        await getContacts(token)
        await getAssignments(token,slug)
        await getLists(token)
    }
    const handleAssignButton = async ()=>{
        await addAssignments(newAssigments,token,slug)
        setNewAssignments([])
        setListIds([])
    }

    const handleDeleteButton = async ()=>{
        await removeAssignments(deleteAssignments,token,slug)
        setDeleteAssignments([])
    }


    useEffect(() => {
        onLoad()
    },[])

    useEffect(() => {

        if (assignments.length>0){
            const assignedIDs = new Set(assignments.map((a) => a.pollee_id))
            setUnassigned(contacts.filter(contact => !assignedIDs.has(contact.id)))
        }else{
            setUnassigned(contacts)
        }
        updateSelection()

    }, [assignments,contacts,listIds])

    return (

        <Tabs aria-label="Pills" variant="fullWidth">
            <TabItem title="Contacts & Contact Lists">
                <div className="grid grid-cols-1 grid-rows-2 md:grid-cols-3  gap-4">
                    <div className=" md:col-start-3 row-start-1 flex flex-col justify-center">

                        <Dropdown color="light" label="Assign Contact List to Poll" value={4} className="max-h-48 overflow-y-auto mb-4 py-2 mx-auto w-3/4 " dismissOnClick={true}>
                            {lists?.map(list =>(
                                <DropdownItem key={list.id} className="bg-gray-50 hover:bg-gray-100"><Checkbox className="mr-2"
                                checked={listIds.some(c=> c===list.id)}
                                onChange={()=>handleListSelection(list.id)}/>{list.name}</DropdownItem>
                            ))}


                        </Dropdown>
                        <Button color="cyan" className="py-8 w-3/4 align-center mx-auto shadow-lg hover:shadow-xl" onClick={()=>handleAssignButton()}>Assign Selection to Poll</Button>
                    </div>
                    <div className="md:col-span-2">
                        <Table className="w-full shadow-md  rounded-lg col-start-1 col-span-2">
                            <TableHead className="bg-gray-500">
                                <TableRow className="bg-gray-500">
                                    <TableHeadCell>
                                        <Checkbox checked={newAssigments.length === unassigned.length} onChange={() => handleCheckAll()} />
                                    </TableHeadCell>
                                    <TableHeadCell className="font-bold text-center text-lg text-black normal-case bg-gray-200 ">Email</TableHeadCell>
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
                                            <TableCell className="whitespace-nowrap font-normal text-md text-start font-medium text-black ">
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
                <div className="grid grid-cols-1 grid-rows-2 md:grid-cols-3  gap-4">
                    <div className=" md:col-start-3 row-start-1 flex flex-col justify-center">
                        <Button color="cyan" className="py-8 w-3/4 align-center mx-auto shadow-lg hover:shadow-xl">Launch Poll</Button>
                        <Button color="red" className="py-4 w-3/4 align-center mx-auto mt-4" onClick={()=>handleDeleteButton()}>Remove Selection</Button>
                    </div>
                    <div className="md:col-span-2">
                        <Table className="w-full shadow-md  rounded-lg">
                            <TableHead className="bg-gray-500">
                                <TableRow className="bg-gray-500">
                                    <TableHeadCell>
                                        <Checkbox checked={assignments.length === deleteAssignments.length}
                                            onChange={() => handleDeleteCheckAll()} />
                                    </TableHeadCell>
                                    <TableHeadCell className="font-bold text-center text-lg text-black normal-case bg-gray-200 ">Email</TableHeadCell>
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
