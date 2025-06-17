
"use client"
import { FaAddressBook, FaCircleUser, FaSquarePollVertical } from "react-icons/fa6";
import { MdOutlineAddchart } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { HiOutlineStatusOnline } from "react-icons/hi";

const Dashboard = () => {

    return (
        <div className="flex min-h-screen items-center justify-center m-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 sm:gap-8 w-full max-w-4xl">
                <div className="bg-green-400 h-40 rounded-lg flex flex-col items-center justify-center hover:bg-green-600 p-3 cursor-pointer">
                    <h1 className="font-bold text-2xl text-center">New Poll</h1>
                    <div className="block p-5"><MdOutlineAddchart className="text-5xl" /></div>
                </div>

                <div className="bg-yellow-400 h-40 rounded-lg flex flex-col items-center justify-center hover:bg-yellow-600 p-3 cursor-pointer">
                    <h1 className="font-bold text-2xl text-center">Edit Polls</h1>
                    <div className="block p-5"><FaEdit className="text-5xl" /></div>
                </div>

                <div className="bg-purple-400 h-40 rounded-lg flex flex-col items-center justify-center hover:bg-purple-600 p-3 cursor-pointer">
                    <h1 className="font-bold text-2xl text-center">Active Polls</h1>
                    <div className="block p-5"><HiOutlineStatusOnline className="text-5xl" /></div>
                </div>

                <div className="bg-sky-400 h-40 rounded-lg flex flex-col items-center justify-center hover:bg-sky-600 p-3 cursor-pointer">
                    <h1 className="font-bold text-2xl text-center">Completed Polls</h1>
                    <div className="block p-5"><FaSquarePollVertical className="text-5xl" /></div>
                </div>

                <div className="bg-pink-400 h-40 rounded-lg flex flex-col items-center justify-center hover:bg-pink-600 p-3 cursor-pointer">
                    <h1 className="font-bold text-2xl text-center">My Contacts</h1>
                    <div className="block p-5"><FaAddressBook className="text-5xl" /></div>
                </div>

                <div className="bg-gray-400 h-40 rounded-lg flex flex-col items-center justify-center hover:bg-gray-600 p-3 cursor-pointer">
                    <h1 className="font-bold text-2xl text-center">My Account</h1>
                    <div className="block p-5"><FaCircleUser className="text-5xl" /></div>
                </div>
            </div>

        </div>

    );
}

export default Dashboard
