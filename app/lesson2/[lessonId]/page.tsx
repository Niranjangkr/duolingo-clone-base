import { redirect } from "next/navigation";

import { getUserCourseById, getUserCourseProgressByCourseId } from "@/db/queries";

import { Quiz } from "./quiz";
import { CourseDataType, UserCourseProgressType } from "@/types";

const page = async ({ params }: { params: { lessonId: string } }) => {
  const userCourseData = getUserCourseById(parseInt(params.lessonId));
  const userCourseProgressData = getUserCourseProgressByCourseId(parseInt(params.lessonId));

  const [lesson, userCourseProgress] = await Promise.all([
    userCourseData,
    userCourseProgressData,
  ]);

  if (!lesson || !userCourseProgress) return redirect("/course2");

  const courseDataArr = lesson?.courseData ?
    Object.entries(lesson.courseData).map(([courseName, courseContent]) => ({
      courseName,
      courseContent
    })) :
    null;

  const userProgress = userCourseProgress as UserCourseProgressType;

  // const title = courseDataArr ? courseDataArr[0].courseContent[userProgress.level][userProgress.questionIndex].question : "";
  // const options = courseDataArr ? courseDataArr[0].courseContent[userProgress.level][userProgress.questionIndex].options : [];

  const totalQuestoins = courseDataArr ? courseDataArr[0]?.courseContent?.[userProgress.level].length : null;
  let completedQuestions = userProgress.questionIndex;

  // if (courseDataArr) {
  //   const courseContent = courseDataArr[0].courseContent as CourseDataType;
  //   if (userProgress.level === "basic") {
  //     completedQuestions = userProgress.questionIndex + 1;
  //   } else if (userProgress.level === "intermediate") {
  //     completedQuestions = (userProgress.questionIndex + 1) + courseContent[0]?.basic.length;
  //   } else if (userProgress.level === "advanced") {
  //     completedQuestions = (userProgress.questionIndex + 1) + courseContent[0]?.basic.length + courseContent[0]?.intermediate.length;
  //   }
  // }

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
    // <>hi</>
  );
};

export default page;

// <div className="flex flex-col justify-center items-center w-full h-full ">
//   <div className="w-[600px]">
//     <h1 className="font-bold text-4xl">{title}</h1>
//     {
//       (options as string[]).map((item, idx) => (
//         <ul key={idx} className="list-disc">
//           <li>{item}</li>
//         </ul>
//       ))
//     }
//   </div>
// </div>