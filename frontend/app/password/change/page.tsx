"use client"
export const dynamic  = "force-dynamic"
import {  Spinner} from "flowbite-react";
import { Suspense} from "react";
import useUserStore from "../../../store/userStore";
import ChangePasswordForm from "../../../components/ChangePasswordForm";

const ChangePassword = ()=> {
  const {isLoading} = useUserStore()
  if (isLoading){
    return (
      <Spinner/>
    )
  }

  return (
   <Suspense>
    <ChangePasswordForm/>
   </Suspense>
  );
}

export default ChangePassword
