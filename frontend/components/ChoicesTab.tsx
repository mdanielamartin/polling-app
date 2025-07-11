"use client"
import { List, ListItem, TextInput, Textarea, Button, Label } from "flowbite-react";
import { FaTrash } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { useForm } from "react-hook-form";
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import useChoiceStore from "../store/choiceStore";
import useUserStore from "../store/userStore";
import { useParams } from "next/navigation";

const ChoicesTab = () => {

    const params = useParams()
    const slug = Number(params.slug)

    const [editing, setEditing] = useState<number | null>(null)
    const {choices, getChoices, addChoice, updateChoice, deleteChoice} = useChoiceStore()
    const {token} = useUserStore()

    const choiceSchema = yup.object().shape({
        name: yup.string().min(1).max(50, "name cannot exceed 50 characters").required("Choice must have a name"),
        description: yup.string().max(255, "Description cannot exceed 500 characters.")
    })

    interface FormData {
        name: string;
        description: string;
    }


    const { register, reset, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(choiceSchema) })
    const {
        register: registerEdit,
        handleSubmit: handleSubmitEdit,
        reset: resetEdit,
        formState: { errors: editErrors },
        getValues
    } = useForm({ resolver: yupResolver(choiceSchema) });

    const onSubmit = async(data: FormData) => {
        await addChoice(data,token, slug)
        reset()
        setEditing(null)
    };

    const onSubmitEdit = async(data: FormData, id: number) =>{
        const updateData = {...data,id:id}
        await updateChoice(updateData,token,slug)
        reset()
        setEditing(null)
    }

    const editingRequest = (data:   FormData, id: number) => {
        setEditing(id)
        resetEdit({ name: data.name, description: data.description })
    }
    const deleteChoiceButton = async (id:number)=>{
        await deleteChoice(id,token,slug)
    }

    const onLoad = async ()=>{
        await getChoices(slug,token)
    }
    useEffect(()=>{
        onLoad()
    },[])

    return (

        <div className="flex flex-col justify-center">
            <div className="bg-gray-100 h-auto w-full rounded-xl px-4 mx-auto border">
                <form onSubmit={handleSubmit(onSubmit)} className="mx-auto p-4">
                    <div className="grid grid-cols-1 grid-rows-3 sm:grid-cols-1 sm:grid-rows-3 gap-x-4 gap-y-0">
                        <div className=" row-start-1 items-center ">
                            <div className="mb-2 block">
                                <Label className="text-md" htmlFor="name">Name/Title</Label>
                            </div>
                            <TextInput id="name" type="text" placeholder="Main name for your choice..." required {...register("name")} />
                            <p className="text-red-500">{errors.name?.message}</p>

                        </div>
                        <div className="row-start-2">
                            <div className="mb-2 block">
                                <Label className="text-md" htmlFor="description">Description (optional)</Label>
                            </div>
                            <Textarea className="overflow-y-auto" id="description" rows={2} placeholder="You may provide additional information..." {...register("description")} />
                            <p className="text-red-500">{errors.description?.message}</p>
                        </div>
                        <div className="sm:col-start-1 sm:row-start-3 flex flex-col justify-center h-full">
                            <Button color="alternative" className="w-full flex h-15 shadow-lg hover:shadow-xl" type="submit">Add Choice</Button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="bg-white h-auto w-full rounded-xl mx-auto  my-4 justify-center">
                <List className="list-none">

                    {choices?.map((choice) => (

                        choice.id === editing ?
                            <ListItem key={choice.id} className="text-black bg-stone-50 hover:bg-stone-100 rounded-lg border pl-4 py-5 border items-center justify-center flex">
                                <form onSubmit={handleSubmitEdit(()=>onSubmitEdit(getValues(),choice.id))} className=" grid md:grid-cols-5 grid-cols-1 gap-3 mx-auto p-4 w-full flex items-center justify-center place-content-between">
                                    <div className="md:col-span-4">
                                        <div className="items-center">
                                            <div className="block">
                                                <Label className="text-md" htmlFor="name">Name/Title</Label>
                                            </div>
                                            <TextInput id="name" type="text" placeholder="Main name for your choice..." required {...registerEdit("name")} />
                                            <p className="text-red-500">{editErrors.name?.message}</p>

                                        </div>
                                        <div className="row-start-2">
                                            <div className="mb-2 block">
                                                <Label className="text-md" htmlFor="description">Description (optional)</Label>
                                            </div>
                                            <Textarea className="overflow-y-auto" id="description" rows={2} placeholder="You may provide additional information..." {...registerEdit("description")} />
                                            <p className="text-red-500">{editErrors.description?.message}</p>
                                        </div>
                                    </div>
                                        <div className="justify-center items-center md:col-span-1">
                                            <div className="mx-auto flex space-x-2 justify-end">
                                             <Button color="red" className="shadow-lg hover:shadow-xl" onClick={()=>setEditing(null)}>Cancel</Button>
                                                <Button color="yellow" className="shadow-lg hover:shadow-xl" type="submit">Edit</Button>
                                            </div>
                                        </div>
                                </form>

                            </ListItem>

                            :

                            <ListItem key={choice.id} className="text-2xl place-content-between items-center text-bold text-black bg-stone-50 hover:bg-stone-100 rounded-lg border pl-4 py-5 border flex">
                                <div className="flex">
                                    <div className="text-6xl text-extrabold text-cyan-400 mr-4">1</div>
                                    <div className="flex flex-col">
                                        <div className="text-2xl font-bold text-black">{choice.name}</div>
                                        <p className="text-gray-400 text-md">{choice.description}</p>


                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between w-1/7 sm:w-auto gap-2 mr-5">
                                    <Button color="red" onClick={()=>deleteChoiceButton(choice.id)}><FaTrash className="text-lg" /></Button>
                                    <Button color="yellow" onClick={() => editingRequest(choice, choice.id)}><FaEdit className="text-lg" /></Button>
                                </div>
                            </ListItem>

                    ))}



                </List>
            </div>
        </div>
    )
}

export default ChoicesTab
