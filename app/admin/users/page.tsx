import { Metadata } from 'next'

import { auth } from '@/auth'
import DeleteDialog from '@/components/shared/delete-dialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { deleteUser, getAllUsers } from '@/lib/db/userActions'
import { IUser } from '@/api/userModel/route'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import {AddUserForm} from './add-user-form' // We'll create this component

export const metadata: Metadata = {
  title: 'Admin Users',
}

const sanitizeUser = (user: IUser) => ({
  ...user,
  _id: user._id.toString(),
})

export default async function AdminUser() {
  const session = await auth()
  if (session?.user.isAdmin !== 'admin')
    throw new Error('Admin permission required')
  
  const usersResponse = await getAllUsers()
  const sanitizedUsers = usersResponse?.data.map(sanitizeUser) || []
  
  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h1 className='h1-bold'>Users</h1>
        <AddUserButton />
      </div>
      
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sanitizedUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell className='font-medium'>{user._id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.isAdmin}</TableCell>
                <TableCell className='flex gap-2'>
                  
                  <DeleteDialog id={user._id} action={deleteUser} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function AddUserButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Add User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>
        <AddUserForm />
      </DialogContent>
    </Dialog>
  )
}