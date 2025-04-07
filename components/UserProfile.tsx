// components/UserProfile.tsx
'use client'

import { useEffect, useState } from 'react'
import { IUser } from '@/api/userModel/route'
import { IReview } from '@/lib/db/reviewModel'


export default function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<IUser | null>(null)
  const [, setReviews] = useState<IReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch user data
        const userResponse = await fetch(`/api/users/${userId}`)
        if (!userResponse.ok) {
          throw new Error(`Failed to fetch user: ${userResponse.status}`)
        }
        
        const userData = await userResponse.json()
        if (!userData?.user) {
          throw new Error('User data not found in response')
        }
        setUser(userData.user)

        // Fetch reviews
        const reviewsResponse = await fetch(`/api/reviews?userId=${userId}`)
        if (!reviewsResponse.ok) {
          throw new Error(`Failed to fetch reviews: ${reviewsResponse.status}`)
        }
        
        const reviewsData = await reviewsResponse.json()
        setReviews(reviewsData.reviews || [])

      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId])

  if (loading) return <div className="text-center py-8">Loading...</div>
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>
  if (!user) return <div className="text-center py-8">User not found</div>

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Rest of your component JSX remains the same */}
      {/* ... */}
    </div>
  )
}