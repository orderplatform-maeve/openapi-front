import withTM from 'next-transpile-modules';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = withTM(['@torder/client-fetcher', '@torder/ui', '@torder/utils'])({
  /* config options here */
  reactStrictMode: true,
  env: {
    SERVER_URL: 'http://local.torder.com:4000',
  },
});

export default nextConfig;
