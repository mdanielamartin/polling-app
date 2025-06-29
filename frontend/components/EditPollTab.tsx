"use client";
import { useForm } from "react-hook-form";
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup";
import { Label, Dropdown, DropdownItem, TextInput, Textarea, Button } from "flowbite-react"
import { useState, useEffect} from "react"
import usePollStore from "../src/store/pollStore";
import useUserStore from "../src/store/userStore";


const EditPollTab = () => {
    const [selectedDay, setSelectedDay] = useState(0)
    const days = [...Array(30)].map((_, i) => i + 1)
    const {poll, updatePoll} = usePollStore()
    const {token} = useUserStore()
    const pollSchema = yup.object().shape({

        name: yup.string().min(3, "Name must be at least 3 characters long").max(50, "Name must not exceed 50 characters").required("Poll must have a name/question or instruction"),
        time_limit_days: yup.number().min(1, "Polls minimum duration is 1 day").max(30, "Polls maximum duration is 30 days").required("Please specify the poll's duration"),
        description: yup.string().max(255, "Description cannot exceed 255 characters.")
    })

    interface FormData {
        id: number;
        name: string;
        time_limit_days: number;
        description: string;
    }

    const { register, setValue, reset, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(pollSchema) })

    const onSubmit = async (data: FormData) => {
        await updatePoll(data,token)
    };


    useEffect(() => {
        if (selectedDay !== null) {
            setValue("time_limit_days", selectedDay)
        }

    }, [selectedDay, setValue])

    useEffect(()=>{

        if (poll){
           const initialValues = {id:poll.id,name:poll.name,description:poll.description,time_limit_days:poll.time_limit_days}
            reset(initialValues)
            setSelectedDay(initialValues.time_limit_days)
        }

    },[reset,setSelectedDay,poll])

    return (
        <div className="bg-gray-100 h-auto min-w-95/100 rounded-xl px-4 py- mx-auto  my-4 justify-center ">
            <form className="mx-auto p-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 grid-rows-4 sm:grid-cols-4 sm:grid-rows-2 gap-x-4 gap-y-0">
                    <div className="sm:col-span-3 items-center ">
                        <div className="mb-2 block">
                            <Label className="text-md" htmlFor="name">Poll Name</Label>
                        </div>
                        <TextInput id="name" type="text"  required {...register("name")} />
                          <p className="text-red-500">{errors.name?.message}</p>
                    </div>
                    <div className="sm:col-start-4">
                        <div className="mb-2 block">
                            <Label className="text-md" htmlFor="name">Poll Validity in Days</Label>
                        </div>
                        <Dropdown color="alternative" label={selectedDay ? selectedDay : "Duration"} className="max-h-48 overflow-y-auto w-full" dismissOnClick={true}>
                            {days.map((day, index) => {
                                return (
                                    <DropdownItem onClick={() => setSelectedDay(day)} className="bg-gray-50 hover:bg-gray-100" key={index}>{day}</DropdownItem>
                                )
                            })}
                        </Dropdown>
                        <p className="text-red-500">{errors.time_limit_days?.message}</p>
                    </div>
                    <div className="sm:col-span-3 sm:row-start-2">
                        <div className="mb-2 block">
                            <Label className="text-md" htmlFor="description">Description</Label>
                        </div>
                        <Textarea className="overflow-y-auto" id="description" rows={2} {...register("description")} />
                        <p className="text-red-500">{errors.description?.message}</p>
                    </div>
                    <div className="sm:col-start-4 sm:row-start-2 flex flex-col justify-end h-full">
                        <Button color="alternative" className="w-full h-15 shadow-lg hover:shadow-xl" type="submit">Update</Button>
                    </div>
                </div>
            </form>
        </div>

    )
}

export default EditPollTab
