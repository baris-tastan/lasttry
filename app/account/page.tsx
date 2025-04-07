// app/account/page.tsx
import { auth } from '@/auth'

import User from '@/api/userModel/route'
import Review from '@/lib/db/reviewModel'
import { connectToDatabase } from '@/api/db/route'

export default async function AccountPage() {
  const session = await auth()

  if (!session || !session.user?.email) {
    return <div className="p-6">Unauthorized</div>
  }

  await connectToDatabase()

  const user = await User.findOne({ email: session.user.email })
  if (!user) return <div className="p-6">User not found</div>

  const reviews = await Review.find({ user: user._id }).select('review rating product')
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

  return (
    <div className="p-6 space-y-2">
      <div><strong>Username:</strong> {user.name}</div>
      <div><strong>Average Rating:</strong> {avgRating.toFixed(2)}</div>
      <div><strong>Reviews:</strong></div>
      <div className="pl-4 space-y-1">
        {reviews.length === 0 ? (
          <div>No reviews yet.</div>
        ) : (
          reviews.map((r) => (
            <div key={r._id}>
              - <strong>Rating:</strong> {r.rating}, <strong>Comment:</strong> {r.review}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
