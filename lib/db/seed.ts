import data from '@/lib/data'
import { connectToDatabase } from '../../api/db/route'
import Product from './productModel'
import { cwd } from 'process'
import { loadEnvConfig } from '@next/env'
import User from '../../api/userModel/route'
import Review from './reviewModel'



loadEnvConfig(cwd())

const main = async () => {
  try {

    const { users, products } = data
    await connectToDatabase(process.env.MONGODB_URI)

    await User.deleteMany()
    const createdUser = await User.insertMany(users)

    await Product.deleteMany()
    const createdProducts = await Product.insertMany(products)

    await Review.deleteMany()
    
   

    console.log({
      createdProducts,
      createdUser,
      
      message: 'Seeded database successfully',
    })
    process.exit(0)
  } catch (error) {
    console.error(error)
    throw new Error('Failed to seed database')
  }
}

main()