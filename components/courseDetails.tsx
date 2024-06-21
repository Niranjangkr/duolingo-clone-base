"use client"

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getUserCourseProgressByCourseId } from "@/db/queries";
import { useSelectedCourseDetails } from "@/store/useSelectedCourseDetails";
import { UserCourseProgressType } from "@/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type CourseDetailsProps = { completed: number };

export const CourseDetails = ({ completed }: CourseDetailsProps) => {
  const { setSelectedCourse, selectedCourse } = useSelectedCourseDetails();
  const [totalQuestion, setTotalQuestion] = useState<number | null>(null);
  const [completedQuestion, setCompletedQuestion] = useState<number | null>(null);
  const [userProgress, setUserProgress] = useState<UserCourseProgressType | undefined>();
  const [progress, setProgress] = useState<number>(0);
  const router = useRouter();
  const isNonEmptyObject = (variable: any) => {
    return typeof variable === "object" && variable !== null && Object.keys(variable).length > 0;
  }
  const courseDataArr = selectedCourse?.courseData ?
    Object.entries(selectedCourse?.courseData).map(([courseName, courseContent]) => ({
      courseName,
      courseContent
    })) :
    null;

  let totalBasicQuestions = 0;
  let totalIntermediateQuestions = 0;
  let totalAdvancedQuestions = 0;

  const handleClick = async (id: string) => {
    router.push(`/learn2/${id}`);
  }

  useEffect(() => {
    if (selectedCourse?.courseData) {
      const totalq = courseDataArr ? 
      ( selectedCourse?.courseData[courseDataArr[0].courseName]?.advanced?.length + 
        selectedCourse?.courseData[courseDataArr[0].courseName]?.basic?.length) + 
        selectedCourse?.courseData[courseDataArr[0].courseName]?.intermediate?.length : null;
      if (totalq) {
        setTotalQuestion(totalq);
      }

      if(userProgress?.level === "basic"){
        setCompletedQuestion(userProgress.questionIndex + 1);
      }else if(userProgress?.level === "intermediate"){
        if(courseDataArr){
        setCompletedQuestion((selectedCourse?.courseData[courseDataArr[0].courseName]?.basic?.length) + userProgress.questionIndex + 1)
        }
      }else if(userProgress?.level === "advanced"){
        if(courseDataArr){
        setCompletedQuestion((selectedCourse?.courseData[courseDataArr[0].courseName]?.basic?.length) + (selectedCourse?.courseData[courseDataArr[0].courseName]?.intermediate?.length) + userProgress.questionIndex + 1)
        }
      }

      const fetchProgressData = async () => {
        const id = parseInt(selectedCourse.id);
        const res = await axios.post(`/api/course/progress`, { id: id });
        // const [userProgress] = await Promise.all([userCourseProgressData]);
        if(res.data.success){
          const userProgress = res.data.data;
          
          if (userProgress && isNonEmptyObject(userProgress)) {
            const userProgressData = userProgress as UserCourseProgressType;
            setUserProgress(userProgressData);
  
            if (courseDataArr) {
              Object.entries(courseDataArr[0].courseContent).map(([level, questions]) => {
  
                if (Array.isArray(questions)) {
                  if (level === "basic") {
                    totalBasicQuestions = questions.length;
                  }
                  if (level === "intermediate") {
                    totalIntermediateQuestions = questions.length;
                  }
                  if (level === "advanced") {
                    totalAdvancedQuestions = questions.length;
                  }
                }
  
                setTotalQuestion(totalAdvancedQuestions + totalBasicQuestions + totalIntermediateQuestions);
                // if (userProgressData.level === "basic") {
                //   progress = ((userProgressData.questionIndex + 1) / totalQuestion) * 100;
                // } else if (userProgressData.level === "intermediate") {
                //   progress = ((userProgressData.questionIndex + 1 + totalBasicQuestions) / totalQuestion) * 100;
                // } else if (userProgressData.level === "advanced") {
                //   progress = ((userProgressData.questionIndex + 1 + totalBasicQuestions + totalIntermediateQuestions) / totalQuestion) * 100;
                // }
  
              })
            }
          }
        }
      }

      if(selectedCourse?.id){
        fetchProgressData();
      }
    }
  }, [selectedCourse]);

  useEffect(() => {
    console.log(completedQuestion, totalQuestion)
    if(completedQuestion && totalQuestion)
      setProgress((completedQuestion/totalQuestion) * 100)
  }, [completedQuestion, totalQuestion]);

  useEffect(() => {
    if(selectedCourse.courseData){
      if(userProgress?.level === "basic"){
        setCompletedQuestion(userProgress.questionIndex + 1);
      }else if(userProgress?.level === "intermediate"){
        if(courseDataArr){
        setCompletedQuestion((selectedCourse?.courseData[courseDataArr[0].courseName]?.basic?.length) + userProgress.questionIndex + 1)
        }
      }else if(userProgress?.level === "advanced"){
        if(courseDataArr){
        setCompletedQuestion((selectedCourse?.courseData[courseDataArr[0].courseName]?.basic?.length) + (selectedCourse?.courseData[courseDataArr[0].courseName]?.intermediate?.length) + userProgress.questionIndex + 1)
        }
      }
    }
  }, [userProgress]);


  return (
    selectedCourse?.id &&
    (
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
            <div className="flex w-full flex-col gap-y-2">
              <div className="flex justify-between">
                <p className="text-sm font-bold text-neutral-700">
                  {'Progress'}
                </p>
                <p>{`${completedQuestion}/${totalQuestion}`}</p>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
          <Button className="w-full justify-center bg-green-400 text-white" onClick={() => handleClick(selectedCourse.id)}>start</Button>
        </ul>
      </div>
    )
  );
};
