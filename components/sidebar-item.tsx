"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type SidebarItemProps = {
  label: string;
  iconSrc: string;
  href: string;
};

export const SidebarItem = ({ label, iconSrc, href }: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Button
      variant={isActive ? "sidebarOutline" : "sidebar"}
      className={`h-[52px] justify-start ${(label === 'Quests' || label === 'Shop') ? '' :''}`}
      asChild
      onClick={() => {
        if((label === 'Quests' || label === 'Shop')){
          toast.error('This feature is in progress')
        }
      }}
    >
      <Link className={`${(label === 'Quests' || label === 'Shop') ? 'pointer-events-none !text-slate-300' : '' }`} href={(label === 'Quests' || label === 'Shop') ? '#' : href}>
        <Image
          src={iconSrc}
          alt={label}
          className="mr-5"
          height={32}
          width={32}
        />
        {label}
      </Link>
    </Button>
  );
};
