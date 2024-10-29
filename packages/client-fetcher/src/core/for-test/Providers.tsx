import { PropsWithChildren, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
type children = {
  children?: ReactNode | undefined;
};

const Providers: React.FC<PropsWithChildren<{}>> = ({ children }: children) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export { Providers };
