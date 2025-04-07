'use server'

import { connectToDatabase } from '@/api/db/route'
import Product, { IProduct } from '@/lib/db/productModel'

import { ProductInputSchema } from '../validator'
import { IProductInput } from '@/types'
// CREATE
export async function createProduct(data: IProductInput) {
  try {
    const product = ProductInputSchema.parse(data)
    await connectToDatabase()
    await Product.create(product)
    revalidatePath('/admin/products')
    return {
      success: true,
      message: 'Product created successfully',
    }
  } catch (err) {
    throw new Error('Failed to create product ' + err)
  }
}

// GET ONE PRODUCT BY ID
export async function getProductById(productId: string) {
  await connectToDatabase()
  const product = await Product.findById(productId)
  return JSON.parse(JSON.stringify(product)) as IProduct
}
export async function getAllCategories() {
  await connectToDatabase()
  const categories = await Product.find().distinct(
    'category'
  )
  return categories
}
export async function getProductsForCard({
  tag,
  limit = 4,
}: {
  tag: string
  limit?: number
}) {
  await connectToDatabase()
  const products = await Product.find(
    { tags: { $in: [tag] }, isPublished: true },
    {
      name: 1,
      href: { $concat: ['/product/', '$slug'] },
      image: { $arrayElemAt: ['$images', 0] },
    }
  )
    .sort({ createdAt: 'desc' })
    .limit(limit)
  return JSON.parse(JSON.stringify(products)) as {
    name: string
    href: string
    image: string
  }[]
}

// GET ONE PRODUCT BY SLUG
export async function getProductBySlug(slug: string) {
    await connectToDatabase()
    const product = await Product.findOne({slug})
    if (!product) throw new Error('Product not found')
    return JSON.parse(JSON.stringify(product)) as IProduct
  }
  
// lib/actions/productActions.ts



export const getAllProducts = async () => {
  await connectToDatabase()
  const products = await Product.find().lean()
  return JSON.parse(JSON.stringify(products)) // ensure serializable data
}

  
import { revalidatePath } from 'next/cache'
import { PAGE_SIZE } from '../constants'

// DELETE
export async function deleteProduct(id: string) {
  try {
    await connectToDatabase()
    const res = await Product.findByIdAndDelete(id)
    if (!res) throw new Error('Product not found')
    revalidatePath('/admin/products')
    return {
      success: true,
      message: 'Product deleted successfully',
    }
  } catch  {
    throw new Error('Failed to delete product')
  }
}

// GET ALL PRODUCTS FOR ADMIN
export async function getAllProductsForAdmin({
  query,
  page = 1,
  
  limit,
}: {
  query: string
  page?: number
  sort?: string
  limit?: number
}) {
  await connectToDatabase()

  const pageSize = limit || PAGE_SIZE
  const queryFilter =
    query && query !== 'all'
      ? {
          name: {
            $regex: query,
            $options: 'i',
          },
        }
      : {}


  const products = await Product.find({
    ...queryFilter,
  })
    
    .skip(pageSize * (Number(page) - 1))
    .limit(pageSize)
    .lean()

  const countProducts = await Product.countDocuments({
    ...queryFilter,
  })
  return {
    products: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPages: Math.ceil(countProducts / pageSize),
    totalProducts: countProducts,
    from: pageSize * (Number(page) - 1) + 1,
    to: pageSize * (Number(page) - 1) + products.length,
  }
}