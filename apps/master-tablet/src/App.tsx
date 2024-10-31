import '@/App.css';
import { OverlayProvider } from 'overlay-kit';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routeTree } from './routeTree.gen';

const queryClient = new QueryClient();
const router = createRouter({
  routeTree,
  context: { queryClient },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <OverlayProvider />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
