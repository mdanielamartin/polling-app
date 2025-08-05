"use client"
import { Button,Label, TextInput } from "flowbite-react";

import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation'
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup";


const ChangePassword = ()=> {

    const router = useRouter()
    const passwordSchema = yup.object().shape({
        password: yup.string().min(3, "Password must be at least 8 characters long.").required("A password is required"),
        passwordConfirm: yup.string().oneOf([yup.ref("password")],"Passwords must match").required("Please retype your password to register")
    })
    interface FormData {
  password: string;
  confirmPassword: string;
}
    const {register, handleSubmit, formState:{errors}} = useForm({resolver: yupResolver(passwordSchema)})


    const onSubmit = async (data: FormData) => {
        console.log(data)
  }


  return (
    <div className="flex h-screen items-center justify-center">

    <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-md  w-full p-6 flex-col gap-4">
         <h1 className="font-bold text-2xl text-center">NEW PASSWORD</h1>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="password2">New password</Label>
        </div>
        <TextInput id="password2" type="password" required shadow {...register("password")}/>
        <p className="text-red-500">{errors.password?.message}</p>
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="repeat-password">Repeat new password</Label>
        </div>
        <TextInput id="repeat-password" type="password" required shadow {...register("passwordConfirm")} />
        <p className="text-red-500">{errors.passwordConfirm?.message}</p>
      </div>
      <Button type="submit">Change Password</Button>
    </form>
    </div>
  );
}

export default ChangePassword
