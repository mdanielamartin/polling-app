"use client"
import { Checkbox, TextInput, Tabs, TabItem, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button, ButtonGroup } from "flowbite-react";

import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import AddContactModal from "../../../components/AddContactModal";
import AddListModal from "../../../components/AddListModal";
import ListSelectionModal from "../../../components/ListSelectionModal";
import ConfirmDeletion from "../../../components/ConfirmDeletion";
import { useForm } from "react-hook-form";
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup";
const Contacts = () => {


    const contactSchema = yup.object().shape({

        email: yup.string().email("Invalid email format").required("Please provide your contact's email address"),

    })

    interface FormData {
        email: string;

    }

    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(contactSchema) })


    const [selection, setSelection] = useState([])
    const [listSelection, setListSelection] = useState([])


    const contacts = [{ "id": 1, "email": "sapegato.com" }, { "id": 2, "email": "donpeto.com" }, { "id": 3, "email": "otroemail@gmail.com" }, { "id": 4, "email": "mail@gmail.com" }, { "id": 5, "email": "miemail@domain.com" }, { "id": 6, "email": "myemail@gmail.com" }]
    const work = [{ "id": 1, "email": "sapegato.com" }, { "id": 2, "email": "donpeto.com" }, { "id": 3, "email": "otroemail@gmail.com" }]

    interface ContactData {
        id: number,
        email: string
    }

    const onSubmit = (data: FormData) => {
        console.log(data)
    }

    const handleCheck = (contact: ContactData) => {
        setSelection(prev =>
            prev.some(c => c.id === contact.id) ? prev.filter(c => c.id !== contact.id) : [...prev, contact]
        )
    }

    const handleCheckAll = () => {
        setSelection(selection.length === contacts.length ? [] : contacts)
    }

    const handleListCheck = (contact: ContactData) => {
        setListSelection(prev =>
            prev.some(c => c.id === contact.id) ? prev.filter(c => c.id !== contact.id) : [...prev, contact]
        )
    }

    const handleListCheckAll = () => {
        setListSelection(work.length === listSelection.length ? [] : work)
    }
    return (
        <div className="flex flex-cols min-h-screen w-full justify-center m-2">
            <Tabs className="min-w-8/10 max-w-9/10" aria-label="Pills" variant="pills">
                <TabItem active title="All">
                    <div className="flex place-content-between mb-5">
                        <AddContactModal />
                        <ListSelectionModal />
                        <AddListModal />
                        <   ConfirmDeletion message="Are you sure you want to delete the selected contacts?" title=
                            {
                                <span className="flex items-center gap-2">
                                    <FaTrash className="text-sm" />
                                    Delete Selection
                                </span>}
                        />

                    </div>
                    <form className="flex place-content-around w-full my-3 items-center" onSubmit={handleSubmit(onSubmit)}>

                        <TextInput className="min-w-7/10" id="email1" type="email" placeholder="contact_email@domain.com..." required {...register("email")} />
                        <p className="text-red-500">{errors.email?.message}</p>
                        <Button className="block" size="lg" color="alternative" type="submit">Add Contact</Button>
                    </form>
                    <Table className="w-full shadow-md  rounded-lg">
                        <TableHead className="bg-gray-500">

                            <TableRow className="bg-gray-500">
                                <TableHeadCell>
                                    <Checkbox checked={selection.length === contacts.length} onChange={() => handleCheckAll()} />
                                </TableHeadCell>
                                <TableHeadCell className="font-bold text-center text-lg text-black normal-case bg-gray-200 ">Email</TableHeadCell>
                                <TableHeadCell className="font-bold text-center text-lg text-black normal-case bg-gray-200 ">
                                    <span className="sr-only bg-gray-200">Actions</span>
                                </TableHeadCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="divide-y">
                            {contacts.map(contact => (
                                <TableRow key={contact.id} className="bg-white hover:bg-gray-100">
                                    <TableCell>
                                        <Checkbox checked={selection.some(c => c.id === contact.id)}
                                            onChange={() => handleCheck(contact)} />
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap font-normal text-md text-start font-medium text-black ">
                                        {contact.email}
                                    </TableCell>
                                    <TableCell className="text-end">    <ButtonGroup>
                                        <Button color="red">Delete</Button>
                                        <Button color="alternative">Add to List</Button>
                                        <Button color="alternative">Edit</Button>
                                    </ButtonGroup></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabItem>
                <TabItem title="Work">
                    <Table className="w-full shadow-md bg-gray-500 rounded-lg">
                        <TableHead className="bg-gray-500">
                            <TableRow className="bg-gray-500">
                                <TableHeadCell>
                                    <Checkbox checked={work.length === listSelection.length} onChange={() => handleListCheckAll()} />
                                </TableHeadCell>
                                <TableHeadCell className="font-bold text-start text-lg text-black normal-case">Email</TableHeadCell>
                                <TableHeadCell>
                                    <span className="sr-only">Actions</span>
                                </TableHeadCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="divide-y">
                            {work.map(contact => (
                                <TableRow key={contact.id} className="bg-white hover:bg-gray-100">
                                    <TableCell>
                                        <Checkbox checked={listSelection.some(c => c.id === contact.id)}
                                            onChange={() => handleListCheck(contact)} />
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap font-normal text-md text-start font-medium text-black ">
                                        {contact.email}
                                    </TableCell>
                                    <TableCell className="text-end">    <ButtonGroup>
                                        <Button color="red">Remove</Button>
                                        <Button color="alternative">Edit</Button>
                                    </ButtonGroup></TableCell>
                                </TableRow>


                            ))}
                        </TableBody>
                    </Table>
                </TabItem>
                <TabItem title="Friends">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Friends</p>
                </TabItem>
            </Tabs>

        </div>
    );
}

export default Contacts
