import { slugify } from '@/lib/utils'
import { IProductInput, IUserInput } from '@/types';

const users: IUserInput[] = [
  {
    name: "Alice Admin",
    email: "alice.admin@example.com",
    isAdmin: "admin",
    password: "securepassword123",
    avgRating: 0,
    numReviews: 0,
    ratingDistribution: [
      { rating: 5, count: 0 },
      { rating: 4, count: 0 },
    ],
    reviews: [],
  },
  {
    name: "Bob Buyer",
    email: "bobbuyer@example.com",
    isAdmin: "user",
    password: "password456",
    avgRating: 0,
    numReviews: 0,
    ratingDistribution: [
      { rating: 5, count: 1 },
      { rating: 3, count: 1 },
    ],
    reviews: [],
  },
  {
    name: "Charlie Customer",
    email: "charlie.customer@example.com",
    isAdmin: "user",
    password: "supersecret789",
    avgRating: 0,
    numReviews: 0,
    ratingDistribution: [],
    reviews: [],
  },
];

const products: IProductInput[] = [
  {
    name: "Garmin",
    description: "Advanced GPS smartwatch with extended battery life and training metrics.",
    price: 499.99,
    image: "/images/shoe.jpeg",
    category: "GPS Sport Watch",
    size: [],
    batteryLife: "15 days",
    age: "",
    material: "",
    avgRating: 0,
    numReviews: 0,
    ratingDistribution: [
      { rating: 5, count: 0 },
      { rating: 4, count: 0 },
      { rating: 3, count: 0 },
    ],
    reviews: [],
    slug: slugify("Garmin")
  },
  {
    name: "Nike Air Zoom Pegasus 40",
    description: "Lightweight and responsive running shoes with breathable mesh.",
    price: 129.99,
    image: "/images/shoe.jpeg",
    category: "Running Shoes",
    size: ["M"],
    batteryLife: "",
    age: "",
    material: "Mesh, Foam",
    avgRating: 0,
    numReviews: 0,
    ratingDistribution: [
      { rating: 5, count: 0 },
      { rating: 4, count: 0 },
      { rating: 3, count: 0 },
    ],
    reviews: [],
    slug: slugify("Nike Air Zoom Pegasus 40")
  },
  {
    name: "Victorian Mahogany Armchair",
    description: "Elegant 19th-century antique furniture with carved wooden frame.",
    price: 750,
    image: "/images/shoe.jpeg",
    category: "Antique Furniture",
    size: [],
    batteryLife: "",
    age: "140 years",
    material: "Mahogany, Velvet",
    avgRating: 0,
    numReviews: 0,
    ratingDistribution: [
      { rating: 5, count: 0 },
      { rating: 4, count: 0 },
    ],
    reviews: [],
    slug: slugify("Victorian Mahogany Armchair")
  },
  {
    name: "The Beatles – Abbey Road (Vinyl)",
    description: "Original pressing of the classic album, excellent condition.",
    price: 199.99,
    image: "/images/shoe.jpeg",
    category: "Vinyl",
    size: [],
    batteryLife: "",
    age: "55 years",
    material: "",
    avgRating: 0,
    numReviews: 0,
    ratingDistribution: [{ rating: 5, count: 0 }],
    reviews: [],
    slug: slugify("The Beatles – Abbey Road (Vinyl)")
  },
  {
    name: "Polar Grit X Pro",
    description: "Military-grade GPS watch with tough build and advanced features.",
    price: 599.95,
    image: "/images/shoe.jpeg",
    category: "GPS Sport Watch",
    size: [],
    batteryLife: "40 hours (GPS mode)",
    age: "",
    material: "",
    avgRating: 0,
    numReviews: 0,
    ratingDistribution: [
      { rating: 5, count: 0 },
      { rating: 4, count: 0 },
      { rating: 3, count: 0 },
    ],
    reviews: [],
    slug: slugify("Polar Grit X Pro")
  },
  {
    name: "Adidas Ultraboost Light",
    description: "Responsive and stylish running shoes with sustainable material.",
    price: 180,
    image: "/images/shoe.jpeg",
    category: "Running Shoes",
    size: ["L"],
    batteryLife: "",
    age: "",
    material: "Recycled Primeknit",
    avgRating: 0,
    numReviews: 0,
    ratingDistribution: [
      { rating: 5, count: 0 },
      { rating: 4, count: 0 },
      { rating: 3, count: 0 },
    ],
    reviews: [],
    slug: slugify("Adidas Ultraboost Light")
  },
  {
    name: "Art Deco Walnut Cabinet",
    description: "Unique 1930s design, restored and fully functional.",
    price: 1200,
    image: "/images/shoe.jpeg",
    category: "Antique Furniture",
    size: [],
    batteryLife: "",
    age: "90 years",
    material: "Walnut Wood",
    avgRating: 0,
    numReviews: 0,
    ratingDistribution: [
      { rating: 5, count: 0 },
      { rating: 4, count: 0 },
    ],
    reviews: [],
    slug: slugify("Art Deco Walnut Cabinet")
  },
  {
    name: "Pink Floyd – The Dark Side of the Moon (Vinyl)",
    description: "Classic rock album in pristine vinyl format.",
    price: 89.95,
    image: "/images/shoe.jpeg",
    category: "Vinyl",
    size: [],
    batteryLife: "",
    age: "51 years",
    material: "",
    avgRating: 0,
    numReviews: 0,
    ratingDistribution: [
      { rating: 5, count: 0 },
      { rating: 4, count: 0 },
    ],
    reviews: [],
    slug: slugify("Pink Floyd – The Dark Side of the Moon (Vinyl)")
  }
]


const data = { products, users };
export default data;