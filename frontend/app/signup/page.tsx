
"use client"
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup";

const SignUp = ()=> {

    const signupSchema = yup.object().shape({

        email: yup.string().email("Invalid email format").required("Please type your email address"),
        password: yup.string().min(8, "Password must be at least 8 characters long.").required("A password is required"),
        passwordConfirm: yup.string().oneOf([yup.ref("password")],"Passwords must match").required("Please retype your password to register")
    })
    interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}
    const {register, handleSubmit, formState:{errors}} = useForm({resolver: yupResolver(signupSchema)})


    const onSubmit = (data: FormData) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="flex h-screen items-center justify-center">

    <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-md max-w-lg w-full p-6 flex-col gap-4">
         <h1 className="font-bold text-2xl text-center">REGISTER</h1>
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
        <TextInput id="password2" type="password" required shadow {...register("password")}/>
        <p className="text-red-500">{errors.password?.message}</p>
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="repeat-password">Repeat password</Label>
        </div>
        <TextInput id="repeat-password" type="password" required shadow {...register("passwordConfirm")} />
        <p className="text-red-500">{errors.passwordConfirm?.message}</p>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="agree" />
        <Label htmlFor="agree" className="flex">
          I agree with the&nbsp;
          <Link href="#" className="text-cyan-600 hover:underline dark:text-cyan-500">
            terms and conditions
          </Link>
        </Label>
      </div>
      <Button type="submit">Register new account</Button>
    </form>
    </div>
  );
}

export default SignUp
