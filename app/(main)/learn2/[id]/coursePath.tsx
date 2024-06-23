"use client"

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CourseDataType, Quiz, UserCourseProgressType } from "@/types";
import { Unit } from "./unit";

type CoursePathProps = {
  data: CourseDataType | unknown,
  userProgress: UserCourseProgressType | null,
  id: string
};

export const CoursePath = ({ data, userProgress, id }: CoursePathProps) => {
  const courseDataArr = data ?
    Object.entries(data).map(([courseName, courseContent]) => ({
      courseName,
      courseContent
    })) :
    null;

  return (
    courseDataArr &&
    Object.entries(courseDataArr[0].courseContent).map((item, idx) => {
      if(item[0] === "description") return;
      let description = "";
      let activeLesson = item[0] === userProgress?.level;
      let questionIndex = userProgress?.questionIndex 

      if (item[0] === "basic") {
        description = `Learn the basics of ${courseDataArr[0].courseName}`
      } else if (item[0] === "intermediate") {
        description = `Learn intermediate ${courseDataArr[0].courseName}`
      } else if (item[0] === "advanced") {
        description = `Learn advanced ${courseDataArr[0].courseName}`
      }
      return (
        <div key={idx} className="mb-10">
          <Unit
            title={item[0] || ""}
            userProgressLevel={userProgress?.level}
            description={description || ""}
            data={item[1] as Quiz[]}
            activeLesson={activeLesson}
            questionIndex={questionIndex}
            id={id}
          />
        </div>
      )
    })
  );
};


{/* {units.map((unit) => (
          <div key={unit.id} className="mb-10">
            <Unit
              id={unit.id}
              order={unit.order}
              description={unit.description}
              title={unit.title}
              lessons={unit.lessons}
              activeLesson={courseProgress.activeLesson}
              activeLessonPercentage={lessonPercentage}
            />
          </div>
        ))} */}