export function Sidebar(props: { className?: string }){
    
    const data = [
        {
            chatId: 123,
        }, 
        {
            chatId: 124,
        }
    ]

    return (
        <div className={`${props.className}`}>
            {
                data.map((data) => (
                    <div key={data.chatId} className="flex flex-col bg-white space-y-1 my-2 p-3 border rounded-lg ring-1">
                        <h2 className=" font-bold text-base">New Conversation</h2>
                        <div className="flex w-full justify-between text-slate-400 text-xs  ">
                            <p>3 messages</p>
                            <p>5/18/2024, 6:40:39 AM</p>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}