// components/product/product-price.tsx

export default function ProductPrice({ price }: { price: number }) {
    return (
      <span className="text-base font-medium text-black">
        ${price.toFixed(2)}
      </span>
    )
  }
  