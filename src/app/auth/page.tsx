'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BsGithub } from 'react-icons/bs';

const Auth = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const authHandler = async () => {
    try {
      await signIn('github', { redirect: false });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (session) router.push('/');
  }, [router, session]);

  return (
    <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0'>
      <div className='w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0'>
        <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
          <h3 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl'>
            Authenticate
          </h3>

          <div className='space-y-4 md:space-y-6'>
            <BsGithub
              onClick={authHandler}
              className='w-full cursor-pointer text-gray-100 bg-blue-500 focus:outline-none font-medium rounded-lg text-5xl px-5 py-2.5 text-center'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
