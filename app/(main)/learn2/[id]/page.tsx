import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Header } from "./header";
import { Unit } from "./unit";
import { LevelProgress } from "@/components/levelProgress";
import { getUserCourseById, getUserCourseProgressByCourseId } from "@/db/queries";
import { Course, UserCourseProgressType } from "@/types";
import { CoursePath } from "./coursePath";

const page = async ({ params }: { params: { id: string } }) => {
  const userCourseData = getUserCourseById(parseInt(params.id));
  const userCourseProgressData = getUserCourseProgressByCourseId(parseInt(params.id));
  
  const [userCourse, userProgress] = await Promise.all([userCourseData, userCourseProgressData]);

  const isNonEmptyObject = (variable: any) => {
    return typeof variable === "object" && variable !== null && Object.keys(variable).length > 0;
  }

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <LevelProgress data={userCourse?.courseData} userProgress={userProgress} />
      </StickyWrapper>
      <FeedWrapper>
        <Header data={userCourse?.courseData} />
        <CoursePath 
          data={userCourse?.courseData} 
          userProgress={isNonEmptyObject(userProgress) ? userProgress as UserCourseProgressType : null}
          id={params.id}
        />
      </FeedWrapper>
    </div>
  );
};

export default page;
