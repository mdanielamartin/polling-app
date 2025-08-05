"use client"
import useUserStore from "../../../store/userStore"
import { useState, useEffect } from "react"

const Account = () => {

    const { getUser } = useUserStore()
    const [user, setUser] = useState({ id: null, email: "" })


    useEffect(() => {
        const onLoad = async () => {
            const data = await getUser()
            setUser(data)
        }
        onLoad()
    }, [getUser])

    return (

        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Account Info</h2>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email:</label>
                <p className="mt-1 text-gray-900">{user.email || "Loading..."}</p>
            </div>

            <button
                type="button"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={() => {
                    console.log('Request password reset for:', user.email);
                }}
            >
                Request Password Reset
            </button>
        </div>



    )



}



export default Account
