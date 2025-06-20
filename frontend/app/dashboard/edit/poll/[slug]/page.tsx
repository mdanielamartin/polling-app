
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeadCell, Checkbox, List, ListItem, DropdownItem, Dropdown, TextInput, Textarea, Button, Label, Tabs, TabItem } from "flowbite-react";
import { FaTrash, FaEdit } from "react-icons/fa";
const EditPoll = () => {

    const days = [...Array(30)].map((_, i) => i + 1)

    return (
        <div className="m-3">

            <Tabs aria-label="Pills" variant="pills">
                <TabItem active title="Choices">
                    <div className="flex flex-col justify-center">
                        <div className="bg-gray-100 h-auto w-full rounded-xl px-4 mx-auto border">
                            <form className="mx-auto p-4">
                                <div className="grid grid-cols-1 grid-rows-3 sm:grid-cols-1 sm:grid-rows-3 gap-x-4 gap-y-0">
                                    <div className=" row-start-1 items-center ">
                                        <div className="mb-2 block">
                                            <Label className="text-md" htmlFor="title">Title</Label>
                                        </div>
                                        <TextInput id="name" type="text" value={"Burger King"} placeholder="name@flowbite.com" required />
                                    </div>

                                    <div className="row-start-2">
                                        <div className="mb-2 block">
                                            <Label className="text-md" htmlFor="description">Description (optional)</Label>
                                        </div>
                                        <Textarea className="overflow-y-auto" id="description" rows={2} value={"These are the places I have looked so far. Please pick one of your liking."} placeholder="Provide additional information (optional)" />
                                    </div>
                                    <div className="sm:col-start-1 sm:row-start-3 flex flex-col justify-center h-full">
                                        <Button color="alternative" className="w-full flex h-15 shadow-lg hover:shadow-xl" type="submit">Add Choice</Button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="bg-white h-auto w-full rounded-xl mx-auto  my-4 justify-center">
                            <List className="list-none">
                                <ListItem className="text-2xl place-content-between items-center text-bold text-black bg-stone-50 hover:bg-stone-100 rounded-lg border pl-4 py-5 border flex">
                                    <div className="flex">
                                        <div className="text-6xl text-extrabold text-cyan-400 mr-4">1</div>
                                        <div className="flex flex-col">
                                            <div className="text-2xl font-bold text-black">Burger King</div>
                                            <p className="text-gray-400 text-md">Located near the park</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between w-1/7 sm:w-auto gap-2 mr-5">
                                        <Button color="red"><FaTrash className="text-lg" /></Button>
                                        <Button color="yellow"><FaEdit className="text-lg" /></Button>
                                    </div>
                                </ListItem>
                            </List>
                        </div>
                    </div>

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
                    <div className="bg-gray-100 h-auto min-w-95/100 rounded-xl px-4 py- mx-auto  my-4 justify-center ">
                        <form className="mx-auto p-4">
                            <div className="grid grid-cols-1 grid-rows-4 sm:grid-cols-4 sm:grid-rows-2 gap-x-4 gap-y-0">
                                <div className="sm:col-span-3 items-center ">
                                    <div className="mb-2 block">
                                        <Label className="text-md" htmlFor="name">Poll Name</Label>
                                    </div>
                                    <TextInput id="name" type="text" value={"Birthday Party Places"} placeholder="name@flowbite.com" required />
                                </div>
                                <div className="sm:col-start-4">
                                    <div className="mb-2 block">
                                        <Label className="text-md" htmlFor="name">Poll Validity in Days</Label>
                                    </div>
                                    <Dropdown color="alternative" label="Duration" value={4} className="max-h-48 overflow-y-auto w-full" dismissOnClick={false}>
                                        {days.map((day, index) => {
                                            return (
                                                <DropdownItem className="bg-gray-50 hover:bg-gray-100" key={index}>{day}</DropdownItem>
                                            )
                                        })}
                                    </Dropdown>
                                </div>
                                <div className="sm:col-span-3 sm:row-start-2">
                                    <div className="mb-2 block">
                                        <Label className="text-md" htmlFor="description">Description</Label>
                                    </div>
                                    <Textarea className="overflow-y-auto" id="description" rows={2} value={"These are the places I have looked so far. Please pick one of your liking."} placeholder="Provide additional information (optional)" />
                                </div>
                                <div className="sm:col-start-4 sm:row-start-2 flex flex-col justify-end h-full">
                                    <Button color="alternative" className="w-full h-15 shadow-lg hover:shadow-xl" type="submit">Update</Button>
                                </div>
                            </div>
                        </form>
                    </div>

                </TabItem>
            </Tabs>
        </div>
    );
}

export default EditPoll
