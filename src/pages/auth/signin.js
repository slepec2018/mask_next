import React from 'react';
import { getProviders,signIn } from 'next-auth/react';


export default function signin({providers}) {
  return (
    <div
      className='flex justify-center mt-20 space-x-4'
    >
      <img
        src='https://oyelabs.com/wp-content/uploads/2023/10/Twitter-clone-posts.png'
        alt='mask img'
        className='hidden object-cover md:w-[550px] md:inline-flex'
      />
      <div
        className=''
      >
        {Object.values(providers).map((provider) => (
          <div
            key={provider.name}
            className='flex flex-col items-center'
          >
            <img
              src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/220px-Logo_of_Twitter.svg.png'
              alt='logo'
              className='w-36 object-cover'
            />
            <p
              className='text-center text-sm italic my-10'
            >
              This app is created for learning purposes
            </p>
            <button
              onClick={() => signIn(provider.id, {callbackUrl: "/"})}
              className='bg-red-400 rounded-lg p-3 text-white hover:bg-red-500'
            >
              Sign in with {provider.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers
    },
  };
}