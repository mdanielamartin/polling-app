"use client";

import { Button, DropdownItem, Modal, ModalBody, ModalHeader, Dropdown, ModalFooter } from "flowbite-react";
import { useState } from "react";
import { FaClipboardList } from "react-icons/fa";
import useUserStore from "../store/userStore";
import useListStore from "../store/listStore";

const ListSelectionModal = ({contactIds, onActionComplete}) => {


    const {token} = useUserStore()
    const {addToList, lists} = useListStore()
    const [openModal, setOpenModal] = useState(false);
    const [selectList, setSelectList] = useState({id:null,name:null})
    function onCloseModal() {
        setOpenModal(false);
    }

    const addButton = async () =>{
        await addToList(contactIds,selectList.id , token)
        setSelectList({id:null,name:null})
        onActionComplete()
        setOpenModal(false)
    }

    return (
        <>
            <Button color="light" className="cursor:pointer w-full sm:w-auto text-xs sm:text-base md:text-md" onClick={() => setOpenModal(true)}><FaClipboardList className="mr-2 text-xl text-xs sm:text-base md:text-md" />Add Selection to List</Button>
            <Modal show={openModal} size="sm" className="text-gray-900" onClose={onCloseModal} popup>
                <ModalHeader />
                <ModalBody>
                    <div className="bg-gray-100 h-auto min-w-95/100 rounded-xl px-4 mx-auto justify-center ">
                        <form className="mx-auto p-4" id="list">
                            <Dropdown color="light" label={selectList.id? selectList.name:"Select List"} value={4} className="max-h-48 overflow-y-auto mb-4 py-2 mx-auto w-3/4 " dismissOnClick={true}>
                                {lists.map((list) => (
                                    <DropdownItem key={list.id} onClick={() => setSelectList({id:list.id,name:list.name}) }className="bg-gray-50 hover:bg-gray-100">{list.name}</DropdownItem>
                                ))}

                            </Dropdown>
                        </form>
                    </div>

                </ModalBody>
                <ModalFooter className="-mt-5">
                    <div className="flex justify-center space-x-4 w-full">
                        <Button color="red" className="shadow-lg hover:shadow-xl" >Cancel</Button>
                        <Button color="cyan" className="shadow-lg hover:shadow-xl" form="list" onClick={addButton}>Add Contacts to List</Button>
                    </div>
                </ModalFooter>
            </Modal>
        </>
    );
}

export default ListSelectionModal
