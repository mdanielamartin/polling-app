"use client"
import { FaAddressBook, FaCircleUser, FaSquarePollVertical } from "react-icons/fa6";
import { Button } from "flowbite-react";
import { FaEdit } from "react-icons/fa";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { useRouter } from "next/navigation"

import PollCreateModal from "../../components/PollCreateModal";
const Dashboard = () => {
    const router = useRouter()
    return (
        <div className="flex min-h-screen items-start justify-center m-2">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 sm:gap-8 w-full max-w-4xl">
                <PollCreateModal />
                <Button color="alternative" onClick={() => router.push("/dashboard/edit")} className="h-35 rounded-2xl bg-stone-50 text-gray-100 flex flex-col items-center justify-center cursor-pointer shadow-md group hover:bg-gray-100 hover:text-blue-700 transition-colors">
                    <h1 className="font-bold text-2xl text-center group-hover:text-blue-700 transition-colors">Edit Polls</h1>
                    <div className="block p-5 group-hover:text-blue-700 transition-colors"><FaEdit className="text-5xl" /></div>
                </Button>
                <Button color="alternative" onClick={() => router.push("/dashboard/live")} className="h-35 rounded-2xl bg-stone-50 text-gray-100 flex flex-col items-center justify-center cursor-pointer shadow-md group hover:bg-gray-100 hover:text-blue-700 transition-colors">
                    <h1 className="font-bold text-2xl text-center group-hover:text-blue-700 transition-colors">Active Polls</h1>
                    <div className="block p-5 group-hover:text-blue-700 transition-colors"><HiOutlineStatusOnline className="text-5xl" /></div>
                </Button>

                <Button color="alternative" onClick={() => router.push("/dashboard/completed")} className="h-35 rounded-2xl bg-stone-50 text-gray-100 flex flex-col items-center justify-center cursor-pointer shadow-md group hover:bg-gray-100 hover:text-blue-700 transition-colors">
                    <h1 className="font-bold text-2xl text-center group-hover:text-blue-700 transition-colors">Results</h1>
                    <div className="block p-5 group-hover:text-blue-700 transition-colors"><FaSquarePollVertical className="text-5xl" /></div>
                </Button>

                <Button color="alternative" onClick={() => router.push("/dashboard/contacts")} className="h-35 rounded-2xl bg-stone-50 text-gray-100 flex flex-col items-center justify-center cursor-pointer shadow-md group hover:bg-gray-100 hover:text-blue-700 transition-colors">
                    <h1 className="font-bold text-2xl text-center group-hover:text-blue-700 transition-colors">Contacts</h1>
                    <div className="block p-5 group-hover:text-blue-700 transition-colors"><FaAddressBook className="text-5xl" /></div>
                </Button>

                <Button color="alternative" onClick={() => router.push("/dashboard/account")} className="h-35 rounded-2xl bg-stone-50 text-gray-100 flex flex-col items-center justify-center cursor-pointer shadow-md group hover:bg-gray-100 hover:text-blue-700 transition-colors">
                    <h1 className="font-bold text-2xl text-center group-hover:text-blue-700 transition-colors">Account</h1>
                    <div className="block p-5 group-hover:text-blue-700 transition-colors"><FaCircleUser className="text-5xl" /></div>
                </Button>
            </div>

        </div>

    );
}

export default Dashboard
