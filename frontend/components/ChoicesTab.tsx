"use client"
import { List, ListItem, TextInput, Textarea, Button, Label } from "flowbite-react";
import { FaTrash } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { useForm } from "react-hook-form";
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";


const ChoicesTab = () => {

    const [editing, setEditing] = useState<number | null>(null)

    const choiceSchema = yup.object().shape({
        title: yup.string().min(1).max(50, "Title cannot exceed 50 characters").required("Choice must have a title"),
        description: yup.string().max(255, "Description cannot exceed 500 characters.")
    })

    const sample = [{ id: 1, title: "A title", description: "" }, { id: 2, title: "Second option", description: "A description" }]
    interface FormData {
        title: string;
        description: string;
    }

    const { register, reset, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(choiceSchema) })
    const {
        register: registerEdit,
        handleSubmit: handleSubmitEdit,
        reset: resetEdit,
        formState: { errors: editErrors }
    } = useForm({ resolver: yupResolver(choiceSchema) });

    const onSubmit = (data: FormData) => {
        reset()
        console.log("Form Data:", data);
        setEditing(null)
    };

    const editingRequest = (data: FormData, id: number) => {
        setEditing(id)
        resetEdit({ title: data.title, description: data.description })

    }

    return (

        <div className="flex flex-col justify-center">
            <div className="bg-gray-100 h-auto w-full rounded-xl px-4 mx-auto border">
                <form onSubmit={handleSubmit(onSubmit)} className="mx-auto p-4">
                    <div className="grid grid-cols-1 grid-rows-3 sm:grid-cols-1 sm:grid-rows-3 gap-x-4 gap-y-0">
                        <div className=" row-start-1 items-center ">
                            <div className="mb-2 block">
                                <Label className="text-md" htmlFor="title">Title</Label>
                            </div>
                            <TextInput id="title" type="text" placeholder="Main title for your choice..." required {...register("title")} />
                            <p className="text-red-500">{errors.title?.message}</p>

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

                    {sample.map((item) => (

                        item.id === editing ?
                            <ListItem key={item.id} className="text-black bg-stone-50 hover:bg-stone-100 rounded-lg border pl-4 py-5 border items-center justify-center flex">
                                <form onSubmit={handleSubmitEdit(onSubmit)} className=" grid md:grid-cols-5 grid-cols-1 gap-3 mx-auto p-4 w-full flex items-center justify-center place-content-between">
                                    <div className="md:col-span-4">
                                        <div className="items-center">
                                            <div className="block">
                                                <Label className="text-md" htmlFor="title">Title</Label>
                                            </div>
                                            <TextInput id="title" type="text" placeholder="Main title for your choice..." required {...registerEdit("title")} />
                                            <p className="text-red-500">{editErrors.title?.message}</p>

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

                            <ListItem key={item.id} className="text-2xl place-content-between items-center text-bold text-black bg-stone-50 hover:bg-stone-100 rounded-lg border pl-4 py-5 border flex">
                                <div className="flex">
                                    <div className="text-6xl text-extrabold text-cyan-400 mr-4">1</div>
                                    <div className="flex flex-col">
                                        <div className="text-2xl font-bold text-black">{item.title}</div>
                                        <p className="text-gray-400 text-md">{item.description}</p>


                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between w-1/7 sm:w-auto gap-2 mr-5">
                                    <Button color="red"><FaTrash className="text-lg" /></Button>
                                    <Button color="yellow" onClick={() => editingRequest(item, item.id)}><FaEdit className="text-lg" /></Button>
                                </div>
                            </ListItem>

                    ))}



                </List>
            </div>
        </div>
    )
}

export default ChoicesTab
