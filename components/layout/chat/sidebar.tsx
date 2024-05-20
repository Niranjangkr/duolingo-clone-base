import { PlusCircle, Settings } from "lucide-react"

export function Sidebar(props: { className?: string, setCurrentThreadId: React.Dispatch<React.SetStateAction<string | undefined>> }) {

    const data = [
        {
            threadId: "thread_tU8Bx1Y8R5D861YCo6RBCUiD",
        },
        {
            threadId: "124",
        }
    ]

    const handleNewChat = async() => {
        props.setCurrentThreadId("");
    }

    return (
        <div className={`${props.className} flex flex-col justify-between`}>
            <div>
                {
                    data.map((data) => (
                        <div key={data.threadId} className="flex flex-col bg-white space-y-1 my-2 p-3 border rounded-lg ring-1 cursor-pointer" onClick={() => props.setCurrentThreadId(data.threadId)}>
                            <h2 className=" font-bold text-base">New Conversation</h2>
                            <div className="flex w-full justify-between text-slate-400 text-xs  ">
                                <p>3 messages</p>
                                <p>5/18/2024, 6:40:39 AM</p>
                            </div>
                        </div>
                    ))
                }
            </div>

            <div className="flex justify-between">
                <button className=" bg-white rounded-lg shadow-lg p-2 hover:bg-gray-100 transition-all active:scale-95">
                    <Settings color="gray" size={19} />
                </button>
                <button className=" bg-white rounded-lg shadow-lg p-2 hover:bg-gray-100 transition-all active:scale-95" onClick={handleNewChat}>
                    <p className="text-xs flex items-center justify-center space-x-1">
                        <PlusCircle size={16} color="gray" />
                        <span className="text-xs">New Chat</span>
                    </p>
                </button>
            </div>
        </div>
    )
}