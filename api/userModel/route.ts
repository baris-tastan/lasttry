// models/User.ts
import {  IUserInput } from '@/types'
import { Document, Model, model, models, Schema } from 'mongoose'

export interface IUser extends Document, IUserInput {
  _id: string
  
  avgRating: number
  numReviews: number
  ratingDistribution: Array<{ rating: number; count: number }>
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    isAdmin: { type: String, required: true, default: 'user' },
    password: { type: String },
    avgRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    ratingDistribution: [
      {
        rating: { type: Number, required: true },
        count: { type: Number, required: true, default: 0 },
      },
    ],
    reviews: [
      {
        type: [String]
      },
    ],
  },
  {
    timestamps: true,
  }
)

const User = (models.User as Model<IUser>) || model<IUser>('User', userSchema)

export default User