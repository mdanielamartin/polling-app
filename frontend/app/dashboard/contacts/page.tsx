import { Checkbox, Tabs, TabItem, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button, ButtonGroup } from "flowbite-react";
import { HiUserAdd } from "react-icons/hi";
import { FaTrash, FaClipboardList } from "react-icons/fa";
import { MdFormatListBulletedAdd } from "react-icons/md";
const Contacts = () => {


    return (
        <div className="flex flex-cols min-h-screen w-full justify-center m-2">
            <Tabs className="min-w-8/10 max-w-9/10" aria-label="Pills" variant="pills">
                <TabItem active title="All">
                    <div className="flex place-content-between mb-5">
                        <Button color="light"><HiUserAdd className="mr-2 text-xl" />Add Contact</Button>
                        <Button color="light"><FaClipboardList className="mr-2 text-xl" />Add Selected to List</Button>
                        <Button color="light"><MdFormatListBulletedAdd className="mr-2 text-xl" />Create New List</Button>
                        <Button color="red"><FaTrash className="mr-2 text-xl"/> Delete Selected</Button>
                    </div>
                    <Table className="w-full shadow-md  rounded-lg">
                        <TableHead className="bg-gray-500">
                            <TableRow className="bg-gray-500">
                                <TableHeadCell>
                                    <Checkbox />
                                </TableHeadCell>
                                <TableHeadCell className="font-bold text-center text-lg text-black normal-case bg-gray-200 ">Email</TableHeadCell>
                                <TableHeadCell className="font-bold text-center text-lg text-black normal-case bg-gray-200 ">
                                    <span className="sr-only bg-gray-200">Actions</span>
                                </TableHeadCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="divide-y">
                            <TableRow className="bg-white hover:bg-gray-100">
                                <TableCell>
                                    <Checkbox />
                                </TableCell>
                                <TableCell className="whitespace-nowrap font-normal text-md text-start font-medium text-black ">
                                    myemail@gmail.com
                                </TableCell>
                                <TableCell className="text-end">    <ButtonGroup>
                                    <Button color="red">Delete</Button>
                                    <Button color="alternative">Add to List</Button>
                                    <Button color="alternative">Edit</Button>
                                </ButtonGroup></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TabItem>
                <TabItem title="Work">
                                       <Table className="w-full shadow-md bg-gray-500 rounded-lg">
                        <TableHead className="bg-gray-500">
                            <TableRow className="bg-gray-500">
                                <TableHeadCell>
                                    <Checkbox />
                                </TableHeadCell>
                                <TableHeadCell className="font-bold text-start text-lg text-black normal-case">Email</TableHeadCell>
                                <TableHeadCell>
                                    <span className="sr-only">Actions</span>
                                </TableHeadCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="divide-y">
                            <TableRow className="bg-white hover:bg-gray-100">
                                <TableCell>
                                    <Checkbox />
                                </TableCell>
                                <TableCell className="whitespace-nowrap font-normal text-md text-start font-medium text-black ">
                                    myemail@gmail.com
                                </TableCell>
                                <TableCell className="text-end">    <ButtonGroup>
                                    <Button color="red">Remove</Button>
                                    <Button color="alternative">Edit</Button>
                                </ButtonGroup></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TabItem>
                <TabItem title="Friends">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Friends</p>
                </TabItem>
            </Tabs>
        </div>
    );
}

export default Contacts
