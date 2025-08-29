"use client"
export const dynamic  = "force-dynamic"
import { Suspense} from "react";
import useUserStore from "../../../store/userStore";
import ChangePasswordForm from "../../../components/ChangePasswordForm";
import LoadingSpinner from "../../../components/LoadingSpinner";

const ChangePassword = ()=> {
  const {isLoading} = useUserStore()
  if (isLoading){
    return (
      <LoadingSpinner/>
    )
  }

  return (
   <Suspense>
    <ChangePasswordForm/>
   </Suspense>
  );
}

export default ChangePassword
