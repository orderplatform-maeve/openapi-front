import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/additional/')({
  component: () => <div>Hello /additional/!</div>,
});
