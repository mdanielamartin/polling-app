
import { DropdownItem, Dropdown, TextInput, Textarea, Button, Label } from "flowbite-react";

const EditPoll = () => {

    const days = [...Array(30)].map((_, i) => i + 1)
    return (
        <div className="flex min-h-screen w-full justify-center m-2">
            <div className="bg-gray-100 w-full h-auto rounded-xl px-4 mx-auto justify-center ">
                <form className="flex w-full flex-col gap-2  mx-auto p-4">
                    <div className="flex w-full items-center gap-2 justify-center mx-auto">
                        <div className="w-2/3">
                            <div className="mb-2 flex">
                                <Label className="text-md" htmlFor="name">Poll Name</Label>
                            </div>
                            <TextInput id="name" type="text" value={"Birthday Party Places"} placeholder="name@flowbite.com" required />
                        </div>
                        <div className="w-1/3">
                          <div className="mb-2 flex">
                                <Label className="text-md" htmlFor="name">Poll Validity in Days</Label>
                            </div>
                        <Dropdown label="Duration" value={4} className="max-h-48 overflow-y-auto w-full bg-gray-400 hover:bg-gray-500 " dismissOnClick={false}>
                            {days.map((day, index) => {
                                return (
                                    <DropdownItem key={index}>{day}</DropdownItem>
                                )
                            })}
                        </Dropdown>

                        </div>
                    </div>


                    <div  className="flex w-full items-center gap-2 justify-center mx-auto">
                        <div className="w-2/3">

                        <div className="mb-2 block">
                            <Label className="text-md" htmlFor="description">Description</Label>
                        </div>
                        <Textarea className="overflow-y-auto" id="description" rows={3} value={"These are the places I have looked so far. Please pick one of your liking."} placeholder="Provide additional information (optional)" />

                        </div>
                        <div className="w-1/3 flex items-center">
                             <Button className="w-full" type="submit">Update</Button>
                        </div>

                    </div>


                </form>

            </div>
        </div>
    );
}

export default EditPoll
