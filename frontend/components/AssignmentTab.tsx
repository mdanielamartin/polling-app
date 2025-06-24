"use client"
import { Dropdown, DropdownItem, Button, Table, TableHead, TableHeadCell, TableRow, Checkbox, TableBody, TableCell, Tabs, TabItem } from "flowbite-react"

import { useEffect, useState } from "react"


const AssignmentTab = () => {

    const [newAssigments, setNewAssignments] = useState([])
    const [deleteAssignments, setDeleteAssignments] = useState([])


    const contacts = [{ "id": 1, "email": "sapegato.com" }, { "id": 2, "email": "donpeto.com" }, { "id": 3, "email": "otroemail@gmail.com" }, { "id": 4, "email": "mail@gmail.com" }, { "id": 5, "email": "miemail@domain.com" }, { "id": 6, "email": "myemail@gmail.com" }]
    const assignments = [{ "id": 1, "email": "sapegato.com" }, { "id": 2, "email": "donpeto.com" }, { "id": 3, "email": "otroemail@gmail.com" }]

    const assignedIDs = new Set(assignments.map((a) => a.id))

    const displayContacts = contacts.filter(contact => !assignedIDs.has(contact.id))
    interface ContactData {
        id: number,
        email: string
    }
    const handleCheck = (contact: ContactData) => {
        setNewAssignments(prev =>
            prev.some(c => c.id === contact.id) ? prev.filter(c => c.id !== contact.id) : [...prev, contact]
        )
    }

    const handleDeleteCheck = (contact: ContactData) => {
        setDeleteAssignments(prev =>
            prev.some(c => c.id === contact.id) ? prev.filter(c => c.id !== contact.id) : [...prev, contact]
        )
    }

    const handleDeleteCheckAll = () => {
        setDeleteAssignments(deleteAssignments.length === assignments.length ? [] : assignments)
    }

    const handleCheckAll = () => {
        setNewAssignments(newAssigments.length === displayContacts.length ? [] : displayContacts)
    }

    useEffect(() => {
        console.log(newAssigments)
    }, [newAssigments])

    return (

        <Tabs aria-label="Pills" variant="fullWidth">
            <TabItem title="Contacts & Contact Lists">
                <div className="grid grid-cols-1 grid-rows-2 md:grid-cols-3  gap-4">
                    <div className=" md:col-start-3 row-start-1 flex flex-col justify-center">

                        <Dropdown color="light" label="Assign Contact List to Poll" value={4} className="max-h-48 overflow-y-auto mb-4 py-2 mx-auto w-3/4 " dismissOnClick={false}>
                            <DropdownItem className="bg-gray-50 hover:bg-gray-100"><Checkbox className="mr-2" /> Friends</DropdownItem>
                            <DropdownItem className="bg-gray-50 hover:bg-gray-100"><Checkbox className="mr-2" /> Work</DropdownItem>
                            <DropdownItem className="bg-gray-50 hover:bg-gray-100"><Checkbox className="mr-2" /> Family</DropdownItem>

                        </Dropdown>
                        <Button color="cyan" className="py-8 w-3/4 align-center mx-auto shadow-lg hover:shadow-xl">Assign Selection to Poll</Button>
                    </div>
                    <div className="md:col-span-2">
                        <Table className="w-full shadow-md  rounded-lg col-start-1 col-span-2">
                            <TableHead className="bg-gray-500">
                                <TableRow className="bg-gray-500">
                                    <TableHeadCell>
                                        <Checkbox checked={newAssigments.length === displayContacts.length} onChange={() => handleCheckAll()} />
                                    </TableHeadCell>
                                    <TableHeadCell className="font-bold text-center text-lg text-black normal-case bg-gray-200 ">Email</TableHeadCell>
                                </TableRow>
                            </TableHead>
                            <TableBody className="divide-y">
                                {
                                    displayContacts.map((contact) => (
                                        <TableRow key={contact.id} className="bg-white hover:bg-gray-100">
                                            <TableCell>
                                                <Checkbox checked={newAssigments.some(c => c.id === contact.id)}
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
                        <Button color="red" className="py-4 w-3/4 align-center mx-auto mt-4">Remove Selection</Button>
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

                                {assignments.map(pollee => (

                                    <TableRow key={pollee.id} className="bg-white hover:bg-gray-100">
                                        <TableCell>
                                            <Checkbox checked={deleteAssignments.some(c => c.id === pollee.id)}
                                                onChange={() => handleDeleteCheck(pollee)} />
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap font-normal text-md text-start font-medium text-black ">
                                            {pollee.email}
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
