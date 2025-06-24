
import { Tabs, TabItem } from "flowbite-react";
import ChoicesTab from "../../../../../components/ChoicesTab";
import EditPollTab from "../../../../../components/EditPollTab";
import AssignmentTab from "../../../../../components/AssignmentTab";
const EditPoll = () => {

    return (
        <div className="m-3">
            <Tabs aria-label="Pills" variant="pills">
                <TabItem active title="Choices">
                    <ChoicesTab/>
                </TabItem>
                <TabItem title="Pollee Assignments">
                    <AssignmentTab/>
                </TabItem>
                <TabItem title="Poll Details">
                    <EditPollTab/>
                </TabItem>
            </Tabs>
        </div>
    );
}

export default EditPoll
