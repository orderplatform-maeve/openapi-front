import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 1000 * 10,
    },
    mutations: {
      onError(err) {
        console.log({ err });
      },
    },
  },
});
