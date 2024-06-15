"use client"

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSelectedCourseDetails } from "@/store/useSelectedCourseDetails";
import { useEffect, useState } from "react";

type CourseDetailsProps = { completed: number };

export const CourseDetails = ({ completed }: CourseDetailsProps) => {
  const { setSelectedCourse, selectedCourse } = useSelectedCourseDetails();
  const [totalQuestion, setTotalQuestion] = useState<number | null>(null);

  const courseDataArr = selectedCourse.courseData ?
    Object.entries(selectedCourse.courseData).map(([courseName, courseContent]) => ({
      courseName,
      courseContent
    })) :
    null;

  const progress = (completed / 150) * 100;

  useEffect(() => {
    if(selectedCourse.courseData){
      const totalq = courseDataArr ? (selectedCourse.courseData[courseDataArr[0].courseName].advanced?.length + selectedCourse.courseData[courseDataArr[0].courseName].basic?.length) + selectedCourse.courseData[courseDataArr[0].courseName].intermediate?.length : null;
      if(totalq){
        setTotalQuestion(totalq);
      }
    }
  }, [selectedCourse.courseData]); 

  return (
    <div className="space-y-4 rounded-xl border-2 p-4 mt-56">
      <div className="flex w-full items-center justify-center space-y-2">
        <h3 className="text-lg font-bold">Course Details</h3>
      </div>

      <ul className="w-full space-y-4">

        <h2 className="flex w-full items-center gap-x-3 pb-4 font-bold">Topic: {courseDataArr ? courseDataArr[0].courseName : ""}</h2>
        <div>
          <p>number of questions: {totalQuestion}</p>
          <p>
            createdAt: {Object.keys(selectedCourse).length === 0 ? "N/A" : new Date(selectedCourse.createdAt).toLocaleDateString("US-en", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex w-full items-center gap-x-3 pb-4">
          {/* <Image src="/points.svg" alt="Points" width={40} height={40} /> */}
          <div className="flex w-full flex-col gap-y-2">
            <p className="text-sm font-bold text-neutral-700">
              {'Progress'}
            </p>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
        <Button className="w-full justify-center bg-green-400 text-white">start</Button>
      </ul>
    </div>
  );
};
