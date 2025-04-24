'use server'


import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { auth } from '@/auth'

import { connectToDatabase } from '../../api/db/route'
import Product from '../db/productModel'
import Review, { IReview } from '../db/reviewModel'

import { ReviewInputSchema } from '../validator'
import { IReviewDetails } from '@/types'
import { PAGE_SIZE } from '../constants'
import User from '../../api/userModel/route'
//import User from './userModel'

async function updateUserReviewStats(userId: string) {
  const user = await User.findById(userId).populate('reviews') // optional if you store actual Review documents

  if (!user) return

  const reviews = await Review.find({ user: userId })

  const numReviews = reviews.length
  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0)
  const avgRating = numReviews > 0 ? totalRating / numReviews : 0

  // Generate rating distribution
  const distributionMap = new Map<number, number>()
  for (let i = 1; i <= 5; i++) distributionMap.set(i, 0)
  reviews.forEach((review) => {
    distributionMap.set(review.rating, (distributionMap.get(review.rating) || 0) + 1)
  })
  const ratingDistribution = Array.from(distributionMap.entries()).map(([rating, count]) => ({
    rating,
    count,
  }))

  // Update user
  user.avgRating = avgRating
  user.numReviews = numReviews
  user.ratingDistribution = ratingDistribution

  await user.save()
}

export async function createUpdateReview({
  data,
  path,
}: {
  data: z.infer<typeof ReviewInputSchema>
  path: string
}) {
  try {
    const session = await auth()
    if (!session) throw new Error('User is not authenticated')

    const userId = session.user.id
    if (!userId) throw new Error('User ID not found in session')

    const reviewData = ReviewInputSchema.parse({
      ...data,
      user: userId,
    })

    await connectToDatabase()

    const existingReview = await Review.findOne({
      product: reviewData.product,
      user: reviewData.user,
    })

    const user = await User.findById(userId)
    const product = await Product.findById(reviewData.product)

    if (!user || !product) throw new Error('User or Product not found')

    if (existingReview) {
      // Update existing review
      existingReview.review = reviewData.review
      existingReview.rating = reviewData.rating
      await existingReview.save()
    } else {
      // Create new review
      const newReview = await Review.create(reviewData)

      // Add review ID to product
      product.reviews.push(newReview._id.toString())
      await product.save()

      // Add review ID to user
      user.reviews.push(newReview._id.toString())
      await user.save()
    }

    await updateProductReview(reviewData.product)
    await updateUserReviewStats(userId)

    revalidatePath(path)

    return {
      success: true,
      message: existingReview ? 'Review updated successfully' : 'Review created successfully',
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Something went wrong',
    }
  }
}



const updateProductReview = async (productId: string) => {
  // Calculate the new average rating, number of reviews, and rating distribution
  const result = await Review.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 },
      },
    },
  ])
  // Calculate the total number of reviews and average rating
  const totalReviews = result.reduce((sum, { count }) => sum + count, 0)
  const avgRating =
    result.reduce((sum, { _id, count }) => sum + _id * count, 0) / totalReviews

  // Convert aggregation result to a map for easier lookup
  const ratingMap = result.reduce((map, { _id, count }) => {
    map[_id] = count
    return map
  }, {})
  // Ensure all ratings 1-5 are represented, with missing ones set to count: 0
  const ratingDistribution = []
  for (let i = 1; i <= 5; i++) {
    ratingDistribution.push({ rating: i, count: ratingMap[i] || 0 })
  }
  // Update product fields with calculated values
  const foundProduct = await Product.findOne({ _id: productId });
if (foundProduct) {
  foundProduct.avgRating = avgRating;
  foundProduct.numReviews = totalReviews;
  foundProduct.ratingDistribution = ratingDistribution;
  await foundProduct.save();
} else {
  // Handle the case where no product is found
  
  throw new Error(`Product not found with ID ${productId}`);
}
  await foundProduct.save();
  
}

export async function getReviews({
  productId,
  limit,
  page,
}: {
  productId: string
  limit?: number
  page: number
}) {
  limit = limit || PAGE_SIZE
  await connectToDatabase()
  const skipAmount = (page - 1) * limit
  const reviews = await Review.find({ product: productId })
    .populate('user', 'name')
    
    .skip(skipAmount)
    .limit(limit)
  console.log(reviews)
  const reviewsCount = await Review.countDocuments({ product: productId })
  return {
    data: JSON.parse(JSON.stringify(reviews)) as IReviewDetails[],
    totalPages: reviewsCount === 0 ? 1 : Math.ceil(reviewsCount / limit),
  }
}
export const getReviewByProductId = async ({
  productId,
}: {
  productId: string
}) => {
  await connectToDatabase()
  const session = await auth()
  if (!session) {
    throw new Error('User is not authenticated')
  }
  const review = await Review.findOne({
    product: productId,
    user: session?.user?.id,
  })
  return review ? (JSON.parse(JSON.stringify(review)) as IReview) : null
}
