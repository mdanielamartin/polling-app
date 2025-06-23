
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeadCell, Checkbox, DropdownItem, Dropdown, Button, Tabs, TabItem } from "flowbite-react";
import ChoicesTab from "../../../../../components/ChoicesTab";
import EditPollTab from "../../../../../components/EditPollTab";
const EditPoll = () => {



    return (
        <div className="m-3">
            <Tabs aria-label="Pills" variant="pills">
                <TabItem active title="Choices">
                    <ChoicesTab/>
                </TabItem>
                <TabItem title="Pollee Assignments">

                    <Tabs aria-label="Pills" variant="fullWidth">
                        <TabItem title="Contacts & Contact Lists">
                            <div className="grid grid-cols-1 grid-rows-2 md:grid-cols-3  gap-4">
                                <div className=" md:col-start-3 row-start-1 flex flex-col justify-center">
                                    <Dropdown color="light" label="Assign Contact List to Poll" value={4} className="max-h-48 overflow-y-auto mb-4 py-2 mx-auto w-3/4 " dismissOnClick={false}>
                                        <DropdownItem className="bg-gray-50 hover:bg-gray-100"><Checkbox className="mr-2" /> Friends</DropdownItem>
                                        <DropdownItem className="bg-gray-50 hover:bg-gray-100"><Checkbox className="mr-2" /> Work</DropdownItem>
                                        <DropdownItem className="bg-gray-50 hover:bg-gray-100"><Checkbox className="mr-2" /> Family</DropdownItem>

                                    </Dropdown>
                                    <Button color="cyan" className="py-8 w-3/4 align-center mx-auto shadow-lg hover:shadow-xl">Assign Selection to Poll</Button>
                                </div>
                                <div className="md:col-span-2">
                                <Table className="w-full shadow-md  rounded-lg col-start-1 col-span-2">
                                    <TableHead className="bg-gray-500">
                                        <TableRow className="bg-gray-500">
                                            <TableHeadCell>
                                                <Checkbox />
                                            </TableHeadCell>
                                            <TableHeadCell className="font-bold text-center text-lg text-black normal-case bg-gray-200 ">Email</TableHeadCell>
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

                                        </TableRow>
                                    </TableBody>
                                </Table>
                                </div>
                            </div>
                        </TabItem>

                        <TabItem title="Pollees">
                             <div className="grid grid-cols-1 grid-rows-2 md:grid-cols-3  gap-4">
                                <div className=" md:col-start-3 row-start-1 flex flex-col justify-center">
                                    <Button color="cyan" className="py-8 w-3/4 align-center mx-auto shadow-lg hover:shadow-xl">Launch Poll</Button>
                                    <Button color="red" className="py-4 w-3/4 align-center mx-auto mt-4">Remove Selection</Button>
                                </div>
                                <div className="md:col-span-2">
                                <Table className="w-full shadow-md  rounded-lg">
                                    <TableHead className="bg-gray-500">
                                        <TableRow className="bg-gray-500">
                                            <TableHeadCell>
                                                <Checkbox />
                                            </TableHeadCell>
                                            <TableHeadCell className="font-bold text-center text-lg text-black normal-case bg-gray-200 ">Email</TableHeadCell>
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

                                        </TableRow>
                                    </TableBody>
                                </Table>
                                </div>
                            </div>
                        </TabItem>

                    </Tabs>

                </TabItem>

                <TabItem title="Poll Details">
                    <EditPollTab/>
                </TabItem>
            </Tabs>
        </div>
    );
}

export default EditPoll
