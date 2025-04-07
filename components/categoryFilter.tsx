// components/CategoryFilter.tsx
'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useCallback } from 'react'

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string
}

export default function CategoryFilter({ categories, selectedCategory }: CategoryFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  
  const handleCategoryChange = useCallback((category: string) => {
    const params = new URLSearchParams()
    if (category !== 'all') {
      params.set('category', category)
    }
    router.push(`${pathname}?${params.toString()}`)
  }, [router, pathname])

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryChange(category)}
          className={`px-3 py-1 rounded-full text-sm transition ${
            selectedCategory === category
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
          }`}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>
  )
}