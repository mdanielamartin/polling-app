"use client";
import { useForm } from "react-hook-form";
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup";
import { Label, Dropdown, DropdownItem, TextInput, Textarea, Button } from "flowbite-react"
import { useState, useEffect} from "react"
import usePollStore from "../store/pollStore";
import useUserStore from "../store/userStore";


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
       <div className="bg-gray-100 rounded-xl px-4 py-6 mx-auto my-4 w-full max-w-5xl">
  <form className="mx-auto p-4" onSubmit={handleSubmit(onSubmit)}>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-6">

      <div className="md:col-span-3">
        <Label className="text-md mb-2 block" htmlFor="name">
          Poll Name
        </Label>
        <TextInput id="name" type="text" required {...register("name")} />
        <p className="text-red-500 text-sm mt-1">{errors.name?.message}</p>
      </div>


      <div className="md:col-span-1 flex flex-col justify-start">
        <Label className="text-md mb-2 block" htmlFor="duration">
          Duration
        </Label>
        <Dropdown
          color="alternative"
          label={selectedDay || "Days"}
          className="max-h-40 w-full overflow-y-auto"
          dismissOnClick
          placement="bottom"
        >
          {days.map((day, index) => (
            <DropdownItem
              key={index}
              className="bg-gray-50 hover:bg-gray-100"
              onClick={() => setSelectedDay(day)}
            >
              {day}
            </DropdownItem>
          ))}
        </Dropdown>
        <p className="text-red-500 text-sm mt-1">{errors.time_limit_days?.message}</p>
      </div>

      <div className="md:col-span-4">
        <Label className="text-md mb-2 block" htmlFor="description">
          Description
        </Label>
        <Textarea
          id="description"
          rows={3}
          className="overflow-y-auto w-full"
          {...register("description")}
        />
        <p className="text-red-500 text-sm mt-1">{errors.description?.message}</p>
      </div>


      <div className="md:col-span-4 flex items-cemter w-full">
        <Button
          color="alternative"
          className="w-full flex h-15  shadow-lg hover:shadow-xl"
          type="submit"
        >
          Update
        </Button>
      </div>
    </div>
  </form>
</div>

    )
}

export default EditPollTab
