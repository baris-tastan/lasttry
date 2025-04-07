import { Card, CardContent } from '@/components/ui/card'
import {
  getProductBySlug,
} from '@/lib/db/productActions'

import RatingSummary from '@/components/product/rating-summary'
import ReviewList from './reviewList'
import { auth } from '@/auth'
import SelectVariant from '@/components/product/select-variant'
import ProductPrice from '@/components/product/product-price'
import ProductGallery from '@/components/product/product-gallery'
import { Separator } from '@/components/ui/separator'

// components/product/rating.tsx


  



export default async function ProductDetails(props: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page: string; color: string; size: string }>
}) {
  const searchParams = await props.searchParams
  const { size } = searchParams
  const params = await props.params
  const { slug } = params
  const product = await getProductBySlug(slug)
  const session = await auth()
  
  return (
    <div>
      <section>
        <div className='grid grid-cols-1 md:grid-cols-5 '>
          <div className='col-span-2'>
            <ProductGallery images={[product.image]} />
          </div>
          <div className='flex w-full flex-col gap-2 md:p-5 col-span-2'>
            <div className='flex flex-col gap-3'>
              <h1 className='font-bold text-lg lg:text-xl'>
                {product.name}
              </h1>
              
              <RatingSummary
                avgRating={product.avgRating}
                numReviews={product.numReviews}
                asPopover
                ratingDistribution={product.ratingDistribution}
              />
              <Separator />
              <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                <div className='flex gap-3'>
                  <ProductPrice
                    price={product.price}
                  />
                </div>
              </div>
            </div>
            <div>
              <SelectVariant
                product={product}
                size={size || (product.size?.[0] ?? '')}
              />
            </div>
            <Separator className='my-2' />
            <div className='flex flex-col gap-2'>
              <p className='p-bold-20 text-grey-600'>Description:</p>
              <p className='p-medium-16 lg:p-regular-18'>
                {product.description}
              </p>
              
              {/* Display battery life only if the product category is GPS watches */}
              {product.category === 'GPS Sport Watch' && (
                <div className='mt-2'>
                  <p className='p-bold-20 text-grey-600'>Battery Life:</p>
                  <p className='p-medium-16 lg:p-regular-18'>
                    {product.batteryLife || 'Not specified'}
                  </p>
                </div>
              )}
              {/* Display material only if the product category isrunning shoes */}
              {product.category === 'Running Shoes' && (
                <div className='mt-2'>
                  <p className='p-bold-20 text-grey-600'>Material:</p>
                  <p className='p-medium-16 lg:p-regular-18'>
                    {product.material || 'Not specified'}
                  </p>
                </div>
              )}
              {/* Display material only if the product category isrunning shoes */}
              {product.category === 'Antique Furniture' && (
                <div className='mt-2'>
                  <p className='p-bold-20 text-grey-600'>Material:</p>
                  <p className='p-medium-16 lg:p-regular-18'>
                    {product.material || 'Not specified'}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div>
            <Card>
              <CardContent className='p-4 flex flex-col gap-4'>
                <ProductPrice price={product.price} />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className='mt-10'>
        <h2 className='h2-bold mb-2' id='reviews'>
          Customer Reviews
        </h2>
        <ReviewList product={product} userId={session?.user.id} />
      </section>
    </div>
  )
}