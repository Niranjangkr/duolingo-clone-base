import { lessons, units } from "@/db/schema";

import { LessonButton } from "./lesson-button";
import { UnitBanner } from "./unit-banner";
import { Quiz } from "@/types";

type UnitProps = {
  id: string;
  // order: number;
  title: string;
  description: string;
  data: Quiz[];
  questionIndex: number | undefined;
  activeLesson:boolean;
  userProgressLevel:string | undefined
  // })
  // | undefined;
  // activeLessonPercentage: number;
};

export const Unit = ({
  title,
  description,
  data,
  activeLesson,
  questionIndex,
  userProgressLevel,
  id,
  // activeLessonPercentage,
}: UnitProps) => {
  return (
    <>
      <UnitBanner title={title} description={description} />

      <div className="relative flex flex-col items-center">
        {data.map((question, i) => {
          // const isCurrent = lesson.id === activeLesson?.id;
          // const isLocked = !lesson.completed && !isCurrent;
          return (
            <LessonButton
              key={i}
              id={parseInt(id)}
              index={i}
              totalCount={data.length - 1}
              current={activeLesson && questionIndex === i ? true : false }
              locked={activeLesson && questionIndex === i ? false : true }
              questionIndex={questionIndex}
              userProgressLevel={userProgressLevel}
              currenLevel={title}
            />
          );
        })}
      </div>
    </>
  );
};
