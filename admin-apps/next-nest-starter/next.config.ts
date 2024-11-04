import withTM from 'next-transpile-modules';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = withTM(['@torder/admin-ui', '@torder/client-fetcher', '@torder/ui', '@torder/utils'])({
  /* config options here */
  reactStrictMode: true,
  env: {
    SERVER_URL: 'https://local.torder.com:3000',
  },
});

export default nextConfig;
