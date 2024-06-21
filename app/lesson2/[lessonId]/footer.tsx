"use client"

import { CheckCircle, XCircle } from "lucide-react";
import { useKey, useMedia } from "react-use";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

type FooterProps = {
  onCheck: () => void;
  status: "correct" | "wrong" | "none" | "completed";
  disabled?: boolean;
  explaination?: string;
  // lessonId?: number;
};

export const Footer = ({
  onCheck,
  status,
  disabled,
  explaination
}: FooterProps) => {
  useKey("Enter", onCheck, {}, [onCheck]);
  const isMobile = useMedia("(max-width: 1024px)");
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <footer
      className={cn(
        "h-[100px] border-t-2 lg:h-[140px]",
        status === "correct" && "border-transparent bg-green-100",
        status === "wrong" && "border-transparent bg-rose-100"
      )}
    >
      <div className="mx-auto flex h-full max-w-[1140px] items-center justify-between px-6 lg:px-10">
        {status === "correct" && (
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center text-base font-bold text-green-500 lg:text-2xl">
              <CheckCircle className="mr-4 h-6 w-6 lg:h-10 lg:w-10" />
              Nicely done!
            </div>
            <p className="text-lg text-green-500 font-semibold">Explaination: {explaination}</p>
          </div>
        )}

        {status === "wrong" && (
          <div className="flex flex-col gap-y-2 text-base font-bold text-rose-500 lg:text-2xl">
            <div className="flex items-center">
              <XCircle className="mr-4 h-6 w-6 lg:h-10 lg:w-10" />
              Try again.
            </div>
            {
              showExplanation &&
              <p className="text-lg">Explaination: {explaination}</p>
            }
          </div>
        )}

        {/* {status === "completed" && (
          <Button
            variant="default"
            size={isMobile ? "sm" : "lg"}
            onClick={() => (window.location.href = `/lesson/${lessonId}`)}
          >
            Practice again
          </Button>
        )} */}

        <div className="flex space-x-2 items-center ml-auto">
          {
            status === "wrong" &&
            <Button
              disabled={disabled}
              aria-disabled={disabled}
              className="ml-auto"
              size={isMobile ? "sm" : "lg"}
              variant={status === "wrong" ? "super" : "secondary"}
              onClick={() => setShowExplanation(pre => !pre)}>
              Tip
            </Button>
          }

          <Button
            disabled={disabled}
            aria-disabled={disabled}
            className="ml-auto"
            onClick={onCheck}
            size={isMobile ? "sm" : "lg"}
            variant={status === "wrong" ? "danger" : "secondary"}
          >
            {status === "none" && "Check"}
            {status === "correct" && "Next"}
            {status === "wrong" && "Retry"}
            {status === "completed" && "Continue"}
          </Button>
        </div>
      </div>
    </footer>
  );
};