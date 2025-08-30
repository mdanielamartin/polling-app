"use client"
import { Tabs, TabItem } from "flowbite-react";
import ChoicesTab from "../../../../../components/ChoicesTab";
import EditPollTab from "../../../../../components/EditPollTab";
import AssignmentTab from "../../../../../components/AssignmentTab";
import { useParams } from 'next/navigation'
import { useEffect } from "react";
import usePollStore from "../../../../../store/pollStore";
import useUserStore from "../../../../../store/userStore";
import useChoiceStore from "../../../../../store/choiceStore";

const EditPoll = () => {
    const params = useParams()
    const slug = Number(params.slug)
    const { getPoll} = usePollStore()
    const { token } = useUserStore()
    const { setChoices } = useChoiceStore()

    useEffect(() => {
        const onLoad = async () => {
            const pollData = await getPoll(slug, token)
            if (pollData?.choices) {
                setChoices(pollData.choices)
            }
        }
        onLoad()
    }, [])

    return (
        <div className="m-3">
            <Tabs aria-label="Pills" variant="pills" >
                <TabItem active title="Choices">
                    <ChoicesTab />
                </TabItem>
                <TabItem title="Pollee Assignments">
                    <AssignmentTab />
                </TabItem>
                <TabItem title="Poll Details">
                    <EditPollTab />
                </TabItem>
            </Tabs>
        </div>
    );
}

export default EditPoll
