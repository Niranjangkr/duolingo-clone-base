"use client"

import "core-js/stable";
import "regenerator-runtime/runtime";
import React from 'react';
import { useEffect, useState } from "react";
import { Mic } from "lucide-react";

import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'


interface Props {
  // input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  setPlaceHolder: React.Dispatch<React.SetStateAction<string>>;
}

const Dictaphone = ({ setInput, setPlaceHolder }: Props) => {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [mounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (transcript.length > 0) {
      setInput(transcript);
    }
    if(!listening){
      setPlaceHolder(`Enter here...`);
    }else{
      setPlaceHolder('Listening...');
    }
  }, [listening, transcript]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if(!mounted){
    return null;
  }

  if (!browserSupportsSpeechRecognition) {
    return null;
  }
  
  return (
    <>
      <Mic 
        onClick={() => {
          if (listening) {
              SpeechRecognition.stopListening()
              .then(data => console.log(data))
              .catch((e) => console.error(e))
              setPlaceHolder(`Enter your task for ${Date().toString().slice(0, 15)}`);
          } else {
              SpeechRecognition.startListening()
              .then((data) => console.log(data))
              .catch(e => console.log(e))
              setPlaceHolder('Listening...');
          }
        }}
        onDoubleClick={resetTranscript}
        className={`w-6 h-6 relative z-30 cursor-pointer rounded-full ${listening?"text-red-400":""}`}
      />
     
    </>
  );
};
export default Dictaphone;