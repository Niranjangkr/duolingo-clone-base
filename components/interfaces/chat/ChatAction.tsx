"use client"

import React, { useRef, useState } from 'react'

import Image from 'next/image';


const ChatAction = ({ text, icon: Icon, onClick }: {
    text: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    onClick: () => void;
}) => {

    const iconRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState({
        full: 16,
        icon: 16,
    });

    function updateWidth() {
        if (!iconRef.current || !textRef.current) return;
        const getWidth = (dom: HTMLDivElement) => dom.getBoundingClientRect().width;
        const textWidth = getWidth(textRef.current);
        const iconWidth = getWidth(iconRef.current);
        setWidth({
            full: textWidth + iconWidth,
            icon: iconWidth,
        });
    }

    return (
        <div
            className={`chat-input-actions clickable`}
            onClick={() => {
                onClick();
                setTimeout(updateWidth, 1);
            }}
            onMouseEnter={updateWidth}
            onTouchStart={updateWidth}
            style={
                {
                    "--icon-width": `${width.icon}px`,
                    "--full-width": `${width.full}px`,
                } as React.CSSProperties
            }
        >
            <div ref={iconRef} className={"chat-input-actions > icon rounded-xl border p-2 cursor-pointer"}>
            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
               <Image src={Icon} alt='icon' />
            </div>
            <div className={"invisible hidden"} ref={textRef}>
                {text}
            </div>
        </div>
    );
}

export default ChatAction