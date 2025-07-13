"use client"
import { Checkbox, TextInput, Tabs, TabItem, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button, ButtonGroup } from "flowbite-react";

import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa6";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";

import AddListModal from "../../../components/AddListModal";
import ListSelectionModal from "../../../components/ListSelectionModal";
import ConfirmDeletion from "../../../components/ConfirmDeletion";
import { useForm } from "react-hook-form";
import useUserStore from "../../../store/userStore";
import useContactStore from "../../../store/contactStore";
import useListStore from "../../../store/listStore";
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
        <div className="flex flex-col min-h-screen w-full justify-start items-center px-5 py-6">
            <Tabs className="w-full" aria-label="Pills" variant="pills"
                onActiveTabChange={() => { setSelection([]); setListSelection([]); setEdit((prev) => ({ ...prev, status: false, email: "", id: null })) }}>
                <TabItem active={activeTab === 0} title="All" onClick={() => setActiveTab(0)} className="overflow-x-auto items-center justify-start border">
                    <div className="flex flex-wrap justify-between gap-2 sm:gap-4 mb-5">
                        <ListSelectionModal contactIds={selection} onActionComplete={clearSelections} />
                        <AddListModal editing={false} listName={""} id={null} />
                        <ConfirmDeletion message="Are you sure you want to delete the selected contacts?" title=
                            {
                                <span className="flex text-sm sm:text-base md:text-lg items-center gap-2">
                                    <FaTrash className="text-sm" />
                                    Delete Selection
                                </span>} contactIds={selection}

                            onActionComplete={clearSelections}
                        />
                    </div>
                    <form className="flex flex-col w-full my-4 items-center justify-center sm:space-x-2 space-y-2" onSubmit={handleSubmit(onSubmit)}>
                        <TextInput className="w-full text-sm sm:text-base md:text-lg" id="email1" type="email" placeholder="contact_email@domain.com..." required {...register("email")} />
                        <p className="text-red-500">{errors.email?.message}</p>
                        <Button className="block text-sm sm:text-base md:text-lg whitespace-nowrap w-full shadow-lg" size="lg" color="alternative" type="submit">Add Contact</Button>
                    </form>
                    <div className="w-full overflow-x-auto sm:overflow-visible">


                        <Table className="max-w-[95] shadow-md rounded-lg  overflow-scroll table-auto">
                            <TableHead >

                                <TableRow >
                                    <TableHeadCell className="bg-gray-200">
                                        <Checkbox checked={selection.length === contacts.length} onChange={() => handleCheckAll()} />
                                    </TableHeadCell>
                                    <TableHeadCell className="font-bold text-center text-lg text-black bg-gray-200 ">Email</TableHeadCell>
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

                                                <TableCell className="whitespace-nowrap font-normal  text-md text-start text-gray-700 ">

                                                </TableCell>
                                                <TableCell className="whitespace-nowrap font-normal  text-md text-start text-gray-700 ">
                                                    <TextInput id="name" type="text"
                                                        onChange={(e) => setEdit((prev) => ({ ...prev, email: e.target.value }))}
                                                        value={edit.email} placeholder="name@flowbite.com"
                                                        className="w-full sm:w-[20rem] text-sm sm:text-base" required />
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap font-normal justify-center text-black flex space-x-1">
                                                    <Button color="red" size="xs" className="text-xs" onClick={() => setEdit((prev) => ({ ...prev, status: false, email: "", id: null }))}><FaTimes /></Button>
                                                    <Button color="green" size="xs" className="text-xs" onClick={() => updateContactButton()}><FaCheck /></Button>
                                                </TableCell>

                                            </>

                                            :
                                            <>
                                                <TableCell>
                                                    <Checkbox checked={selection.some(c => c === contact.id)}
                                                        onChange={() => handleCheck(contact)} />
                                                </TableCell>
                                                <TableCell className=" whitespace-nowrap font-normal text-md text-start text-gray-700 ">
                                                    {contact.email}
                                                </TableCell>
                                                <TableCell className="text-end">    <ButtonGroup>
                                                    <Button size="sm" className="text-xs" color="red" onClick={() => singleDeletion(contact.id)}><FaTrash /></Button>
                                                    <Button size="sm" className="text-xs" color="alternative" onClick={() => editRequest(contact.email, contact.id)}><FaEdit /></Button>
                                                </ButtonGroup></TableCell>
                                            </>
                                        }
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>



                </TabItem>
                {lists?.map((list) => (
                    <TabItem key={list.id} title={list.name} active={activeTab === list.id} onClick={() => setActiveTab(list.id)}>
                        <div className="flex flex-wrap justify-between gap-2 sm:gap-4 mb-5">

                            <AddListModal editing={true} listName={list.name} id={list.id} />
                            <Button color="light" className="text-xs cursor:pointer w-full sm:w-auto  sm:text-base md:text-md" onClick={() => removeFromListButton(listSelection, list.id)}>Remove Selection From List</Button>
                            <Button color="red" className="text-xs cursor:pointer w-full sm:w-auto  sm:text-base md:text-md" onClick={() => deleteListButton(list.id)}>Delete Current List</Button>

                        </div>
                        <div className="w-full overflow-x-auto sm:overflow-visible">


                        <Table className="w-full shadow-md rounded-lg">
                            <TableHead >
                                <TableRow>
                                    <TableHeadCell className="bg-gray-200">
                                        <Checkbox checked={list.pollees.length === listSelection.length} onChange={() => handleListCheckAll(list)} />
                                    </TableHeadCell>
                                    <TableHeadCell className="font-bold text-center text-lg text-black bg-gray-200 ">Email</TableHeadCell>
                                    <TableHeadCell className="bg-gray-200">
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
                                        <TableCell className="whitespace-nowrap font-normal text-md text-start  text-gray-700 ">
                                            {contact.email}
                                        </TableCell>
                                        <TableCell className="flex justify-center justify-start">
                                            <Button className="text-xs " size="sm" color="red" onClick={() => removeFromListButton([contact.id], list.id)}><FaTimes /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        </div>
                    </TabItem>
                ))}
            </Tabs>

        </div>
    );
}

export default Contacts
