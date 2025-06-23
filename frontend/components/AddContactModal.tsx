
"use client";

import { Button, Label, Modal, ModalBody, ModalHeader, TextInput, ModalFooter } from "flowbite-react";
import { useState } from "react";
import { HiUserAdd } from "react-icons/hi";
const AddContactModal = () => {
    const [openModal, setOpenModal] = useState(false);
    function onCloseModal() {
        setOpenModal(false);
    }

    return (
        <>
            <Button color="light" className="cursor:pointer" onClick={() => setOpenModal(true)}><HiUserAdd className="mr-2 text-xl"/>Add Contact</Button>
            <Modal show={openModal} size="sm" className="text-gray-900" onClose={onCloseModal} popup>
                <ModalHeader />
                <ModalBody>
                    <div className="bg-gray-100 h-auto min-w-95/100 rounded-xl px-4 mx-auto justify-center ">
                        <form className="mx-auto p-4" id="contact">
                            <div className="grid grid-cols-1">
                                <div className="items-center ">
                                    <div className="mb-2 block">
                                        <Label className="text-md" htmlFor="name">Email</Label>
                                    </div>
                                    <TextInput id="name" type="text" placeholder="name@flowbite.com" required />
                                </div>
                            </div>
                        </form>
                    </div>

                </ModalBody>
                <ModalFooter className="-mt-5">
                    <div className="flex justify-center space-x-4 w-full">
                     <Button color="red" className="shadow-lg hover:shadow-xl">Cancel</Button>
                     <Button color="cyan" className="shadow-lg hover:shadow-xl" form="contact" type="submit">Add</Button>
                    </div>
                </ModalFooter>
            </Modal>
        </>
    );
}

export default AddContactModal
