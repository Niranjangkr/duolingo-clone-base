"use client";

import { Button } from "@/components/ui/button";
import { Card } from "./card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { Course } from "@/types";
import { useSelectedCourseDetails } from "@/store/useSelectedCourseDetails";

export const List = () => {
  const [topic, setTopic] = useState<string>('');
  const [courses, setCourses] = useState<Course[] | null>(null);
  const { setSelectedCourse } = useSelectedCourseDetails();
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    if (!topic) {
      toast.error("Topic field is empty");
      return;
    }
    const toastId = toast.loading("generating course...");
    try {
      const response = await axios.post("/api/course/generate", { topic })
      toast.dismiss(toastId);
      if (response.data.success) {
        console.log(response.data);
        toast.message("Course Successfully Created");
        fetchData();
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("failed to generate course");
      console.error("Error is: ", error);
    }finally{
      setOpen(false);
    }
  }

  const fetchData = async () => {
    const data = await axios.get("/api/course");
    setCourses(data.data);
    setSelectedCourse(data.data[0]);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className='flex w-full justify-end mb-5'>
        <Button
          className="bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-2 border-gray-300 rounded-lg"
          onClick={() => setOpen(true)}
        >
          Create Course
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Course</DialogTitle>
              <DialogDescription>
                <div className="grid flex-1 gap-2 py-5">
                  <Textarea
                    value={topic}
                    placeholder="Enter the course topic"
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleSubmit}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {courses && courses.map((data, idx) => (
        <Card idx={idx} data={data} />
      ))}
    </>
  );
};
