import { PrismaAdapter } from '@auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

import prisma from './prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  adapter: PrismaAdapter(prisma),
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session: async ({ session, token }) => {
      const userEmail = token.email;
      const user = await prisma.user.findUnique({
        where: { email: userEmail as string },
      });
      return {
        ...session,
        user: {
          ...session.user,
          id: user?.id,
        },
      };
    },
  },
};
