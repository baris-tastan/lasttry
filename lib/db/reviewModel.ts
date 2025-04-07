import { IReviewInput } from '@/types'
import { Document, Model, model, models, Schema } from 'mongoose'

export interface IReview extends Document, IReviewInput {
  _id: string
  createdAt: Date
  updatedAt: Date
}
const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: String,
      ref: 'User',
    },

    product: {
      type: String,
      ref: 'Product',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    review: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Review =
  (models.Review as Model<IReview>) || model<IReview>('Review', reviewSchema)

export default Review