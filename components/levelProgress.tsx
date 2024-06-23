"use client"

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QUESTS } from "@/constants";
import { CourseDataType, UserCourseProgressType } from "@/types";
import { useState } from "react";

type LevelProgressProps = {
  data: CourseDataType | unknown,
  userProgress: UserCourseProgressType | never[] | undefined
};

export const LevelProgress = ({ data, userProgress }: LevelProgressProps) => {
  const isNonEmptyObject = (variable: any) => {
    return typeof variable === "object" && variable !== null && Object.keys(variable).length > 0;
  }

  const courseDataArr = data ?
    Object.entries(data).map(([courseName, courseContent]) => ({
      courseName,
      courseContent
    })) :
    null;

  return (
    <div className="space-y-4 rounded-xl border-2 p-4">
      <div className="flex w-full items-center justify-between space-y-2">
        <h3 className="text-lg font-bold">Status</h3>
      </div>

      <ul className="w-full space-y-4">
        {
          courseDataArr &&
          Object.entries(courseDataArr[0].courseContent).map(([level, questions]) => {
            if(level == "description") return;
            let total = 0;
            let points = 0;

            if (Array.isArray(questions)) {
              total = questions.length;
            }

            if (userProgress && isNonEmptyObject(userProgress)) {
              const userProgressData = userProgress as UserCourseProgressType;
              if (userProgressData.level === level) {
                points = (userProgressData.questionIndex) + 1;
              }else if(userProgressData.level === 'intermediate' && level === 'basic'){
                points = total;
              }else if(userProgressData.level === 'advanced'){
                if(level === "basic" || level === "intermediate"){
                  points = total;
                }else{
                  points = userProgressData.questionIndex + 1;
                }
              }
            }

            const progress = (points / total) * 100;

            return (
              <div className="flex w-full items-center gap-x-3 pb-4">
                <div className="flex w-full flex-col gap-y-2">
                  <p className="text-sm font-bold text-neutral-700 flex justify-between">
                    <span>{level}</span>
                    <span>{points+"/"+total}</span>
                  </p>

                  <Progress value={progress} className="h-2" />
                </div>
              </div>
            )
          })
        }
      </ul>
    </div>
  );
};
