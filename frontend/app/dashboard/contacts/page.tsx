"use client"
import { Checkbox, TextInput, Tabs, TabItem, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button, ButtonGroup } from "flowbite-react";

import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import AddListModal from "../../../components/AddListModal";
import ListSelectionModal from "../../../components/ListSelectionModal";
import ConfirmDeletion from "../../../components/ConfirmDeletion";
import { useForm } from "react-hook-form";
import useUserStore from "../../../src/store/userStore";
import useContactStore from "../../../src/store/contactStore";
import useListStore from "../../../src/store/listStore";
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup";
const Contacts = () => {

    const {token}= useUserStore()
    const {getLists, lists} = useListStore()
    const {getContacts,contacts} = useContactStore()
    const contactSchema = yup.object().shape({

        email: yup.string().email("Invalid email format").required("Please provide your contact's email address"),

    })

    interface FormData {
        email: string;

    }

    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(contactSchema) })
    const [selection, setSelection] = useState<number[]>([])
    const [listSelection, setListSelection] = useState<number[]>([])


    interface ContactData {
        id: number,
        email: string
    }

    const onSubmit = (data: FormData) => {
        console.log(data)
    }

    const handleCheck = (contact: ContactData) => {
        setSelection(prev =>
            prev.some(c => c === contact.id) ? prev.filter(c => c !== contact.id) : [...prev, contact.id]
        )
    }

    const handleCheckAll = () => {
        setSelection(selection.length === contacts.length ? [] : contacts?.map(c => c.id))
    }

    const handleListCheck = (contact: ContactData) => {
        setListSelection(prev =>
            prev.some(c => c === contact.id) ? prev.filter(c => c !== contact.id) : [...prev, contact.id]
        )
    }

    const handleListCheckAll = (list) => {
        setListSelection(list.pollees.length === listSelection.length ? [] : list.pollees.map(l => l.id))
    }

    useEffect(()=>{
        const onLoad = async ()=>{
            await getContacts(token)
            await getLists(token)
        }

        onLoad()
    },[])
    return (
        <div className="flex flex-cols min-h-screen w-full justify-center m-2">
            <Tabs className="min-w-8/10 max-w-9/10" aria-label="Pills" variant="pills"
            onActiveTabChange={() => {setSelection([]); setListSelection([])}}>
                <TabItem active title="All">
                    <div className="flex place-content-between mb-5">
                        <ListSelectionModal contactIds = {selection} />
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
                                        <Checkbox checked={selection.some(c => c === contact.id)}
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
                {lists?.map((list)=>(
                <TabItem key={list.id} title={list.name}>
                    <Table className="w-full shadow-md bg-gray-500 rounded-lg">
                        <TableHead className="bg-gray-500">
                            <TableRow className="bg-gray-500">
                                <TableHeadCell>
                                    <Checkbox checked={list.pollees.length === listSelection.length} onChange={() => handleListCheckAll(list)} />
                                </TableHeadCell>
                                <TableHeadCell className="font-bold text-start text-lg text-black normal-case">Email</TableHeadCell>
                                <TableHeadCell>
                                    <span className="sr-only">Actions</span>
                                </TableHeadCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="divide-y">
                            {list.pollees?.map(contact => (
                                <TableRow key={contact.id} className="bg-white hover:bg-gray-100">
                                    <TableCell>
                                        <Checkbox checked={listSelection.some(c => c === contact.id)}
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
                ))}
            </Tabs>

        </div>
    );
}

export default Contacts
