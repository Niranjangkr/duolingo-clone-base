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
        "flex h-[217px] w-[200px]  cursor-pointer flex-col items-center space-y-9 rounded-xl border-2 border-b-[4px] p-3 hover:bg-black/5 active:border-b-2"
      )}
    >
      <ImageIcon
        height={70}
        width={70}
        className="rounded-lg border object-cover drop-shadow-md"
      />

      <p className="mt-3 text-center w-full font-bold text-neutral-700 text-sm break-words">{title}</p>
      <Button onClick={() => onClick(pdfKey, title)}>Add Pdf</Button>
    </div>
  );
};
