import { Metadata } from 'next'


import { auth } from '@/auth'
export const metadata: Metadata = {
  title: 'Admin Dashboard',
}

const DashboardPage = async () => {
  const session = await auth()
  if (session?.user.isAdmin
     !== 'admin')
    throw new Error('Admin permission required')

}

export default DashboardPage