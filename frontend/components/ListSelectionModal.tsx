"use client";

import { Button, DropdownItem, Modal, ModalBody, ModalHeader, Dropdown, ModalFooter } from "flowbite-react";
import { useState } from "react";
import { FaClipboardList } from "react-icons/fa";

const ListSelectionModal = () => {
    const [openModal, setOpenModal] = useState(false);
    function onCloseModal() {
        setOpenModal(false);
    }

    return (
        <>
            <Button color="light" className="cursor:pointer" onClick={() => setOpenModal(true)}><FaClipboardList className="mr-2 text-xl" />Add Selection to List</Button>
            <Modal show={openModal} size="sm" className="text-gray-900" onClose={onCloseModal} popup>
                <ModalHeader />
                <ModalBody>
                    <div className="bg-gray-100 h-auto min-w-95/100 rounded-xl px-4 mx-auto justify-center ">
                        <form className="mx-auto p-4" id="list">
                            <Dropdown color="light" label="Assign Contact List to Poll" value={4} className="max-h-48 overflow-y-auto mb-4 py-2 mx-auto w-3/4 " dismissOnClick={false}>
                                <DropdownItem className="bg-gray-50 hover:bg-gray-100"> Friends</DropdownItem>
                                <DropdownItem className="bg-gray-50 hover:bg-gray-100">Work</DropdownItem>
                                <DropdownItem className="bg-gray-50 hover:bg-gray-100">Family</DropdownItem>

                            </Dropdown>
                        </form>
                    </div>

                </ModalBody>
                <ModalFooter className="-mt-5">
                    <div className="flex justify-center space-x-4 w-full">
                        <Button color="red" className="shadow-lg hover:shadow-xl">Cancel</Button>
                        <Button color="cyan" className="shadow-lg hover:shadow-xl" form="list" type="submit">Add Contacts to List</Button>
                    </div>
                </ModalFooter>
            </Modal>
        </>
    );
}

export default ListSelectionModal
