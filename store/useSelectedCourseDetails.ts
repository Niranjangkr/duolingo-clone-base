import { Course } from "@/types";
import { create } from "zustand";

interface SelectedCourseState {
    selectedCourse: Course;
    setSelectedCourse: (course: Course) => void;
}

export const useSelectedCourseDetails = create<SelectedCourseState>((set) => ({
    selectedCourse: {
        courseData: null,
        createdAt: "",
        userId: "",
        id: ""
    },
    setSelectedCourse: (course) => set({ selectedCourse: course }),
}));