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
    submitMessage: (message: string) => Promise<void>;
    threadId?: string;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: Error | null;
}

export function useAssistant({
    onError,
    api,
    threadId }: useAssistantProps): useAssistantReturn {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>("");
    const [status, setStatus] = useState<'idle' | 'loading' | 'succeeded' | 'failed'>('idle');
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if(threadId){
            fetchMessages(threadId);
        }
    }, [threadId]);

    const fetchMessages = async(threadId:string) => {
        setStatus("loading");
        try {
            const payload : FetchChatApiRequest = {
                threadId: threadId
            }
            const response = await axios.post<FetchChatApiResponse>('/api/chat/message', payload);
            const data = response.data;

            if('messages' in data && data.messages) {
                const sortedMessages = data.messages.sort((a, b) => a.created_at - b.created_at);
                setMessages(sortedMessages);
                console.log(sortedMessages, "sorted Messages");
            }
            setStatus('succeeded');
        } catch (error) {
            setStatus("failed");
            setError(error as Error);
            onError(error as Error);
        }
    }

    const submitMessage = async (message: string) => {
        setStatus('loading');
        try {
            const userMessage: Message = { id: Date.now().toString(), role: "user", content: message };
            setMessages((prevMessages) => [...prevMessages, userMessage]);
            const response = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ threadId, message })
            });

            if (!response.body) {
                throw new Error('No response body');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let currentMessage: Message = { id: Date.now().toString(), role: "assistant", content: "" };

            setMessages((prevMessages) => [...prevMessages, currentMessage]);

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunk = decoder.decode(value, { stream: true });
                try {
                    const jsonContent = chunk.substring(chunk.indexOf('{'));
                    const parsedChunk = JSON.parse(jsonContent);
                    if (parsedChunk?.content?.[0]?.text?.value) {
                        currentMessage.content += parsedChunk.content[0].text.value;
                        setMessages((prevMessages) =>
                            prevMessages.map((msg) =>
                                msg.id === currentMessage.id ? { ...msg, content: currentMessage.content } : msg
                            )
                        );
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

    return { messages, input, setInput, submitMessage, threadId, status, error };
}