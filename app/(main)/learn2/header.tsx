import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useSelectedCourseDetails } from "@/store/useSelectedCourseDetails";

type HeaderProps = {
  title: string;
};

export const Header = ({ title }: HeaderProps) => {
  const { setSelectedCourse, selectedCourse } = useSelectedCourseDetails();

  const courseDataArr = selectedCourse.courseData ?
    Object.entries(selectedCourse.courseData).map(([courseName, courseContent]) => ({
      courseName,
      courseContent
    })) :
    null;
  return (
    <div className="sticky top-0 mb-5 flex items-center justify-between border-b-2 bg-white pb-3 text-neutral-400 lg:z-50 lg:mt-[-28px] lg:pt-[28px]">
      <Link href="/courses">
        <Button size="sm" variant="ghost">
          <ArrowLeft className="h-5 w-5 stroke-2 text-neutral-400" />
        </Button>
      </Link>

      <h1 className="text-lg font-bold">{title}</h1>
      <div aria-hidden />
    </div>
  );
};
