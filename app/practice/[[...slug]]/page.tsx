import { redirect } from "next/navigation";

import { getUserCourseById } from "@/db/queries";

import { Quiz } from "./quiz";
import { userCourseProgressType2 } from "@/types";

const page = async ({ params }: { params: { slug: ['id', 'index', 'currentLevel'] } }) => {
  const userCourseData = getUserCourseById(parseInt(params.slug[0]));
  let userCourseProgress = {
    level: params.slug[2],
    questionIndex: params.slug[1] === "index" ? 0 : parseInt(params.slug[1])
  };

  const [lesson] = await Promise.all([
    userCourseData,
  ]);


  if (!lesson || !userCourseProgress) return redirect("/course2");

  const courseDataArr = lesson?.courseData ?
    Object.entries(lesson.courseData).map(([courseName, courseContent]) => ({
      courseName,
      courseContent
    })) :
    null;

  const userProgress = userCourseProgress as userCourseProgressType2;
  const totalQuestoins = courseDataArr ? courseDataArr[0]?.courseContent?.[userProgress.level].length : null;
  let completedQuestions = userProgress.questionIndex;

  const initialPercentage = (completedQuestions / totalQuestoins) * 100;

  return (
    courseDataArr && courseDataArr[0] &&
    <Quiz
      courseContent={courseDataArr[0].courseContent[userProgress.level]}
      initialPercentage={initialPercentage || 0}
      totalQuestoins={totalQuestoins || 0}
      completedQuestions={userProgress.questionIndex}
      progress={userProgress}
    />
  );
};

export default page;