import { ProductInputSchema,ReviewInputSchema,UserInputSchema, UserSignInSchema, } from '@/lib/validator'
import { z } from 'zod'

export type IProductInput = z.infer<typeof ProductInputSchema>
export type Data = {
  users: IUserInput[]
  products: IProductInput[]
  
}


export type IUserInput = z.infer<typeof UserInputSchema>
export type IUserSignIn = z.infer<typeof UserSignInSchema>

export type IReviewInput = z.infer<typeof ReviewInputSchema>
export type IReviewDetails = IReviewInput & {
  _id: string
  user: {
    name: string
  }
  reviews: {
    title: string
    rating: number
    comment: string
  }[]
}

  