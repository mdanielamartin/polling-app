"use client";
import { List, ListItem } from "flowbite-react"
import usePollStore from "../store/pollStore";
import { toLocalTime } from "../utils/timezones";

const PollCard = () => {

    const { poll } = usePollStore()


    return (
        <div className="bg-gray-100 rounded-xl px-4 py-6 mx-auto my-4 w-full max-w-5xl">
            <header className="mb-6">
                <h1 className="text-3xl font-extrabold text-gray-800">{poll.name}</h1>
                <h2 className="text-lg text-gray-600">{poll.description}</h2>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-gray-500 text-sm">
                <div>
                    <span className="font-semibold text-gray-700">Created:</span> {toLocalTime(poll.created_at)}
                </div>
                <div>
                    <span className="font-semibold text-gray-700">Published:</span> {toLocalTime(poll.publish_date)}
                </div>
                <div>
                    <span className="font-semibold text-gray-700">Closes:</span> {toLocalTime(poll.closing_date)}
                </div>
            </section>

            <div className="bg-white rounded-xl shadow-sm p-4">
                <List className="space-y-4">
                    {poll.choices?.map((choice, index) => (
                        <ListItem
                            key={choice.id}
                            className="flex items-center justify-between bg-stone-50 hover:bg-stone-100 rounded-lg border border-gray-300 p-4 transition duration-200"
                        >
                            <div className="flex items-start space-x-4">
                                <div className="text-4xl font-extrabold text-cyan-500">{index + 1}</div>
                                <div>
                                    <div className="text-xl font-bold text-gray-800">{choice.name}</div>
                                    <p className="text-gray-500 text-sm">{choice.description}</p>
                                </div>
                            </div>
                        </ListItem>
                    ))}
                </List>
            </div>
        </div>

    )
}

export default PollCard;
