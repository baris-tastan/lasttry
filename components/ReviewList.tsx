// components/ReviewList.tsx
'use client'

import { useEffect, useState } from 'react'
import { IReviewDetails } from '@/types'

//import Link from 'next/link'
import { Star } from 'lucide-react'

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
        aria-label={`Rating: ${rating} out of 5 stars`}
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
export function ReviewList({ userId }: { userId: string }) {
  const [reviews, setReviews] = useState<IReviewDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews?userId=${userId}`)
        const data = await response.json()
        setReviews(data.reviews)
      } catch (error) {
        console.error('Error fetching reviews:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [userId])

  if (loading) return <div>Loading reviews...</div>
  if (!reviews.length) return <div>No reviews yet.</div>

  return (
    <div className="space-y-4">
      {reviews.map((review) => (

        <div key={review._id} className="border-b pb-4">
          <div className="flex justify-between items-start">
            
            
          </div>
          <p className="mt-2 text-gray-700">{review.review}</p>
        </div>
      ))}
    </div>
  )
}