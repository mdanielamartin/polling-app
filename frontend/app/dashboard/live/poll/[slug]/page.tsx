"use client"
import { Tabs, TabItem } from "flowbite-react";

import { useParams } from 'next/navigation'
import { useEffect } from "react";
import usePollStore from "../../../../../store/pollStore";
import useUserStore from "../../../../../store/userStore";
import useChoiceStore from "../../../../../store/choiceStore";
import PollCard from "../../../../../components/PollCard";
import PollAssignmentStatus from "../../../../../components/PollAssignmentStatus";

const LivePoll = () => {
    const params = useParams()
    const slug = Number(params.slug)
    const { getPoll, poll } = usePollStore()
    const { token } = useUserStore()
    const { setChoices } = useChoiceStore()

    useEffect(() => {
        const onLoad = async () => {
            await getPoll(slug, token)
            if (poll.choices) {
                setChoices(poll.choices)
            }

        }
        onLoad()
    }, [])

    return (
        <div className="m-3">
            <Tabs aria-label="Pills" variant="pills" >
                <TabItem active title="Poll">
                    <PollCard />
                </TabItem>
                <TabItem title="Pollee Assignments">
                    <PollAssignmentStatus />
                </TabItem>
            </Tabs>
        </div>
    );
}

export default LivePoll
