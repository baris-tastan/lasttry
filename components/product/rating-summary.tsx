'use client'

import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { ChevronDownIcon, Star } from 'lucide-react'
type RatingSummaryProps = {
  asPopover?: boolean
  avgRating: number
  numReviews: number
  ratingDistribution: {
    rating: number
    count: number
  }[]
}


export function Rating({
  rating = 0,
  size = 6,
}: {
  rating: number
  size?: number
}) {
  const fullStars = Math.floor(rating)
  const partialStar = rating % 1
  const emptyStars = 5 - Math.ceil(rating)

  return (
    <div
      className='flex items-center'
      aria-label={`Rating: ${rating} out of 10 stars`}
    >
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className={`w-${size} h-${size} fill-primary text-primary`}
        />
      ))}
      {partialStar > 0 && (
        <div className='relative'>
          <Star className={`w-${size} h-${size} text-primary`} />
          <div
            className='absolute top-0 left-0 overflow-hidden'
            style={{ width: `${partialStar * 100}%` }}
          >
            <Star className='w-6 h-6 fill-primary text-primary' />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}
          className={`w-${size} h-${size}  text-primary`}
        />
      ))}
    </div>
  )
}
export default function RatingSummary({
  asPopover,
  avgRating = 0,
  numReviews = 0,
  ratingDistribution = [],
}: RatingSummaryProps) {
  const RatingDistribution = () => {
    const ratingPercentageDistribution = ratingDistribution.map((x) => ({
      ...x,
      percentage: Math.round((x.count / numReviews) * 100),
    }))

    return (
      <>
        <div className='flex flex-wrap items-center gap-1 cursor-help'>
          <Rating rating={avgRating} />
          <span className='text-lg font-semibold'>
            {avgRating.toFixed(1)} out of 5
          </span>
        </div>
        <div className='text-lg '>{numReviews} ratings</div>

        <div className='space-y-3'>
          {ratingPercentageDistribution
            .sort((a, b) => b.rating - a.rating)
            .map(({ rating, percentage }) => (
              <div
                key={rating}
                className='grid grid-cols-[50px_1fr_30px] gap-2 items-center'
              >
                <div className='text-sm'> {rating} star</div>
                <Progress value={percentage} className='h-4' />
                <div className='text-sm text-right'>{percentage}%</div>
              </div>
            ))}
        </div>
      </>
    )
  }

  return asPopover ? (
    <div className='flex items-center gap-1'>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='ghost' className='px-2 [&_svg]:size-6 text-base'>
            <span>{avgRating.toFixed(1)}</span>
            <Rating rating={avgRating} />
            <ChevronDownIcon className='w-5 h-5 text-muted-foreground' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-4' align='end'>
          <div className='flex flex-col gap-2'>
            <RatingDistribution />
            <Separator />

            <Link className='highlight-link text-center' href='#reviews'>
              See customer reviews
            </Link>
          </div>
        </PopoverContent>
      </Popover>
      <div className=' '>
        <Link href='#reviews' className='highlight-link'>
          {numReviews} ratings
        </Link>
      </div>
    </div>
  ) : (
    <RatingDistribution />
  )
}