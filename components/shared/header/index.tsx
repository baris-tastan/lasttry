import { APP_NAME } from '@/lib/constants'
import Image from 'next/image'
import Link from 'next/link'
import Menu from './menu'




export default function Header() {
  return (
    <header className='bg-black  text-white'>
      <div className='px-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <Link
              href='/'
              className='flex items-center header-button font-extrabold text-2xl m-1 '
            >
              <Image
                src='/images/cloud.png'
                width={50}
                height={50}
                alt={`${APP_NAME} logo`}
              />
              {APP_NAME}
            </Link>
          </div>
          <div className='hidden md:block flex-1 max-w-xl'>
            
          </div>
          <Menu />
        </div>
        <div className='md:hidden block py-2'>
          
        </div>
      </div>

    </header>
  )
}