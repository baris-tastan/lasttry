// app/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { getAllProducts } from '@/lib/db/productActions'
import { IProduct } from '@/lib/db/productModel'

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * The main homepage component.
 *
 * Displays a grid of products, with each product rendered as a link to its
 * details page.
 *
 * Each product is displayed with its name, description, price, average rating,
 * and number of reviews.
 *
 * The grid is responsive, with a different number of columns on different
 * screen sizes (2 on small screens, 3 on medium screens, 4 on large screens,
 * and 5 on extra large screens).
 */
/*******  753e2a08-54dc-4541-80f1-43e626668203  *******/
export default async function HomePage() {
  const products = await getAllProducts()

  return (
    <main className="p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product: IProduct) => (
          <Link
            key={product._id}
            href={`/product/${encodeURIComponent(product.slug)}`}
            className="border rounded-lg p-2 shadow-sm hover:shadow-md transition"
          >
            <div className="relative w-full h-32">
              <Image
                src="/images/shoe.jpeg" // or product.image if you’re using URLs
                alt={product.slug}
                width={200}
                height={100}
                
                className="object-cover rounded"
              />
            </div>
            <h2 className="text-sm font-semibold mt-2 truncate">{product.name}</h2>
            <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>
            <p className="mt-1 text-sm font-bold text-green-700">${product.price}</p>
            <p className="text-xs text-yellow-600">
              ⭐ {product.avgRating.toFixed(2)} ({product.numReviews})
            </p>
          </Link>
        ))}
      </div>
    </main>
  )
}
