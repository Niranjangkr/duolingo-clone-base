import React from 'react'
import { CourseDetails } from '@/components/courseDetails'
import { FeedWrapper } from '@/components/feed-wrapper'
import { StickyWrapper } from '@/components/sticky-wrapper'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import { List } from './list'

const page = () => {
  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <CourseDetails completed={12} />
      </StickyWrapper>

      <FeedWrapper>
        <div className="flex w-full flex-col items-center">
          <Image
            src="/leaderboard.svg"
            alt="Leaderboard"
            height={90}
            width={90}
          />

          <h1 className="my-6 text-center text-2xl font-bold text-neutral-800">
            Your Courses
          </h1>
          <p className="mb-6 text-center text-lg text-muted-foreground">
            Start learning new things, keep upgrading yourself.
          </p>
          <Separator className="mb-4 h-0.5 rounded-full" />
          <List />
        </div>
      </FeedWrapper>
    </div>
  )
}

export default page