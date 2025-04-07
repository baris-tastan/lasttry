/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DeleteDialog from '@/components/shared/delete-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  deleteProduct,
  createProduct,
  getAllProductsForAdmin,
} from '@/lib/db/productActions'
import { IProduct } from '@/lib/db/productModel'
import { slugify } from '@/lib/utils'
import { IProductInput } from '@/types'

type ProductListDataProps = {
  products: IProduct[]
  totalPages: number
  totalProducts: number
  to: number
  from: number
}

const ProductList = () => {
  const [page, setPage] = useState<number>(1)
  const [inputValue, setInputValue] = useState<string>('')
  const [data, setData] = useState<ProductListDataProps>()
  const [isPending, startTransition] = useTransition()

  const [newProduct, setNewProduct] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    image: '',
    category: '',
    size: '',
    batteryLife: '',
    age: '',
    material: '',
  })

  const handlePageChange = (changeType: 'next' | 'prev') => {
    const newPage = changeType === 'next' ? page + 1 : page - 1
    setPage(newPage)
    startTransition(async () => {
      const data = await getAllProductsForAdmin({
        query: inputValue,
        page: newPage,
      })
      setData(data)
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    if (value) {
      clearTimeout((window as any).debounce)
      ;(window as any).debounce = setTimeout(() => {
        startTransition(async () => {
          const data = await getAllProductsForAdmin({ query: value, page: 1 })
          setData(data)
        })
      }, 500)
    } else {
      startTransition(async () => {
        const data = await getAllProductsForAdmin({ query: '', page })
        setData(data)
      })
    }
  }

  const handleNewProductChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    setNewProduct((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Generate slug from name if not provided
      const slug =  slugify(newProduct.name)
      
      const formattedProduct : IProductInput = {
        
        name: newProduct.name,
        slug,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        image: newProduct.image,
        category: newProduct.category,
        size: newProduct.size ? newProduct.size.split(',').map(s => s.trim()) : [],
        batteryLife: newProduct.batteryLife,
        age: newProduct.age,
        material: newProduct.material,
        reviews: [],
        avgRating: 0,
        numReviews: 0,
        ratingDistribution: [
          { rating: 10, count: 0 },
          { rating: 8, count: 0 },
          { rating: 6, count: 0 },
        ],
      }
  
      const result = await createProduct(formattedProduct)
      
      if (!result.success) {
        throw new Error( 'Failed to create product')
      }
  
      // Reset form
      setNewProduct({
        
        name: '',
        slug: '',
        description: '',
        price: '',
        image: '',
        category: '',
        size: '',
        batteryLife: '',
        age: '',
        material: '',
      })
  
      // Refresh product list
      startTransition(async () => {
        const data = await getAllProductsForAdmin({ query: '', page: 1 })
        setData(data)
        setPage(1) // Reset to first page
      })
  
      // Show success message
      alert('Product created successfully!')
    } catch (err: any) {
      console.error('Error creating product:', err)
      alert(`Error: ${err.message}`)
    }
  }

  useEffect(() => {
    startTransition(async () => {
      const data = await getAllProductsForAdmin({ query: '' })
      setData(data)
    })
  }, [])

  return (
    <div>
      <div className='space-y-4'>
        {/* Create Product Form */}
        <form onSubmit={handleCreateProduct} className='space-y-4 mb-6'>
          <h2 className='text-xl font-semibold'>Create New Product</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input name='name' placeholder='Name' value={newProduct.name} onChange={handleNewProductChange} required />
            <Input name='description' placeholder='Description' value={newProduct.description} onChange={handleNewProductChange} required />
            <Input name='price' type='number' placeholder='Price' value={newProduct.price} onChange={handleNewProductChange} required />
            <Input name='image' placeholder='only supports "/images/(shoe|gps|vinyl|antique).jpeg' value={newProduct.image} onChange={handleNewProductChange} required />
            <Input name='category' placeholder='Category' value={newProduct.category} onChange={handleNewProductChange} required />
            <Input name='size' placeholder='Sizes (comma-separated)' value={newProduct.size} onChange={handleNewProductChange} />
            <Input name='batteryLife' placeholder='Battery Life' value={newProduct.batteryLife} onChange={handleNewProductChange} />
            <Input name='age' placeholder='Age (e.g. 20 years)' value={newProduct.age} onChange={handleNewProductChange} />
            <Input name='material' placeholder='Material' value={newProduct.material} onChange={handleNewProductChange} />
          </div>
          <Button type='submit'>Create Product</Button>
        </form>

        {/* Header and Filter */}
        <div className='flex-between flex-wrap gap-2'>
          <div className='flex flex-wrap items-center gap-2'>
            <h1 className='font-bold text-lg'>Products</h1>
            <div className='flex items-center gap-2'>
              <Input
                className='w-auto'
                type='text'
                value={inputValue}
                onChange={handleInputChange}
                placeholder='Filter name...'
              />
              {isPending ? (
                <p>Loading...</p>
              ) : (
                <p>
                  {data?.totalProducts === 0
                    ? 'No'
                    : `${data?.from}-${data?.to} of ${data?.totalProducts}`}
                  {' results'}
                </p>
              )}
            </div>
          </div>
          
        </div>

        {/* Product Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className='text-right'>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className='w-[100px]'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.products.map((product: IProduct) => (
              <TableRow key={product._id}>
                <TableCell>{product._id}</TableCell>
                <TableCell>
                  <Link href={`/admin/products/${product._id}`}>
                    {product.name}
                  </Link>
                </TableCell>
                <TableCell className='text-right'>${product.price}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.avgRating}</TableCell>
                <TableCell className='flex gap-1'>
                  <Button asChild variant='outline' size='sm'>
                    <Link target='_blank' href={`/product/${product.slug}`}>
                      View
                    </Link>
                  </Button>
                  <DeleteDialog
                    id={product._id}
                    action={deleteProduct}
                    callbackAction={() => {
                      startTransition(async () => {
                        const data = await getAllProductsForAdmin({
                          query: inputValue,
                        })
                        setData(data)
                      })
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        {(data?.totalPages ?? 0) > 1 && (
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              onClick={() => handlePageChange('prev')}
              disabled={page <= 1}
              className='w-24'
            >
              <ChevronLeft /> Previous
            </Button>
            Page {page} of {data?.totalPages}
            <Button
              variant='outline'
              onClick={() => handlePageChange('next')}
              disabled={page >= (data?.totalPages ?? 0)}
              className='w-24'
            >
              Next <ChevronRight />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductList
