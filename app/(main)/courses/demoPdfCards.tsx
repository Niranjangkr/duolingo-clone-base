import { Check, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CardProps = {
  title: string;
  id: number;
  ImageIcon: LucideIcon;
  onClick: (id: string, path: string) => void;
  pdfKey: string;
};

export const DemoPdfCard = ({
  title,
  id,
  ImageIcon,
  onClick,
  pdfKey
}: CardProps) => {

  return (
    <div
      className={cn(
        "flex h-[217px] w-[200px] flex-col items-center space-y-9 rounded-xl border-2 border-b-[4px] p-3  active:border-b-2 bg-zinc-100"
      )}
    >
      <ImageIcon
        height={70}
        width={70}
        className="rounded-lg border object-cover drop-shadow-md"
      />

      <p className="mt-3 text-center w-full font-bold text-neutral-700 break-words text-sm">{title}</p>
      <Button className="text-xs" onClick={() => onClick(pdfKey, title)}>CHECKOUT OUR COURSE</Button>
    </div>
  );
};
