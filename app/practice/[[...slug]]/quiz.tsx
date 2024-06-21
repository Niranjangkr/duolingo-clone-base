"use client";

import { useEffect, useState, useTransition } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { useAudio, useWindowSize, useMount } from "react-use";
import { toast } from "sonner";

import { reduceHearts } from "@/actions/user-progress";
import { MAX_HEARTS } from "@/constants";
import { challengeOptions, challenges, userSubscription } from "@/db/schema";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { usePracticeModal } from "@/store/use-practice-modal";

import { Challenge } from "./challenge";
import { Footer } from "./footer";
import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";
import { ResultCard } from "./result-card";
import { CourseDataType, Quiz as QuizType, Unit, userCourseProgressType2 } from "@/types";
import { upsertCourseProgress } from "@/actions/course-progress";

type QuizProps = {
  courseContent: QuizType[],
  initialPercentage: number,
  totalQuestoins: number,
  completedQuestions: number
  progress: userCourseProgressType2,
};

type Level = "basic" | "intermediate" | "advanced";

export const Quiz = ({
  courseContent,
  initialPercentage,
  totalQuestoins,
  completedQuestions,
  progress
}: QuizProps) => {
  const [correctAudio, _c, correctControls] = useAudio({ src: "/correct.wav" });
  const [incorrectAudio, _i, incorrectControls] = useAudio({
    src: "/incorrect.wav",
  });

  const [userProgress, setUserProgress] = useState(progress);
  const [currentCourseContent] = useState(courseContent);
  const [totalCompletedQuestions, setTotalCompletedQuestions] = useState(completedQuestions);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"none" | "wrong" | "correct">("none");

  const [finishAudio] = useAudio({
    src: "/finish.mp3",
    autoPlay: true,
  });
  const { width, height } = useWindowSize();

  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { open: openHeartsModal } = useHeartsModal();
  const { open: openPracticeModal } = usePracticeModal();
  const [selectedOption, setSelectedOption] = useState<string>();
  const [done, setDone] = useState<boolean>(false);

  const onNext = () => {
    if (totalCompletedQuestions > currentCourseContent.length) {
      setDone(true);
    } else {
      setTotalCompletedQuestions(prev => {
        let q = prev + 1;
        setPercentage((q / currentCourseContent.length) * 100);
        return prev + 1
      });
      setUserProgress(pre => ({
        ...pre,
        questionIndex: pre.questionIndex + 1
      }));
    }
  };

  const onSelect = (option: string) => {
    if (status !== "none") return;

    setSelectedOption(option);
  };


  useMount(() => {
    if (initialPercentage === 100) openPracticeModal();
  });

  const [percentage, setPercentage] = useState(() => {
    return initialPercentage === 100 ? 0 : initialPercentage;
  });


  const onContinue = () => {
    if (!selectedOption) return;

    if (status === "wrong") {
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    if (status === "correct") {
      onNext();
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    const correctOption = currentCourseContent[userProgress.questionIndex].correct_answer;

    if (!correctOption) return;

    if (correctOption === selectedOption) {
      startTransition(async() => {
        // update userCourseProgress DB table
        const lastQuestionCompleted = totalCompletedQuestions === currentCourseContent.length - 1;
        let level:Level = userProgress.level as Level;
        let questionIndex = userProgress.questionIndex;
        if(lastQuestionCompleted){
          questionIndex = 0;
          if(userProgress.level === "basic" as Level){
            level = "intermediate";
          }else if(userProgress.level === "intermediate" as Level){
            level = "advanced"
          }
        }
        void correctControls.play();
        setStatus("correct");
      });
    } else {
      startTransition(() => {
        void incorrectControls.play();
        setStatus("wrong");
      });
    }
  };

  useEffect(() => {
    if(totalCompletedQuestions <= currentCourseContent.length){
      setTitle(currentCourseContent[userProgress.questionIndex]?.question+("Practice"))
    }
  },[currentCourseContent, userProgress, totalCompletedQuestions]);

  if (((totalCompletedQuestions) >= (currentCourseContent.length))) {
    return (
      <>
        {finishAudio}
        <Confetti
          recycle={false}
          numberOfPieces={500}
          tweenDuration={10_000}
          width={width}
          height={height}
        />
        <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center gap-y-4 text-center lg:gap-y-8">
          <Image
            src="/finish.svg"
            alt="Finish"
            className="hidden lg:block"
            height={100}
            width={100}
          />

          <Image
            src="/finish.svg"
            alt="Finish"
            className="block lg:hidden"
            height={100}
            width={100}
          />

          <h1 className="text-lg font-bold text-neutral-700 lg:text-3xl">
            Great job! <br /> You&apos;ve completed the lesson.
          </h1>

          <div className="flex w-full items-center gap-x-4">
            <ResultCard variant="points" value={totalQuestoins * 100} />
            {/* <ResultCard
              variant="hearts"
              value={userSubscription?.isActive ? Infinity : hearts}
            /> */}
          </div>
        </div>

        {/* <Footer
          // lessonId={lessonId}
          status="completed"
          onCheck={() => router.push("/learn")}
        /> */}
      </>
    );
  }

  return (
    <>
      {incorrectAudio}
      {correctAudio}
      <Header
        totalCompletedQuestions={totalCompletedQuestions}
        totalQuestions={currentCourseContent.length}
        percentage={percentage}
      />

      <div className="flex-1">
        <div className="flex h-full items-center justify-center">
          <div className="flex w-full flex-col gap-y-12 px-6 lg:min-h-[350px] lg:w-[600px] lg:px-0">
            <h1 className="text-center text-lg font-bold text-neutral-700 lg:text-start lg:text-3xl">
              {title}
            </h1>

            <Challenge
              options={currentCourseContent[userProgress.questionIndex]?.options}
              onSelect={onSelect}
              status={status}
              selectedOption={selectedOption}
              disabled={pending}
            // type={challenge.type}
            />
          </div>
        </div>
      </div>

      <Footer
        disabled={pending || !selectedOption}
        status={status}
        onCheck={onContinue}
        explaination={currentCourseContent[userProgress.questionIndex].explanation}
      />
    </>
  );
};
