"use client";

import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import React, { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import useUserStore from "../src/store/userStore";
import useContactStore from "../src/store/contactStore";

const ConfirmDeletion = ({message,title, contactIds, onActionComplete}) => {
  const [openModal, setOpenModal] = useState(false);
  const {token} = useUserStore()
  const { deleteContacts} = useContactStore()


  const confirmDeletion = async () => {

    await deleteContacts(contactIds,token)
    onActionComplete()
    setOpenModal(false)
  }

  return (
    <>
      <Button color="red" disabled={contactIds.length > 0 ? false:true} onClick={() => setOpenModal(true)}>{title}</Button>
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-800 text-lg" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {message}
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="alternative" onClick={() => setOpenModal(false)}>
                Cancel
              </Button>
              <Button color="alternative" onClick={() => confirmDeletion()}>
                Confirm
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default ConfirmDeletion
