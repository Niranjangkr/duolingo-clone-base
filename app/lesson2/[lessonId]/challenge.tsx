import { challengeOptions, challenges } from "@/db/schema";
import { cn } from "@/lib/utils";

import { Card } from "./card";

type ChallengeProps = {
  options: string[];
  onSelect: (id: string) => void;
  status: "correct" | "wrong" | "none";
  selectedOption?: string;
  disabled?: boolean;
};

export const Challenge = ({
  options,
  onSelect,
  status,
  selectedOption,
  disabled,
}: ChallengeProps) => {
  return (
    <div
      className={cn(
        "grid gap-2"
      )}
    >
      {options?.map((option, i) => (
        <Card
          key={i}
          text={option}
          // shortcut={`${i + 1}`}
          selected={selectedOption === option}
          onClick={() => onSelect(option)}
          status={status}
        />
      ))}
    </div>
  );
};
