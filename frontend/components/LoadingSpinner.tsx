"use client"
import { Spinner } from "flowbite-react"



const LoadingSpinner = ()=>{
return (
    <div className="flex min-h-screen w-full  items-center justify-center m-2">
        <div>
        <Spinner color="info" size="2xl" />
          <h4 className="text-center text-2xl font-bold text-cyan-700 mt-1.5">Loading...</h4>
        </div>
      </div>
)



}

export default LoadingSpinner
