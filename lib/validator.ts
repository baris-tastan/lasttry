

import { z } from 'zod'

// utils/slugify.ts


export const ReviewInputSchema = z.object({
  product: z.string(),
  user: z.string(),
  title: z.string(),
  review: z.string().min(1),
  rating: z.coerce
    .number()
    .int()
    .min(0)
    .max(10),
})

export const ProductInputSchema = z.object({

    
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    price: z.number(), 
    image: z.string(),
    category: z.string(),
    size: z.array(z.string()).default([]).optional(),
  
    batteryLife: z.string().optional(), // Only for GPS sport watches
    age: z.string().optional(),         // Only for antique furniture and vinyls
    
    material: z.string().optional(),    // For antique furniture and running shoes
  

  avgRating: z.coerce
    .number()
    .min(0)
    .max(10),
  numReviews: z.coerce
    .number()
    .int()
    .nonnegative(),
  ratingDistribution: z
    .array(z.object({ rating: z.number(), count: z.number() }))
    .max(10),
  
  reviews: z.array(z.string()),
  
})



export const UserInputSchema = z.object({
  name: z.string().min(1),
  email: z.string().min(1).email('Email is invalid'),
  isAdmin: z.string().default('user'),
  password: z.string().min(1),
  avgRating: z.number().min(0).max(10),
  numReviews: z.coerce
    .number()
    .int()
    .nonnegative(),
  ratingDistribution: z
    .array(z.object({ rating: z.number(), count: z.number() }))
    .max(10),
  reviews: z.array(z.string()).default([]),

})

export const UserSignInSchema = z.object({
  email: z.string().min(1).email('Email is invalid'),
  password: z.string().min(1),
})

export const ProductUpdateSchema = ProductInputSchema.extend({
  _id: z.string(),
})

