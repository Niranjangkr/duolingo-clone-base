"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SetStateAction } from "react";

type HeaderProps = {
  title: string;
  hideArrowBack?: boolean;
  setSelected?: React.Dispatch<
    SetStateAction<
      | {
          id: number;
          name: string;
          key: string;
          threadId: string;
        }
      | null
      | undefined
    >
  >;
};

export const Header = ({ title, hideArrowBack = false, setSelected }: HeaderProps) => {
  return (
    <div className="sticky top-0 mb-5 flex items-center justify-between border-b-2 bg-white pb-3 text-neutral-400 lg:z-50 lg:mt-[-28px] lg:pt-[28px]">
      {setSelected ? (
        <Button
          onClick={() => setSelected(null)}
          size="sm"
          variant="ghost"
          className={`${hideArrowBack && "hidden"}`}
        >
          <ArrowLeft className="h-5 w-5 stroke-2 text-neutral-400" />
        </Button>
      ) : (
        <Link href="/learn">
          <Button
            size="sm"
            variant="ghost"
            className={`${hideArrowBack && "hidden"}`}
          >
            <ArrowLeft className="h-5 w-5 stroke-2 text-neutral-400" />
          </Button>
        </Link>
      )}

      <h1 className="text-lg font-bold">{title}</h1>
      <div aria-hidden />
    </div>
  );
};
