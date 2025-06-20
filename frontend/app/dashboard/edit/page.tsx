
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button, ButtonGroup} from "flowbite-react";

const EditPolls = () => {


return (
    <div className="flex min-h-screen w-full justify-center m-2">
      <Table className="w-full shadow-md rounded-md">
        <TableHead className="py-3 bg-gray-500">
          <TableRow className="py-3 bg-gray-100">
            <TableHeadCell className="font-bold text-center text-lg text-black normal-case">Name</TableHeadCell>
            <TableHeadCell className="font-bold text-center text-lg text-black normal-case">Creation Date</TableHeadCell>
            <TableHeadCell className="font-bold text-center text-lg text-black normal-case">Durantion</TableHeadCell>
            <TableHeadCell>
              <span className="sr-only">Actions</span>
            </TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          <TableRow className="bg-gray-50 hover:bg-gray-200">
            <TableCell className="whitespace-nowrap font-normal text-md text-center font-medium text-black ">
              Birthday Party Places
            </TableCell>
            <TableCell className="text-center text-dark">June 16, 2025</TableCell>
            <TableCell className="text-center text-dark">3 days</TableCell>
            <TableCell className="text-center">    <ButtonGroup>
      <Button color="red">Delete</Button>
      <Button color="alternative">Launch</Button>
      <Button color="alternative">Edit</Button>
    </ButtonGroup></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default EditPolls
