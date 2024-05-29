"use client"

import React, { useEffect, useState } from "react";

import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Edit, PlusCircle, Settings, Trash, X } from "lucide-react"
import { toast } from "sonner";

import { FetchFolderByIdRequest, FetchFolderResponse, FetchFolderThreadsApiResponse, FolderCreateResponse, NewChatCreateResponse, NewChatRequest, folderCreateResponse, newChatCreateResponse } from "@/types";

import Loading from "./loading";

interface Thread {
    folderId: number;
    threadId: string | null;
    id: number;
    name: string;
    createdAt: Date | null
}

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    created_at?: number;
}

// const threadData = [
//     {
//         threadId: "thread_tU8Bx1Y8R5D861YCo6RBCUiD",
//     },
//     {
//         threadId: "124",
//     }
// ]

export type foldersType = {
    id: number,
    name: string,
    userId: string,
    createdAt?: string | number | Date
}

type EditFolderState = {
    [key: number]: boolean;
}

type GenerateTitleResponse = {
    data: string
}

export function Sidebar(props: {
    className?: string,
    setCurrentThreadId: React.Dispatch<React.SetStateAction<string | undefined>>,
    currentThreadId: string | undefined,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    messages: Message[],
    loadingMessages: boolean,
    setSelectedFolderId: React.Dispatch<React.SetStateAction<number | undefined>>,
    selectedFolderId: number | undefined,
    foldersData: foldersType[] | null,
    setFoldersData: React.Dispatch<React.SetStateAction<foldersType[] | null>>
    setThreadId: React.Dispatch<React.SetStateAction<string | undefined>>
}) {
    const [threads, setThreads] = useState<Thread[] | null | undefined>(null);
    const [loadingThreads, setThreadsLoading] = useState<boolean>(false);
    const [folderEdit, setFolderEdit] = useState<EditFolderState>({});
    const [folderName, setFolderName] = useState<string>("");

    const handleNewChat = async (): Promise<void> => {
        const toastId = toast.loading("creating new chat");
        props.setCurrentThreadId("");
        props.setMessages([]);
    
        if (!props.selectedFolderId) {
            toast.error("Select the folder to create new chat");
            return;
        }
    
        const payload: NewChatRequest = {
            folderId: props.selectedFolderId
        };
    
        try {
            const response = await axios.post<NewChatCreateResponse>('/api/chat/newchat', payload);
            const data = newChatCreateResponse.parse(response.data);
    
            if (data && data?.message && data?.message?.length > 0) {
                const dataObj = data?.message[0];
                setThreads(prev => (prev ? [dataObj, ...prev] : [dataObj]));
    
                if (dataObj.threadId) {
                    props.setThreadId(dataObj.threadId);
                }
                toast.dismiss(toastId);
            } else {
                toast.error("Something went wrong, refresh and try again");
            }
        } catch (error) {
            console.error('Error creating new chat:', error);
            toast.error("Something went wrong, refresh and try again");
        } finally {
            toast.dismiss(toastId);
        }
    };
    

    const navigateToChat = (id: string | null) => {
        if (id) {
            console.log("see if mesaages updates")
            props.setCurrentThreadId(id);
            props.setThreadId(id);
        } else {
            console.error("threadId not present", id);
            toast.error("chat not found, refresh and try again");
        }
    }

    const handleNewFolder: () => Promise<void> = async () => {
        const res = await axios.post<FolderCreateResponse>('/api/chat/folder');
        const data = folderCreateResponse.parse(res.data);
        if (data.error) {
            toast.error("Error!! cannot create folder");
            console.error("Error in folder creation: ", data.error);
        } else if (data.message) {
            const newObj = data.message;
            props.setFoldersData((prev) => prev?.length ? [...prev!, newObj] : [newObj])
            handleNewChat()
            props.setSelectedFolderId(newObj.id);
        }
    }

    useEffect(() => {
        const fetchThreadsInFolder = async (folderId: number) => {
            setThreadsLoading(true);
            const payload: FetchFolderByIdRequest = {
                folderId: folderId
            }
            const response = await axios.post<FetchFolderThreadsApiResponse>("/api/chat/folder/getthreadsbyid", payload);
            const data = response.data;
            if (data.error) {
                console.error(data.error);
                toast.error("cannot fetch chats, try again");
                return;
            }
            if (data.data && data.data?.length > 0) {
                setThreads(data.data);
                const defaultSelectedThreadId = data?.data[0]?.threadId;
                if (defaultSelectedThreadId) {
                    props.setCurrentThreadId(defaultSelectedThreadId);
                    props.setThreadId(defaultSelectedThreadId);
                }
            }
            setThreadsLoading(false);
        }
        if (props.selectedFolderId) {
            setThreads([]);
            fetchThreadsInFolder(props.selectedFolderId)
                .then(d => console.log(d))
                .catch(e => console.log(e))
        }
    }, [props.selectedFolderId]);

    useEffect(() => {

        const generateTitleAndSave = async (context: string) => {
            const res = await axios.post<GenerateTitleResponse>("/api/generate-title", { context: context });
            const name = `${res.data.data}`;
            // call the api and pass the threadId
            const res2 = await axios.post('api/chat/thread/nameEdit', { id: props.currentThreadId, name: name });

            if (res2.status === 200) {
                setThreads(prev => {
                    if (!prev) return null;
                    return prev.map(thread =>
                        thread.threadId === props.currentThreadId ? { ...thread, name: name } : thread
                    )
                });
            }
            console.log(res2);

        }

        if (!props.loadingMessages && props.messages.length >= 2) {
            const currentSelectedChat = threads?.filter(item => item.threadId === props.currentThreadId);
            let currentName;
            if (currentSelectedChat !== undefined && currentSelectedChat.length > 0) {
                currentName = currentSelectedChat[0].name
            }

            let context = "";
            if (currentName === 'New Chat') {
                props.messages.slice(0, 3).map((item) => {
                    context += `${item.role}: ${item.content} \n`
                })
                generateTitleAndSave(context)
                    .then(d => console.log(d))
                    .catch(e => console.error(e));
            }
        }
    }, [props.messages, props.loadingMessages]);

    useEffect(() => {
        const fetchFolders = async () => {
            const data = await axios.get<FetchFolderResponse>('/api/chat/folder');
            if (data.data.length > 0) {
                const folders = data.data;
                props.setFoldersData(folders);
                props.setSelectedFolderId(folders[0].id);
            }
        }
        fetchFolders()
            .then(d => console.log(d))
            .catch(e => console.error(e))
    }, []);

    const handleFolderEdit = (e: React.MouseEvent<SVGSVGElement, MouseEvent>, id: number) => {
        e.stopPropagation();
        setFolderEdit(pre => {
            const updatedState: { [key: number]: boolean } = {};
            for (const key in pre) {
                if (Object.prototype.hasOwnProperty.call(pre, key)) {
                    updatedState[key] = false;
                }
            }
            updatedState[id] = !pre[id];
            return updatedState;
        });
    }

    const handleFolderNameSave:(e: React.MouseEvent<SVGSVGElement, MouseEvent>, id: number) => void = async (e: React.MouseEvent<SVGSVGElement, MouseEvent>, id: number) => {
        e.stopPropagation();

        if (!folderName) {
            toast.error("Enter name first");
            return;
        }
        const toastId = toast.loading("saving name")
        const data = await axios.post("/api/chat/folder/edit", { name: folderName, id: id });
        console.log(data);
        props.setFoldersData(prev => {
            if (!prev) return null;
            return prev.map(folder =>
                folder.id === id ? { ...folder, name: folderName } : folder
            );
        });
        toast.dismiss(toastId);

        setFolderEdit(pre => {
            const updatedState: { [key: number]: boolean } = {};
            for (const key in pre) {
                if (Object.prototype.hasOwnProperty.call(pre, key)) {
                    updatedState[key] = false;
                }
            }
            updatedState[id] = !pre[id];
            return updatedState;
        });
    }

    const handleThreadEdit = (e: React.MouseEvent<SVGSVGElement, MouseEvent>, id: number) => {
        console.log(id, "handleThreadEdit");
        e.stopPropagation();
        // setFolderEdit(pre => {
        //     const updatedState: { [key: number]: boolean } = {};
        //     for (const key in pre) {
        //         if (Object.prototype.hasOwnProperty.call(pre, key)) {
        //             updatedState[key] = false;
        //         }
        //     }
        //     updatedState[id] = !pre[id];
        //     return updatedState;
        // });
    }

    const handleThreadDelete: (e: React.MouseEvent<SVGSVGElement, MouseEvent>, id: number) => Promise<void> = async (e: React.MouseEvent<SVGSVGElement, MouseEvent>, id: number) => {
        e.stopPropagation();
        const toastId = toast.loading("deleting chat");
        console.log(id, "handleThreadDelete");
        const data = await axios.post("/api/chat/thread/delete", { id: id });
        if (data.status === 200) {
            toast.dismiss(toastId);
            toast.success("chat deleted");
            setThreads(prev => prev?.filter(item => item.id !== id))
            console.log(data.data);
        } else {
            toast.error("something went wrong, try later!!");
        }
    }

    return (
        <div className={`${props.className} flex flex-col justify-between`}>
            <div className="h-[90%] overflow-y-auto scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-400 px-2">
                {
                    props.foldersData ? props.foldersData.map((data) => (
                        <div key={data.id}
                            className="flex flex-col transition-all bg-white space-y-1 my-2 p-3 border rounded-lg ring-1 cursor-pointer"
                            onClick={() => {
                                props.setSelectedFolderId(data.id)
                            }}>
                            <div className="w-full flex justify-between">
                                {
                                    folderEdit[data.id] ?
                                        <>
                                            <input className="font-bold text-base w-[150px] p-2 rounded-lg border outline-none focus:border-gray-400" onChange={(e) => setFolderName(e.target.value)} />
                                            <div className="flex space-x-1 items-center">
                                                <Check size={16} className="hover:scale-105 active:scale-95" onClick={(e: React.MouseEvent<SVGSVGElement, MouseEvent>) => handleFolderNameSave(e, data.id)
                                                } />
                                                <X size={16} className="text-red-500 hover:scale-105 active:scale-95" onClick={(e: React.MouseEvent<SVGSVGElement, MouseEvent>) => handleFolderEdit(e, data.id)} />
                                            </div>
                                        </>
                                        :
                                        <>
                                            <h2 className="font-bold text-base">{data.name}</h2>
                                            <div className="flex space-x-1">
                                                <Edit size={16} className="hover:scale-105 active:scale-95" onClick={(e: React.MouseEvent<SVGSVGElement, MouseEvent>) => handleFolderEdit(e, data.id)} />
                                            </div>
                                        </>
                                }
                            </div>
                            <div className="flex w-full justify-between text-slate-400 text-xs  ">
                                {
                                    props.selectedFolderId === data.id &&
                                    <p>{!loadingThreads ? threads?.length || `N/A` : ""} chats</p>
                                }
                                <p>
                                    {
                                        data.createdAt &&
                                        new Date(data.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
                                    }
                                </p>
                            </div>
                            <AnimatePresence initial={false}>
                                {props.selectedFolderId === data.id && (
                                    loadingThreads ? <Loading /> :
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: (props.selectedFolderId === data.id) ? 'auto' : 0 }}
                                            exit={{ height: 0 }}
                                            className="overflow-hidden"
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="mt-2 space-y-2">
                                                {
                                                    threads && (threads?.length) > 0 ? threads.map((thread) => (
                                                        <div key={thread.id} className={`p-2 border rounded-lg ${thread.threadId === props.currentThreadId ? "bg-[#e7f8ff]" : ""}`} onClick={() => navigateToChat(thread.threadId)}>
                                                            <div className="flex justify-between">
                                                                <h3 className="font-semibold">{thread.name}</h3>
                                                                <div className="flex space-x-1">
                                                                    <Edit size={16} className="hover:scale-105 active:scale-95" onClick={(e: React.MouseEvent<SVGSVGElement, MouseEvent>) => handleThreadEdit(e, thread.id)} />
                                                                    <Trash size={16} className=" hover:text-red-500 hover:scale-105 active:scale-95" onClick={(e: React.MouseEvent<SVGSVGElement, MouseEvent>) => handleThreadDelete(e, thread.id)} />
                                                                </div>
                                                            </div>
                                                            <div className="flex w-full justify-between text-slate-400 text-xs  ">
                                                                {/* <p>3 chats</p> */}
                                                                <p>{thread.createdAt ? new Date(thread.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }) : "N/A"}</p>
                                                            </div>
                                                        </div>
                                                    )) :
                                                        <div className="text-sm text-slate-700 text-center">No chats found</div>
                                                }
                                            </div>
                                        </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )) :
                        <div></div>
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

                <button className=" bg-white rounded-lg shadow-lg p-2 hover:bg-gray-100 transition-all active:scale-95" onClick={handleNewFolder}>
                    <p className="text-xs flex items-center justify-center space-x-1">
                        <PlusCircle size={16} color="gray" />
                        <span className="text-xs">New Folder</span>
                    </p>
                </button>
            </div>
        </div>
    )
}