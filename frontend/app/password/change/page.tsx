"use client"
export const dynamic  = "force-dynamic"
import { Suspense} from "react";
import ChangePasswordForm from "../../../components/ChangePasswordForm";

const ChangePassword = ()=> {
  return (
   <Suspense>
    <ChangePasswordForm/>
   </Suspense>
  );
}

export default ChangePassword
