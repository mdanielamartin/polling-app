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

    const { token } = useUserStore()
    const { getLists, deleteFromList, deleteList, lists } = useListStore()
    const { getContacts, deleteContacts, updateContact, addContact, contacts } = useContactStore()
    const [edit, setEdit] = useState({ status: false, id: null, email: "" })
    const [activeTab, setActiveTab] = useState(0)
    const contactSchema = yup.object().shape({

        email: yup.string().email("Invalid email format").required("Please provide your contact's email address"),

    })

    interface FormData {
        email: string;

    }

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({ resolver: yupResolver(contactSchema) })
    const [selection, setSelection] = useState<number[]>([])
    const [listSelection, setListSelection] = useState<number[]>([])


    interface ContactData {
        id: number,
        email: string
    }

    const onSubmit = async (data: FormData) => {
        await addContact(data, token)
        setValue("email", "")
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

    const singleDeletion = async (id: number) => {
        const formatList = [id]
        await deleteContacts(formatList, token)

    }

    const editRequest = (email: string, id: number) => {
        setEdit((prev) => ({ ...prev, status: true, email: email, id: id }))
    }

    const updateContactButton = async () => {
        const contact = { email: edit.email, id: edit.id }
        await updateContact(contact, token)
        setEdit((prev) => ({ ...prev, status: false, email: "", id: null }))
    }

    const removeFromListButton = async (selection: number[], listId: number) => {
        await deleteFromList(selection, listId, token)
        setListSelection([])
    }

    const deleteListButton = async (id: number) => {
        setActiveTab(0)
        clearSelections()
        await deleteList(id, token)

    }

    const clearSelections = () => {
        setListSelection([])
        setSelection([])

    }

    useEffect(() => {
        const onLoad = async () => {
            await getContacts(token)
            await getLists(token)
        }
        onLoad()
    }, [])



    return (
        <div className="flex flex-cols min-h-screen w-full justify-center m-2">
            <Tabs className="min-w-8/10 max-w-9/10" aria-label="Pills" variant="pills"
                onActiveTabChange={() => { setSelection([]); setListSelection([]); setEdit((prev) => ({ ...prev, status: false, email: "", id: null })) }}>
                <TabItem active={activeTab === 0} title="All" onClick={() => setActiveTab(0)}>
                    <div className="flex place-content-between mb-5">
                        <ListSelectionModal contactIds={selection} onActionComplete={clearSelections} />
                        <AddListModal editing={false} listName={""} id={null} />
                        <ConfirmDeletion message="Are you sure you want to delete the selected contacts?" title=
                            {
                                <span className="flex items-center gap-2">
                                    <FaTrash className="text-sm" />
                                    Delete Selection
                                </span>} contactIds={selection}

                            onActionComplete={clearSelections}
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

                                    {edit.status && edit.id === contact.id ?
                                        <>
                                            <TableCell className="whitespace-nowrap font-normal text-md text-start font-medium text-black ">
                                                <TextInput id="name" type="text"
                                                    onChange={(e) => setEdit((prev) => ({ ...prev, email: e.target.value }))}
                                                    value={edit.email} placeholder="name@flowbite.com" required />
                                            </TableCell>

                                            <TableCell className="whitespace-nowrap font-normal text-md text-start font-medium text-black flex space-x-3">
                                                <Button color="red" onClick={() => setEdit((prev) => ({ ...prev, status: false, email: "", id: null }))}>Cancel</Button>
                                                <Button color="alternative" onClick={() => updateContactButton()}>Update</Button>

                                            </TableCell>

                                        </>

                                        :
                                        <>
                                            <TableCell>
                                                <Checkbox checked={selection.some(c => c === contact.id)}
                                                    onChange={() => handleCheck(contact)} />
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap font-normal text-md text-start font-medium text-black ">
                                                {contact.email}
                                            </TableCell>
                                            <TableCell className="text-end">    <ButtonGroup>
                                                <Button color="red" onClick={() => singleDeletion(contact.id)}>Delete</Button>
                                                <Button color="alternative" onClick={() => editRequest(contact.email, contact.id)}>Edit</Button>
                                            </ButtonGroup></TableCell>
                                        </>
                                    }
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabItem>
                {lists?.map((list) => (
                    <TabItem key={list.id} title={list.name} active={activeTab === list.id} onClick={() => setActiveTab(list.id)}>
                        <div className="flex place-content-between mb-5">

                            <AddListModal editing={true} listName={list.name} id={list.id} />
                            <Button color="light" onClick={() => removeFromListButton(listSelection, list.id)}>Remove Selection From List</Button>
                            <Button color="red" onClick={() => deleteListButton(list.id)}>Delete Current List</Button>

                        </div>
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
                                        <TableCell className="text-end">
                                            <Button color="red" onClick={() => removeFromListButton([contact.id], list.id)}>Remove</Button>
                                        </TableCell>
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
