"use client";

import { Check, Crown, Star } from "lucide-react";
import Link from "next/link";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import "react-circular-progressbar/dist/styles.css";

type LessonButtonProps = {
  id: number;
  index: number;
  totalCount: number;
  locked?: boolean;
  current?: boolean;
  questionIndex: number | undefined;
  userProgressLevel: string | undefined;
  currenLevel: string
};

export const LessonButton = ({
  id,
  index,
  totalCount,
  locked,
  current,
  questionIndex,
  userProgressLevel,
  currenLevel
}: LessonButtonProps) => {
  const cycleLength = 8;
  const cycleIndex = index % cycleLength;

  let indentationLevel;

  if (cycleIndex <= 2) indentationLevel = cycleIndex;
  else if (cycleIndex <= 4) indentationLevel = 4 - cycleIndex;
  else if (cycleIndex <= 6) indentationLevel = 4 - cycleIndex;
  else indentationLevel = cycleIndex - 8;

  const rightPosition = indentationLevel * 40;

  const isFirst = index === 0;
  const isLast = index === totalCount;
  // const isCompleted = !current && !locked;
  let isCompleted = false;

  if (typeof questionIndex === "number") {
    if (currenLevel === "basic" && userProgressLevel === "basic") {
      if (index < questionIndex) {
        isCompleted = true;
      }
    } else if(currenLevel === "basic" && userProgressLevel != "basic") {
      isCompleted = true;
    }

    if (currenLevel === "intermediate" && userProgressLevel === "intermediate") {
      if (index < questionIndex) {
        isCompleted = true;
      }
    } else if (currenLevel === "intermediate" && userProgressLevel === "basic") {
      isCompleted = false;
    } else if (currenLevel === "intermediate" && userProgressLevel === "advanced") {
      isCompleted = true;
    }

    if(currenLevel === "advanced" && userProgressLevel === "advanced"){
      if (index < questionIndex) {
        isCompleted = true;
      }
    } else if (currenLevel === "advanced" && userProgressLevel === "basic") {
      isCompleted = false;
    } else if (currenLevel === "advanced" && userProgressLevel === "intermediate") {
      isCompleted = false;
    }
  }
  

  // if(currenLevel === "intermediate"){
  //   console.log(`index: ${index}, questionIndex: ${questionIndex}, isComleted: ${isCompleted}`)
  // }
  const Icon = isCompleted ? Check : isLast ? Crown : Star;

  const href = isCompleted ? `/practice/${id.toString()}/${index}/${currenLevel}` : `/lesson2/${id.toString()}`;
  if(currenLevel === "advanced" && userProgressLevel === "advanced"){
    console.log(`index: ${index}, questionIndex: ${questionIndex}, isComleted: ${isCompleted}`)
  }

  return (
    <Link
      href={href}
      aria-disabled={locked}
      // style={{ pointerEvents: locked ? "none" : "auto" }}
    >
      <div
        className="relative"
        style={{
          right: `${rightPosition}px`,
          marginTop: isFirst && !isCompleted ? 60 : 24,
        }}
      >
        {current ? (
          <div className="relative h-[102px] w-[102px]">
            <div className="absolute -top-6 left-2.5 z-10 animate-bounce rounded-xl border-2 bg-white px-3 py-2.5 font-bold uppercase tracking-wide text-green-500">
              Start
              <div
                className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 transform border-x-8 border-t-8 border-x-transparent"
                aria-hidden
              />
            </div>
            <CircularProgressbarWithChildren
              value={Number.isNaN(50) ? 0 : 50}
              styles={{
                path: {
                  stroke: "#4ade80",
                },
                trail: {
                  stroke: "#e5e7eb",
                },
              }}
            >
              <Button
                size="rounded"
                variant={locked ? "locked" : "secondary"}
                className="h-[70px] w-[70px] border-b-8"
              >
                <Icon
                  className={cn(
                    "h-10 w-10",
                    locked
                      ? "fill-neutral-400 stroke-neutral-400 text-neutral-400"
                      : "fill-primary-foreground text-primary-foreground",
                    isCompleted && "fill-none stroke-[4]"
                  )}
                />
              </Button>
            </CircularProgressbarWithChildren>
          </div>
        ) : (
          <Button
            size="rounded"
            variant={isCompleted ? "secondary" : "locked"}
            className="h-[70px] w-[70px] border-b-8"
          >
            <Icon
              className={cn(
                "h-10 w-10",
                isCompleted
                  ? "fill-primary-foreground text-primary-foreground"
                  : "fill-neutral-400 stroke-neutral-400 text-neutral-400",
                isCompleted && "fill-none stroke-[4]"
              )}
            />
          </Button>
        )}
      </div>
    </Link>
  );
};
