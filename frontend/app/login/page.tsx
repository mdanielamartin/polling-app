"use client"
import { Button,Label, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation'
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup";
import useUserStore from "../../store/userStore";
import { showLoginError } from "../../utils/alerts";
import { useEffect } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";

const Login = () => {
  const router = useRouter()
  const {login,error, isLoading} = useUserStore()
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

 if (isLoading){

    return (
      <LoadingSpinner/>

    )
  }
  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-md w-full flex-col gap-4 rounded-2xl py-10 px-8 bg-gray-50 shadow-2xl">
        <h1 className="text-4xl text-center font-extrabold mb-4 text-cyan-700 ">LOGIN</h1>
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
          <TextInput id="password1" type="password" placeholder="Minimun 8 characters long..." required {...register("password")} />
          <p className="text-red-500">{errors.password?.message}</p>
          <a className="text-cyan-700 text-xs hover:underline" href="/password/reset-request">Did you forget your password?</a>
        </div>
        <Button type="submit" color="cyan" className="font-bold">LOGIN</Button>
      </form>
    </div>
  );
}

export default Login
