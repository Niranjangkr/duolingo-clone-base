import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CourseDataType } from "@/types";

type HeaderProps = {
  data: CourseDataType | unknown,
};

export const Header = ({ data }: HeaderProps) => {
  const courseDataArr = data ?
    Object.entries(data).map(([courseName, courseContent]) => ({
      courseName,
      courseContent
    })) :
    null;

  return (
    <div className="sticky top-0 mb-5 flex items-center justify-between border-b-2 bg-white pb-3 text-neutral-400 lg:z-50 lg:mt-[-28px] lg:pt-[28px]">
      <Link href="/course2">
        <Button size="sm" variant="ghost">
          <ArrowLeft className="h-5 w-5 stroke-2 text-neutral-400" />
        </Button>
      </Link>

      <h1 className="text-lg font-bold">{courseDataArr && courseDataArr[0].courseName}</h1>
      <div aria-hidden />
    </div>
  );
};
