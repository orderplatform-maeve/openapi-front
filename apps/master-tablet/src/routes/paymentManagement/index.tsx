import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/paymentManagement/')({
  loader: () => {
    throw redirect({
      to: '/payment',
    });
  },
});
