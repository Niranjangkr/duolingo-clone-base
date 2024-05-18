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
        icon={PromptIcon }
      />

      <ChatAction
        onClick={() => {
         console.log("masks")
        }}
        text={"Masks"}
        icon={MaskIcon}
      />

      <ChatAction
        text={"Clear Context"}
        icon={BreakIcon}
        onClick={() => console.log("clear context")}
      />
    </div>
  );
}

export default ChatActions

