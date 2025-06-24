"use client";

import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import React, { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";


const ConfirmDeletion = ({message,title}) => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <Button color="red" onClick={() => setOpenModal(true)}>{title}</Button>
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-800 text-lg" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {message}
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="red" onClick={() => setOpenModal(false)}>
                Confirm
              </Button>
              <Button color="alternative" onClick={() => setOpenModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default ConfirmDeletion
