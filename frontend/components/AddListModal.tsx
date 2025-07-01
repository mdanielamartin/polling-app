"use client";

import { Button, Label, Modal, ModalBody, ModalHeader, TextInput, ModalFooter } from "flowbite-react";
import { useState } from "react";
import useListStore from "../src/store/listStore";
import { MdFormatListBulletedAdd } from "react-icons/md";
import useUserStore from "../src/store/userStore";
const AddListModal = () => {
    const [openModal, setOpenModal] = useState(false);
    const [name,setName] = useState("")
    const {createList} = useListStore()
    const {token} = useUserStore()
    function onCloseModal() {
        setOpenModal(false);
    }

    const createListButton = async () => {
        if (name.length > 2){
            await createList(name,token)}
            setOpenModal(false);
    }

    return (
        <>
            <Button color="light" className="cursor:pointer" onClick={() => setOpenModal(true)}><MdFormatListBulletedAdd className="mr-2 text-xl" />Create New List</Button>
            <Modal show={openModal} size="sm" className="text-gray-900" onClose={onCloseModal} popup>
                <ModalHeader />
                <ModalBody>
                    <div className="bg-gray-100 h-auto min-w-95/100 rounded-xl px-4 mx-auto justify-center ">
                        <form className="mx-auto p-4" id="list">
                            <div className="grid grid-cols-1">
                                <div className="items-center ">
                                    <div className="mb-2 block">
                                        <Label className="text-md" htmlFor="list">List Name</Label>
                                    </div>
                                    <TextInput id="list" value={name} onChange={(e)=>setName(e.target.value)} type="text" placeholder="My List..." required />
                                </div>
                            </div>
                        </form>
                    </div>

                </ModalBody>
                <ModalFooter className="-mt-5">
                    <div className="flex justify-center space-x-4 w-full">
                     <Button color="red" className="shadow-lg hover:shadow-xl" onClick={()=>setOpenModal(false)}>Cancel</Button>
                     <Button color="cyan" className="shadow-lg hover:shadow-xl" form="list" onClick={()=>createListButton()}>Create</Button>
                    </div>
                </ModalFooter>
            </Modal>
        </>
    );
}

export default AddListModal
