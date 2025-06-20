
"use client";

import { Button, Label, Modal, ModalBody, ModalHeader, TextInput, Dropdown,DropdownItem, Textarea, ModalFooter } from "flowbite-react";
import { useState } from "react";
const PollCreateModal = () => {
    const [openModal, setOpenModal] = useState(true);

    const days = [...Array(30)].map((_,i)=>i+1)
    function onCloseModal() {
        setOpenModal(false);
    }

    return (
        <>
            <Button onClick={() => setOpenModal(true)}>Toggle modal</Button>
            <Modal show={openModal} size="3xl" className="text-gray-900" onClose={onCloseModal} popup>
                <ModalHeader />
                <ModalBody>
                    <div className="bg-gray-100 h-auto min-w-95/100 rounded-xl px-4 mx-auto justify-center ">
                        <form className="mx-auto p-4">
                            <div className="grid grid-cols-1 grid-rows-4 sm:grid-cols-3 sm:grid-rows-2 gap-x-4 gap-y-0">
                                <div className="sm:col-span-2 items-center ">
                                    <div className="mb-2 block">
                                        <Label className="text-md" htmlFor="name">Poll Name</Label>
                                    </div>
                                    <TextInput id="name" type="text" value={"Birthday Party Places"} placeholder="name@flowbite.com" required />
                                </div>
                                <div className="sm:col-start-3">
                                    <div className="mb-2 block">
                                        <Label className="text-md" htmlFor="name">Poll Validity in Days</Label>
                                    </div>
                                    <Dropdown color="alternative" label="Duration" value={4} className="max-h-48 overflow-y-auto w-full" dismissOnClick={false}>
                                        {days.map((day, index) => {
                                            return (
                                                <DropdownItem className="bg-gray-50 hover:bg-gray-100" key={index}>{day}</DropdownItem>
                                            )
                                        })}
                                    </Dropdown>
                                </div>
                                <div className="sm:col-span-full sm:row-start-2">
                                    <div className="mb-2 block">
                                        <Label className="text-md" htmlFor="description">Description</Label>
                                    </div>
                                    <Textarea className="overflow-y-auto text-red-800" id="description" rows={2} value={"These are the places I have looked so far. Please pick one of your liking."} placeholder="Provide additional information (optional)" />
                                </div>

                            </div>
                        </form>
                    </div>

                </ModalBody>
                <ModalFooter className="-mt-5">
                    <div className="flex justify-center space-x-4 w-full">
                     <Button color="red" className="shadow-lg hover:shadow-xl" type="submit">Cancel</Button>
                     <Button color="cyan" className="shadow-lg hover:shadow-xl" type="submit">Create</Button>
                    </div>
                </ModalFooter>
            </Modal>
        </>
    );
}

export default PollCreateModal
