"use client"
import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle, Button} from "flowbite-react";
import Link from "next/link";
import { FcPieChart } from "react-icons/fc";
import { useRouter } from "next/navigation";
import useUserStore from "../store/userStore";



const UserNavbar = () => {
  const router = useRouter()
  const { logout } = useUserStore()

  const logoutButton = () => {
    logout()
    router.push("/login")

  }
  return (

    <Navbar fluid rounded className="items-center justify-center">
      <NavbarBrand as={Link} href="/">
        <FcPieChart className="text-6xl" />
        <span className="self-center whitespace-nowrap text-2xl font-bold">Polling App</span>
      </NavbarBrand>
      <NavbarToggle />
      <NavbarCollapse className="mx-2 text-md">
        <NavbarLink onClick={() => router.push("/dashboard")}>
          Dashboard
        </NavbarLink>
        <NavbarLink as={Link} href="/dashboard/live">
          Active Polls
        </NavbarLink>
        <NavbarLink as={Link} href="/dashboard/completed">Results</NavbarLink>
        <NavbarLink as={Link} href="/dashboard/contacts">Contacts</NavbarLink>
        <Button onClick={logoutButton} size="xs" className="bg-red-700 rounded-xl text-white hover:bg-red-800 shadow-md">Logout</Button>
      </NavbarCollapse>
    </Navbar>
  );
}

export default UserNavbar
