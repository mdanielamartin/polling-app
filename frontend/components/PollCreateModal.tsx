
"use client";
import { useForm } from "react-hook-form";
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup";
import usePollStore from "../src/store/pollStore";
import useUserStore from "../src/store/userStore";
import { Button, Label, Modal, ModalBody, ModalHeader, TextInput, Dropdown, DropdownItem, Textarea, ModalFooter } from "flowbite-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { showPollError } from "../utils/alerts";

const PollCreateModal = () => {
    const [openModal, setOpenModal] = useState(false);
    const [selectedDay,setSelectedDay] = useState(0)
    const days = [...Array(30)].map((_, i) => i + 1)

    const router = useRouter()
    const {createPoll, error, poll} = usePollStore()
    const {token} = useUserStore()

    function onCloseModal() {
        reset({"name":"","time_limit_days":null,"description":""})
        setSelectedDay(null)
        setOpenModal(false);
    }

    const pollSchema = yup.object().shape({
        name: yup.string().min(3, "Name must be at least 3 characters long").max(50, "Name must not exceed 50 characters").required("Poll must have a name/question or instruction"),
        time_limit_days: yup.number().min(1, "Polls minimum duration is 1 day").max(30, "Polls maximum duration is 30 days").required("Please specify the poll's duration"),
        description: yup.string().max(255, "Description cannot exceed 255 characters.")
    })

    interface FormData {
        name: string;
        time_limit_days: number;
        description: string;
    }

    const { register, setValue,reset, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(pollSchema) })

      const onSubmit = async (data: FormData) => {
        await createPoll(data, token)
    }

    useEffect(()=>{
    if (error){
          showPollError(error)
        }
    if (poll.id){
            router.push(`dashboard/edit/poll/${poll.id}`)
        }
    },[error,poll,router])

    useEffect(()=>{
        if( selectedDay !== null){
            setValue("time_limit_days",selectedDay)
        }

    },[selectedDay,setValue])

    return (
        <>
            <Button onClick={() => setOpenModal(true)}>Toggle modal</Button>
            <Modal show={openModal} size="3xl" className="text-gray-900" onClose={onCloseModal} popup>
                <ModalHeader />
                <ModalBody>
                    <div className="bg-gray-100 h-auto min-w-95/100 rounded-xl px-4 mx-auto justify-center ">
                        <form id="poll" onSubmit={handleSubmit(onSubmit)} className="mx-auto p-4">
                            <div className="grid grid-cols-1 grid-rows-4 sm:grid-cols-3 sm:grid-rows-2 gap-x-4 gap-y-0">
                                <div className="sm:col-span-2 items-center ">
                                    <div className="mb-2 block">
                                        <Label className="text-md" htmlFor="name">Poll Name</Label>
                                    </div>
                                    <TextInput id="name" type="text" placeholder="Name/Question/Instruction/Request..." required shadow {...register("name")} />
                                    <p className="text-red-500">{errors.name?.message}</p>
                                </div>
                                <div className="sm:col-start-3">
                                    <div className="mb-2 block">
                                        <Label className="text-md" htmlFor="time_limit_days">Poll Validity in Days</Label>
                                    </div>
                                    <Dropdown id="time_limit_days" color="alternative" label={selectedDay ? selectedDay : "time_limit_days"} className="max-h-48 overflow-y-auto w-full" dismissOnClick={true}>
                                        {days.map((day, index) => {
                                            return (
                                                <DropdownItem className="bg-gray-50 hover:bg-gray-100"
                                                    onClick={() => setSelectedDay(day)}
                                                    key={index}>{day}</DropdownItem>
                                            )
                                        })}

                                    </Dropdown>
                                     <p className="text-red-500">{errors.time_limit_days?.message}</p>
                                </div>
                                <div className="sm:col-span-full sm:row-start-2">
                                    <div className="mb-2 block">
                                        <Label className="text-md" htmlFor="description">Description</Label>
                                    </div>
                                    <Textarea className="overflow-y-auto" id="description" rows={2} placeholder="Provide additional information (optional)" shadow {...register("description")} />
                                    <p className="text-red-500">{errors.description?.message}</p>
                                </div>
                            </div>
                        </form>
                    </div>

                </ModalBody>
                <ModalFooter className="-mt-5">
                    <div className="flex justify-center space-x-4 w-full">
                        <Button color="red" className="shadow-lg hover:shadow-xl" onClick={onCloseModal}>Cancel</Button>
                        <Button color="cyan" form="poll" className="shadow-lg hover:shadow-xl"  type="submit">Create</Button>
                    </div>
                </ModalFooter>
            </Modal>
        </>
    );
}

export default PollCreateModal
