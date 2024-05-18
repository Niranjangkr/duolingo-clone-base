"use client"

import ChatAction from "./ChatAction";

import MaskIcon from "../../../app/icons/mask.svg"
import BreakIcon from "../../../app/icons/break.svg"
import PromptIcon from "../../../app/icons/prompt.svg"

const ChatActions = () => {

  return (
    <div className={"chat-input-actions space-x-3"}>
      <ChatAction
        onClick={() => console.log("promptHints")}
        text={"Prompts"}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        icon={PromptIcon }
      />

      <ChatAction
        onClick={() => {
         console.log("masks")
        }}
        text={"Masks"}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        icon={MaskIcon}
      />

      <ChatAction
        text={"Clear Context"}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        icon={BreakIcon}
        onClick={() => console.log("clear context")}
      />
    </div>
  );
}

export default ChatActions

