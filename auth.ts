import { MongoDBAdapter } from '@auth/mongodb-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectToDatabase } from './api/db/route'
import client from './lib/db/client'
import User from './api/userModel/route'

import NextAuth, { type DefaultSession } from 'next-auth'
import authConfig from '@/authconfig'

declare module 'next-auth' {
  interface Session {
    user: {
      isAdmin: string
    } & DefaultSession['user']
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  pages: {
    signIn: '/signIn',
    newUser: '/sign-up',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: MongoDBAdapter(client),
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          type: 'email',
        },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        await connectToDatabase()
        if (credentials == null) return null

        const user = await User.findOne({ email: credentials.email })

        if (user && user.password) {
          const isMatch = 
            credentials.password as string === user.password
          
          if (isMatch) {
            return {
              id: user._id,
              name: user.name,
              email: user.email,
              isAdmin: user.isAdmin,
            }
          }
        }
        return null
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        if (!user.name) {
          await connectToDatabase()
          await User.findByIdAndUpdate(user.id, {
            name: user.name || user.email!.split('@')[0],
            isAdmin: 'user',
          })
        }
        token.name = user.name || user.email!.split('@')[0]
        token.isAdmin = (user as { isAdmin: string }).isAdmin
      }

      if (session?.user?.name && trigger === 'update') {
        token.name = session.user.name
      }
      return token
    },
    session: async ({ session, user, trigger, token }) => {
      session.user.id = token.sub as string
      session.user.isAdmin = token.isAdmin as string
      session.user.name = token.name
      if (trigger === 'update') {
        session.user.name = user.name
      }
      return session
    },
  },
})