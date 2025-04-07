// app/api/users/[id]/route.ts
import { connectToDatabase } from '@/api/db/route'
import User from '@/api/userModel/route'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()
    
    const user = await User.findById(params.id)
      .populate({
        path: 'reviews',
        options: { sort: { createdAt: -1 } },
        populate: {
          path: 'product',
          select: 'name image slug',
        },
      })
      .lean()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}