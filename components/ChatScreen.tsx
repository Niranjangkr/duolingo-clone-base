"use client"

import React, { FormEvent, useEffect, useRef, useState } from 'react';

import axios from 'axios';
import clsx from 'clsx';
import Textarea from "react-textarea-autosize";
import { toast } from 'sonner';

import { useAssistant } from '@/app/hooks/useAssistant';
import ChatActions from '@/components/interfaces/chat/ChatActions';
import Dictaphone from '@/components/layout/chat/Dictaphone';
import { Markdown } from '@/components/layout/chat/markdown';
import { foldersType } from '@/components/layout/chat/sidebar';
import { LoadingCircle, SendIcon } from '@/public/img/icons/icon';
import { FolderCreateResponse, folderCreateResponse } from '@/types';

import Loading from '@/components/ui/loading';

type Props = {
    isPdfChat?: boolean,
    thread_Id?: string
}

export const ChatScreen = ({ isPdfChat = false, thread_Id }: Props) => {
    const [placeholder, setPlaceHolder] = useState<string>(`Enter here...`);
    const formRef = useRef<HTMLFormElement>(null);
    const disabled = false; //TODO: make it a state
    const [currentThreadId, setCurrentThreadId] = useState<string | undefined>(thread_Id ? thread_Id : "");
    const [selectedFolderId, setSelectedFolderId] = useState<number | undefined>();
    const [foldersData, setFoldersData] = useState<foldersType[] | null>(null);
    const [isBottomVisible, setIsBottomVisible] = useState<boolean>(true);
    const scrollToBottom = useRef<HTMLDivElement | null>(null);

    const { messages, input, setInput, submitMessage, threadId, loadingMessages, setThreadId, status, setMessages } = useAssistant({
        onError(error) {
            toast.error("something went wrong: ");
            console.error(error);
        },
        api: isPdfChat ? "/api/chat/pdf" :"/api/chat",
        apiTofetchMessages: isPdfChat,
        threadId: currentThreadId,
    });

    useEffect(() => {
        setCurrentThreadId(threadId);
    }, [threadId]);

    useEffect(() => {
        if (scrollToBottom.current) {
            scrollToBottom.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsBottomVisible(entry.isIntersecting);
            },
            {
                root: null,
                threshold: 0,
            }
        );

        if (scrollToBottom.current) {
            observer.observe(scrollToBottom.current);
        }

        return () => {
            if (scrollToBottom.current) {
                observer.unobserve(scrollToBottom.current);
            }
        }
    }, []);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if(isPdfChat){
            await submitMessage(input, 0, currentThreadId);
        }else{
            if(selectedFolderId){
                await submitMessage(input, selectedFolderId, currentThreadId);
            }
        }
        setInput("");
    }

    const handleScrollToBottom = () => {
        if (scrollToBottom.current) {
            scrollToBottom.current.scrollIntoView({ behavior: "smooth" });
        }
    }

    return (
        <>
            <div className='flex-1 overflow-auto overflow-x-hidden p-5 pb-10 relative overscroll-none h-[490px] scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-white'>
                {
                    messages.length > 0 ?
                        loadingMessages ? <Loading /> :
                            messages.map((message, i) => (
                                <div
                                    key={i}
                                    className={clsx(
                                        "flex w-full py-4 rounded-sm ",
                                        message.role === "user" ? "flex flex-row-reverse" : "flex"
                                    )}
                                >

                                    <div className={`box-border relative mt-2 rounded-lg border max-w-[500px] scrollbar-thin scrollbar-track-[#f2f2f2] scrollbar-thumb-gray-300 p-3 transition-all ${message.role === "user" ? " bg-[#e7f8ff]" : "bg-[#f2f2f2]"}`}>
                                        <div className={`absolute -top-6 ${message.role === "user" ? "right-2" : "left-2"}`}>
                                            <div>
                                                {message.role === "user" ? (
                                                    <>😊</>
                                                ) : (
                                                    <>🤖</>
                                                )}
                                            </div>
                                        </div>
                                        <div className='overflow-x-auto w-full h-full'>
                                            <Markdown
                                                content={message.content}
                                                loading={false}
                                                defaultShow={i >= messages.length - 6}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        :
                        <></>
                }
                <div ref={scrollToBottom}></div>
            </div>
            <div className={`absolute bottom-0 flex w-full flex-col space-y-3 bg-gradient-to-b from-transparent p-5 pb-3 sm:px-0 left-0 border-t-2 bg-white`}>
                <ChatActions isBottomVisible={isBottomVisible} handleScrollToBottom={handleScrollToBottom} />
                <form
                    ref={formRef}
                    onSubmit={(event) => {
                        event.preventDefault();
                        handleSubmit(event).catch(error => console.error("Error in handleSubmit:", error));
                    }}
                    className={`relative w-full max-w-screen-md rounded-xl border px-4 pb-1 pt-2 sm:pb-3 sm:pt-4 bg-white`}
                >
                    <Textarea
                        tabIndex={0}
                        required
                        rows={1}
                        autoFocus
                        placeholder={placeholder}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                formRef.current?.requestSubmit();
                                e.preventDefault();
                            }
                        }}
                        spellCheck={false}
                        className="w-full pr-10 text-sm sm:text-base focus:outline-none bg-transparent relative z-30"
                    />

                    <div className={clsx(
                        "absolute inset-y-0 right-14 rounded-full my-auto flex h-8 w-8 items-center justify-center  transition-all hover:bg-gray-200 "
                    )}>
                        <Dictaphone setPlaceHolder={setPlaceHolder} setInput={setInput} />
                    </div>

                    <button
                        className={clsx(
                            "absolute inset-y-0 right-3 my-auto flex h-8 w-8 items-center justify-center rounded-md transition-all z-50",
                            disabled
                                ? `cursor-not-allowed bg-white`
                                : "bg-green-500 hover:bg-green-600"
                        )}
                        disabled={disabled}
                    >
                        {status === "loading" ? (
                            <LoadingCircle />
                        ) : (
                            <SendIcon
                                className={clsx(
                                    "h-4 w-4 relative",
                                    input?.length === 0 ? "text-gray-300" : "text-white"
                                )}
                            />
                        )}
                    </button>
                </form>
            </div>
        </>
    )
}