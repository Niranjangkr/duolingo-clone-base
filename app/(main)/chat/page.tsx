"use client"

import { Sidebar } from '@/components/layout/chat/sidebar'
import React, { useEffect, useRef, useState } from 'react'
import { Header } from '@/components/layout/chat/Header'
import Dictaphone from '@/components/layout/chat/Dictaphone'
import { LoadingCircle, SendIcon } from '@/public/img/icons/icon'
import Textarea from "react-textarea-autosize";
import clsx from 'clsx';
import { Markdown } from '@/components/layout/chat/markdown'
import { role } from '@/store/config'
import ChatActions from '@/components/interfaces/chat/ChatActions'
import { useChat } from "ai/react"
import { Bot, UserIcon } from 'lucide-react'

interface RenderMessages {
  content: string;
  role: role;
}

const demoMessages = [
    {
        content: "Hi",
        role: "user",
        createdAt: "2024-05-18T02:17:18.081Z",
        id: "e8i0Fcf"
    },
    {
        id: "J5Oop22",
        role: "assistant",
        content: "Hello! How can I assist you today?",
        createdAt: "2024-05-18T02:17:19.880Z"
    },
    {
        content: "I want to learn about rust programming language",
        role: "user",
        createdAt: "2024-05-18T02:17:32.422Z",
        id: "O3Xo71f"
    },
    {
        id: "nyiz8yH",
        role: "assistant",
        content: "That's great! Rust is a modern, high-performance, systems programming language created by Mozilla. It aims to provide the speed and control of low-level programming with the strong safety guarantees of high-level languages. \n\nHere's a roadmap to help you learn Rust:\n\n1. **Getting Started:**\n   - Install Rust by following the instructions on the official website: [Rust Install Guide](https://www.rust-lang.org/learn/get-started)\n   - Once Rust is installed, you can write your first \"Hello, World!\" program by following the examples in the Rust Book.\n\n2. **Rust Programming Basics:**\n   - Read \"The Rust Programming Language\" book (also known as the Rust Book): [Rust Book](https://doc.rust-lang.org/book/)\n   - Learn about basic syntax, variables, data types, functions, control flow, error handling, and more.\n\n3. **Ownership, Borrowing, and Lifetimes:**\n   - Rust's unique feature is its memory safety without a garbage collector. Study ownership rules, borrowing, and how Rust ensures memory safety at compile time by preventing data races and null pointer dereferencing.\n   - Read the chapter on \"Ownership\" in the Rust Book and the official Rust documentation on lifetimes: [Rust Lifetimes Documentation](https://doc.rust-lang.org/book/ch10-00-generics.html)\n\n4. **Advanced Concepts:**\n   - Once you are comfortable with the basics, dive deeper into advanced topics like Traits (similar to interfaces in other languages), Generics, Pattern Matching, Concurrency, and Asynchronous Programming.\n\n5. **Projects and Practice:**\n   - Practice by working on small projects or contributing to open-source Rust projects on platforms like GitHub.\n   - Solve coding challenges on platforms like LeetCode, Exercism, or Advent of Code using Rust.\n\n6. **Community and Resources:**\n   - Join the Rust community on forums like the Rust Users Forum, Reddit's r/rust subreddit, or the Rust Discord channel to ask questions, get help, and stay updated on Rust developments.\n   - Follow Rustaceans on Twitter and read Rust-related blogs to keep up with the latest news and best practices.\n\nRemember, learning Rust, like any programming language, is a journey. Don't hesitate to ask if you have specific questions or need further clarification on any Rust concept. Happy coding!",
        createdAt: "2024-05-18T02:17:33.263Z"
    }
]

const page = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [userInput, setUserInput] = useState("");
  const [placeholder, setPlaceHolder] = useState<string>(`Enter here...`);
  const formRef = useRef<HTMLFormElement>(null);
  const [disabled, setDisabled] = useState<boolean>(false);

  const getCurrentTime = () => {
    const now = new Date();
    const isoString = now.toISOString();
    const formattedTime = isoString.split('.')[0];
    return formattedTime + "+00";
  }

  const { messages, setMessages, input, setInput, handleSubmit, isLoading } = useChat({
    // body: {
    //   birthChartDetails
    // },
    onResponse: (response) => {
      if (response.status === 429) {
        window.alert("You have reached your request limit for the day.");
        return;
      }
    },
    onFinish: async (message) => {

      const currentTime = getCurrentTime();
      const userMessageCreatedAt = new Date();
      userMessageCreatedAt.setSeconds(userMessageCreatedAt.getSeconds() - 1);

      console.log("userMessagesCreatedAt", userMessageCreatedAt);
    },
  });
  console.log(messages)
  return (
    <div className={`w-full h-full flex`}>
      <div className='w-3/4 relative'>
        <Header title='New Conversation' totalMessages={messages.length} />
        <div className='flex-1 overflow-auto overflow-x-hidden p-5 pb-10 relative overscroll-none h-[490px] scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-white'>
          {
            messages.length > 0 ?
              messages.map((message, i) => (
                <div
                  key={i}
                  className={clsx(
                    "flex w-full py-4 rounded-sm ",
                    message.role === "user" ? "flex flex-row-reverse" : "flex"
                  )}
                >

                  <div className={`box-border relative mt-2 rounded-lg border max-w-[500px] p-3 transition-all ${message.role === "user" ? " bg-[#e7f8ff]" : "bg-[#f2f2f2]"}`}>
                    <div className={`absolute -top-6 ${message.role === "user" ? "right-2" : "left-2"}`}>
                      <div>
                        {message.role === "user" ? (
                          // <UserIcon className="" />
                          <>😊</>
                        ) : (
                          <>🤖</>
                        )}
                      </div>
                    </div>
                    <Markdown
                      content={message.content}
                      loading={false}
                      defaultShow={i >= messages.length - 6}
                    />
                  </div>
                </div>
              ))
              :
              <div>No Messages</div>

            // messages.map((item, idx) => (
            //   <div className={`${item.role === "user" ? "flex flex-row-reverse" : "flex"}`}>
            //     <div className={`box-border mt-2 rounded-lg border max-w-[500px] p-3 transition-all ${item.role === "user" ? "flex flex-row-reverse bg-[#e7f8ff]" : "flex bg-[#f2f2f2]"}`}>
            //     <Markdown
            //             content={item.content}
            //             loading={false}
            //             defaultShow={idx >= messages.length - 6}
            //           />
            //     </div>
            //   </div>
            // ))
          }
        </div>
        <div className={`absolute bottom-0 flex w-full flex-col space-y-3 bg-gradient-to-b from-transparent p-5 pb-3 sm:px-0 left-0 border-t-2`}>
          <ChatActions />
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className={`relative w-full max-w-screen-md rounded-xl border px-4 pb-2 pt-3 sm:pb-3 sm:pt-4 bg-white`}
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
              <Dictaphone setPlaceHolder={setPlaceHolder} input={input} setInput={setInput} />
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
              {isLoading ? (
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
      </div>
      <Sidebar className='w-1/4 bg-[#e7f8ff] p-4 rounded-sm' />
    </div >
  )
}

export default page