/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production' &&
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY_LIVE;

const nextConfig = {
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: isProd
      ? process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY_LIVE
      : process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY_TEST,
    CLERK_SECRET_KEY: isProd
      ? process.env.CLERK_SECRET_KEY_LIVE
      : process.env.CLERK_SECRET_KEY_TEST,
  },
};

export default nextConfig;
