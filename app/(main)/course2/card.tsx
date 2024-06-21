import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { useSelectedCourseDetails } from '@/store/useSelectedCourseDetails';
import { Course } from "@/types";
import { AvatarFallback } from "@radix-ui/react-avatar";

export const Card = ({ idx, data }: { idx: number, data: Course }) => {
  const courseDataArr = data.courseData ?
    Object.entries(data.courseData).map(([courseName, courseContent]) => ({
      courseName,
      courseContent
    })) :
    null;
    
  const { setSelectedCourse, selectedCourse } = useSelectedCourseDetails();
  return (
    <div
      key={idx}
      className={`flex w-full items-center rounded-xl p-2 px-4 hover:bg-gray-200/50 cursor-pointer ${data.id === selectedCourse.id ? "bg-gray-200/50" : ""}`}
      onClick={() => setSelectedCourse(data)}
    >
      <p className="mr-4 font-bold text-lime-700">{idx + 1}</p>

      <Avatar className="ml-3 mr-6 h-12 w-12 border bg-green-500">
        <AvatarImage
          src={""}
          className="object-cover"
        />
        <AvatarFallback className="w-full h-full flex justify-center items-center font-bold text-lg text-slate-50">{courseDataArr ? courseDataArr[0].courseName.charAt(0) : "U"}</AvatarFallback>
      </Avatar>

      <p className="flex-1 font-bold text-neutral-800">{courseDataArr ? courseDataArr[0].courseName : "N/A"}</p>
      <p className="text-muted-foreground">{12} XP</p>
    </div>
  );
};
