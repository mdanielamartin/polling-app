"use client"
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation'
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup";
import useUserStore from "../../src/store/userStore";
import { showLoginError } from "../../utils/alerts";
import { useEffect } from "react";

const Login = () => {
  const router = useRouter()
  const {login,error} = useUserStore()
  const loginSchema = yup.object().shape({
    email: yup.string().email("Invalid email format").required("Please type your email address"),
    password: yup.string().min(8, "Password must be at least 8 characters long.").required("A password is required"),
  })

  interface FormData {
    email: string;
    password: string;
  }

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(loginSchema) })

  const onSubmit = async (data: FormData) => {
    const status = await login(data)
    if (status){
      router.push("dashboard/")
  }
}

useEffect(()=>{
  if (error){
      showLoginError(error)
    }
},[error])
  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-md max-w-lg w-full flex-col gap-4 rounded-md p-6">
        <h1 className="font-bold text-2xl text-center">LOGIN</h1>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email1">Your email</Label>
          </div>
          <TextInput id="email1" type="email" placeholder="youremail@domain.com" required {...register("email")} />
          <p className="text-red-500">{errors.email?.message}</p>
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password1">Your password</Label>
          </div>
          <TextInput id="password1" type="password" required {...register("password")} />
          <p className="text-red-500">{errors.password?.message}</p>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember">Remember me</Label>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}

export default Login
