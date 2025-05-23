'use server'
import { signIn, signOut } from '@/auth'
import { IUserInput, IUserSignIn } from '@/types'
import { redirect } from 'next/navigation'

export async function signInWithCredentials(user: IUserSignIn) {
  return await signIn('credentials', { ...user, redirect: false })
}
export const SignOut = async () => {
  const redirectTo = await signOut({ redirect: false })
  redirect(redirectTo.redirect)
}

import { revalidatePath } from 'next/cache'
import { connectToDatabase } from '../../api/db/route'
import User, { IUser } from '../../api/userModel/route'
import { UserInputSchema } from '../validator'
import Product from './productModel'
import Review from './reviewModel'
import mongoose, { ClientSession } from 'mongoose'


export async function createProduct(data: IUserInput) {
  try {
    const user = UserInputSchema.parse(data)
    await connectToDatabase()
    await User.create(user)
    revalidatePath('/admin/users')
    return {
      success: true,
      message: 'User created successfully',
    }
  } catch (err) {
    throw new Error('Failed to create user ' + err)
  }
}
export async function createUser(userData: {
  name: string
  email: string
  password: string
  isAdmin: string
}) {
  await connectToDatabase()
  
  // Check if user already exists
  const existingUser = await User.findOne({ email: userData.email })
  if (existingUser) {
    throw new Error('User already exists')
  }
  
  // Create new user
  const newUser = await User.create({
    name: userData.name,
    email: userData.email,
    password: userData.password,
    isAdmin: userData.isAdmin,
  })

  return {
    ...newUser.toObject(),
    _id: newUser._id.toString(),
  }
}
// DELETE

export async function deleteUser(id: string) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await connectToDatabase();

    // 1. Find all reviews by this user
    const userReviews = await Review.find({ user: id }).session(session).lean();

    // 2. Process each review
    for (const review of userReviews) {
      // 1. Remove review from product's reviews array
      await Product.updateOne(
        { _id: review.product },
        { $pull: { reviews: review._id } }
      ).session(session);

      // 2. Delete the review document
      await Review.findByIdAndDelete(review._id).session(session);

      // 3. Recalculate product stats
      await updateProductReviewStats(review.product, session);
    }

    // 3. Now delete the user
    const deletedUser = await User.findByIdAndDelete(id).session(session);

    if (!deletedUser) {
      throw new Error('User not found');
    }

    await session.commitTransaction();
    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'User and all associated reviews deleted successfully',
    };
  } catch (error) {
    await session.abortTransaction();
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user and associated data');
  } finally {
    session.endSession();
  }
}


async function updateProductReviewStats(productId: string, session?: ClientSession) {
  
  const reviews = await Review.find({ product: productId })
    .session(session || null)
    .lean();

  const numReviews = reviews.length;

  
  const avgRating = numReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / numReviews
    : 0;

  
  const ratingDistribution = [
    { rating: 10, count: reviews.filter(r => r.rating === 10).length },
    { rating: 8, count: reviews.filter(r => r.rating === 8).length },
    { rating: 6, count: reviews.filter(r => r.rating === 6).length },
    { rating: 9, count: reviews.filter(r => r.rating === 10).length },
    { rating: 7, count: reviews.filter(r => r.rating === 8).length },
    { rating: 5, count: reviews.filter(r => r.rating === 6).length },
    { rating: 4, count: reviews.filter(r => r.rating === 10).length },
    { rating: 3, count: reviews.filter(r => r.rating === 8).length },
    { rating: 2, count: reviews.filter(r => r.rating === 6).length },
    { rating: 1, count: reviews.filter(r => r.rating === 10).length },
    
  ];

  // Update the product with new stats
  await Product.findByIdAndUpdate(
    productId,
    {
      avgRating,
      numReviews,
      ratingDistribution,
    },
    { session }
  );
}


// GET
export async function getAllUsers() {
  await connectToDatabase()

  const users = await User.find()
    .sort({ createdAt: 'desc' })
    .lean() 

  return {
    data: users as IUser[],
    
    totalPages: 1,
  }
}
