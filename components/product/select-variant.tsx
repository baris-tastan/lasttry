import { Button } from '@/components/ui/button'
import { IProduct } from '@/lib/db/productModel'
import Link from 'next/link'

export default function SelectVariant({
  product,
  size,

}: {
  product: IProduct
  size: string
}) {
 
  const selectedSize = size || (product.size && product.size[0]);


  return (
    <>
      
      {product.size && product.size.length > 0 && (
        <div className='mt-2 space-x-2 space-y-2'>
          <div>Size:</div>
          {product.size.map((x: string) => (
            <Button
              asChild
              variant='outline'
              className={
                selectedSize === x
                  ? 'border-2  border-primary'
                  : 'border-2  '
              }
              key={x}
            >
              <Link
                replace
                scroll={false}
                href={`?${new URLSearchParams({
                  
                  size: x,
                })}`}
              >
                {x}
              </Link>
            </Button>
          ))}
        </div>
      )}
    </>
  )
}