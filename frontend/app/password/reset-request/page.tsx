"use client"
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation'
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup";
import useUserStore from "../../../store/userStore";

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
      <div className="flex h-screen items-center justify-center">
        <Spinner/>
      </div>

    )
  }

  return (
    <div className="flex h-screen items-center justify-center">

    <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-md  w-full p-6 flex-col gap-4">
         <h1 className="font-bold text-2xl text-center">RESET PASSWORD FORM</h1>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email2">Email</Label>
        </div>
        <TextInput id="email2" type="email" placeholder="name@flowbite.com" required shadow {...register("email")} />
        <p className="text-gray-500 text-xs">If your email address is registered you will be receiving an email with instructions to reset your password.</p>
        <p className="text-red-500">{errors.email?.message}</p>
      </div>
      <Button type="submit">Request Password Change</Button>
    </form>
    </div>
  );
}

export default ResetRequest
