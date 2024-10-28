import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/payment/')({
  component: () => <div>Hello /payment/!</div>,
});
