
"use client"
import { Button, Label, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation'
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup";
import useUserStore from "../../store/userStore";
import { showRegistrationError } from "../../utils/alerts";
import { useEffect } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";

const SignUp = ()=> {
    const {signup,error,isLoading} = useUserStore()
    const router = useRouter()
    const signupSchema = yup.object().shape({

        email: yup.string().email("Invalid email format").required("Please type your email address"),
        password: yup.string().min(3, "Password must be at least 8 characters long.").required("A password is required"),
        passwordConfirm: yup.string().oneOf([yup.ref("password")],"Passwords must match").required("Please retype your password to register")
    })
    interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}
    const {register, handleSubmit, formState:{errors}} = useForm({resolver: yupResolver(signupSchema)})


    const onSubmit = async (data: FormData) => {
      const status = await signup(data)
      if (status){
        router.push("login/")
    }
  }

  useEffect(()=>{
    if (error){
        showRegistrationError(error)
      }
  },[error])

  if (isLoading){

    return (
    <LoadingSpinner/>
    )
  }
  return (
    <div className="flex h-screen items-center justify-center">

    <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-md  w-full  flex-col gap-4  rounded-2xl py-10 px-8 bg-gray-50 shadow-2xl">
         <h1 className="text-4xl text-center font-extrabold mb-4 text-cyan-700 ">REGISTER</h1>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email2">Your email</Label>
        </div>
        <TextInput id="email2" type="email" placeholder="name@flowbite.com" required shadow {...register("email")} />
        <p className="text-red-500">{errors.email?.message}</p>

      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="password2">Your password</Label>
        </div>
        <TextInput id="password2" type="password" placeholder="Must be at least 8 characters long..."required shadow {...register("password")}/>
        <p className="text-red-500">{errors.password?.message}</p>
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="repeat-password">Repeat password</Label>
        </div>
        <TextInput id="repeat-password" type="password" placeholder="Passwords must match" required shadow {...register("passwordConfirm")} />
        <p className="text-red-500">{errors.passwordConfirm?.message}</p>
      </div>
      <Button type="submit" color="cyan" className="font-bold">SIGNUP</Button>
    </form>
    </div>
  );
}

export default SignUp
