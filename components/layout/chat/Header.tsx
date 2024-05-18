import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type HeaderProps = {
  title: string;
  totalMessages: number;
};

export const Header = ({ title, totalMessages }: HeaderProps) => {
  return (
    <div className="sticky top-0 mb-5 px-5 flex items-center justify-between border-b-2 bg-white pb-3 lg:z-50 lg:mt-[-28px] lg:pt-[28px]">
      <div>
      <h1 className="text-xl font-bold ">{title}</h1>
      <p className="text-sm">{totalMessages} messages</p>
      </div>
      <div aria-hidden />
    </div>
  );
};
