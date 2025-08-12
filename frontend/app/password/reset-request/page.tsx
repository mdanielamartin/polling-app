"use client"
import { Button, Label,TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation'
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup";
import useUserStore from "../../../store/userStore";
import LoadingSpinner from "../../../components/LoadingSpinner";

const ResetRequest = ()=> {

    const {isLoading, passwordChangeRequest} = useUserStore()
    const router = useRouter()
    const resetSchema = yup.object().shape({
        email: yup.string().email("Invalid email format").required("Please type your email address"),
    })
    interface FormData {
  email: string;
}
    const {register, handleSubmit, formState:{errors}} = useForm({resolver: yupResolver(resetSchema)})


    const onSubmit = async (data: FormData) => {
        const res = await passwordChangeRequest(data)
        if (res){
          router.push("confirm")
        }
    }

  if (isLoading){
    return(
   <LoadingSpinner/>

    )
  }

  return (
    <div className="flex h-screen items-center justify-center">

    <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-md w-full flex-col gap-4 rounded-2xl py-10 px-8 bg-gray-50 shadow-2xl">
         <h1 className="font-bold text-2xl text-center text-cyan-700">RESET PASSWORD</h1>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email2">Email</Label>
        </div>
        <TextInput id="email2" type="email" placeholder="name@flowbite.com" required shadow {...register("email")} />
        <p className="text-gray-500 text-xs">If your email address is registered you will be receiving an email with instructions to reset your password.</p>
        <p className="text-red-500">{errors.email?.message}</p>
      </div>
      <Button type="submit" className="w-full text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Request Password Change</Button>
    </form>
    </div>
  );
}

export default ResetRequest
