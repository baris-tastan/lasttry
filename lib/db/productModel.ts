import { Document, Model, model, models, Schema } from 'mongoose'
import { IProductInput } from '@/types'

export interface IProduct extends Document, IProductInput {
  _id: string
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    slug:{
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    
    image: {
      type: String,
      required: true,
    },

    // Optional & conditional fields
    batteryLife: {
      type: String,
      required: false,
    },
    age: {
      type: String,
      required: false,
    },
    size: { type: [String], default: [] },
    material: {
      type: String,
      required: false,
    },

    // Ratings & reviews
    avgRating: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    ratingDistribution: [
      {
        rating: {
          type: Number,
          required: true,
        },
        count: {
          type: Number,
          required: true,
        },
      },
    ],
    reviews: {
      type: [String],
      default: [],
    },

    category: {
      type: String,
      required: true,
    },
    
    
  },
  {
    timestamps: true,
  }
)

const Product =
  (models.Product as Model<IProduct>) ||
  model<IProduct>('Product', productSchema)

export default Product
