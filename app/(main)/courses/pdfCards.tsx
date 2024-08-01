import { Check, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type CardProps = {
  title: string;
  id: number;
  ImageIcon: LucideIcon;
  onClick: (id: number) => void;
  disabled?: boolean;
  isActive?: boolean;
};

export const PdfCard = ({
  title,
  id,
  ImageIcon,
  onClick,
  disabled,
  isActive,
}: CardProps) => {

  return (
    <div
      onClick={() => onClick(id)}
      className={cn(
        "flex h-[217px] w-[200px]  cursor-pointer flex-col items-center space-y-9 rounded-xl border-2 border-b-[4px] p-3 hover:bg-black/5 active:border-b-2",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      <ImageIcon
        height={70}
        width={70}
        className="rounded-lg border object-cover drop-shadow-md"
      />

      <p className="mt-3 text-center w-full font-bold text-neutral-700 text-sm break-words">{title}</p>
    </div>
  );
};
