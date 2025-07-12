import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import Link from "next/link";

import { FcPieChart } from "react-icons/fc";


const UserNavbar = () =>{
  return (
    <Navbar fluid rounded>
      <NavbarBrand as={Link} href="https://flowbite-react.com">
        <FcPieChart className="text-6xl" />
        <span className="self-center whitespace-nowrap text-2xl font-bold">Polling App</span>
      </NavbarBrand>
      <NavbarToggle />
      <NavbarCollapse className="mx-2 text-md">
        <NavbarLink as={Link} href="/dashboard" active >
          Dashboard
        </NavbarLink>
        <NavbarLink as={Link} href="/dashboard/active">
          Active Polls
        </NavbarLink>
        <NavbarLink as={Link} href="/dashboard/completed">Results</NavbarLink>
        <NavbarLink as={Link} href="/dashboard/contacts">Contacts</NavbarLink>
        <NavbarLink as={Link} href="/login">Logout</NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}

export default UserNavbar
