
import { useEffect, useState } from "react";

import axios from "axios";

import { FetchChatApiRequest, FetchChatApiResponse } from "@/types";

interface useAssistantProps {
    onError: (error: Error) => void;
    api: string;
    threadId?: string;
}

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    created_at?: number;
}

// status: 'in_progress awaiting_message'
interface useAssistantReturn {
    messages: Message[];
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
    submitMessage: (message: string, folderId: number, currentThread: string | undefined) => Promise<void>;
    threadId?: string;
    setThreadId: React.Dispatch<React.SetStateAction<string | undefined>>
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: Error | null;
    loadingMessages: boolean;
}

interface ParsedChunk {
    threadId?: string;
    content?: Array<{
        text?: {
            value?: string;
        }
    }>;
}

export function useAssistant({
    onError,
    api,
    threadId: initialThreadId }: useAssistantProps): useAssistantReturn {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>("");
    const [status, setStatus] = useState<'idle' | 'loading' | 'succeeded' | 'failed'>('idle');
    const [error, setError] = useState<Error | null>(null);
    const [threadId, setThreadId] = useState<string | undefined>(initialThreadId);
    const [loadingMessages, setLoadingMessages] = useState<boolean>(false);

    const fetchMessages = async (threadId: string) => {
        setLoadingMessages(true);
        try {
            const payload: FetchChatApiRequest = {
                threadId: threadId
            }
            const response = await axios.post<FetchChatApiResponse>('/api/chat/message', payload);
            const data = response.data;

            if ('messages' in data && data.messages) {
                const sortedMessages = data.messages.sort((a, b) => a.created_at - b.created_at);
                setMessages(sortedMessages);
                // console.log(sortedMessages, "sorted Messages");
            }
            setLoadingMessages(false);
        } catch (error) {
            setLoadingMessages(false);
            setError(error as Error);
            onError(error as Error);
        }
    }

    useEffect(() => {
        const callFn = async (threadId: string) => {
            await fetchMessages(threadId);
        }
        if (threadId) {
            callFn(threadId)
                .then(d => console.log(d))
                .catch(e => console.error(e))
        }
    }, [threadId]);

    const submitMessage = async (message: string, folderId: number, currentThread: string | undefined) => {
        setStatus('loading');
        try {
            const userMessage: Message = { id: Date.now().toString(), role: "user", content: message };
            setMessages((prevMessages) => [...prevMessages, userMessage]);
            const response = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ threadId: currentThread, message, folderId })
            });

            if (!response.body) {
                throw new Error('No response body');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            let done = false;
            const currentMessage: Message = { id: Date.now().toString(), role: "assistant", content: "" };

            setMessages((prevMessages) => [...prevMessages, currentMessage]);

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                buffer += decoder.decode(value, { stream: true });

                try {
                    let startIdx = buffer.indexOf('{');
                    while (startIdx !== -1) {
                        let endIdx = buffer.indexOf('}', startIdx);
                        if (endIdx === -1) break;

                        let nextStartIdx = buffer.indexOf('{', startIdx + 1);
                        while (nextStartIdx !== -1 && nextStartIdx < endIdx) {
                            endIdx = buffer.indexOf('}', endIdx + 1);
                            nextStartIdx = buffer.indexOf('{', nextStartIdx + 1);
                        }

                        if (endIdx === -1) break;

                        const jsonContent = buffer.substring(startIdx, endIdx + 1);
                        buffer = buffer.substring(endIdx + 1);
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        let parsedChunk: ParsedChunk;

                        try {
                            parsedChunk = JSON.parse(jsonContent) as ParsedChunk;
                        } catch (error) {
                            console.error('Error parsing JSON:', error);
                            startIdx = buffer.indexOf('{');
                            continue;
                        }

                        if (parsedChunk?.threadId) {
                            setThreadId(parsedChunk.threadId);
                        }

                        if (parsedChunk?.content?.[0]?.text?.value) {
                            currentMessage.content += parsedChunk.content[0].text.value;
                            setMessages((prevMessages) =>
                                prevMessages.map((msg) =>
                                    msg.id === currentMessage.id ? { ...msg, content: currentMessage.content } : msg
                                )
                            );
                        }

                        startIdx = buffer.indexOf('{');
                    }
                } catch (error) {
                    console.error('Error parsing chunk:', error);
                }
            }

            setStatus("succeeded");
        } catch (error) {
            setStatus('failed');
            setError(error as Error);
            onError(error as Error);
        }
    }

    return { messages, input, setInput, submitMessage, setMessages, threadId, setThreadId, status, error, loadingMessages };
}