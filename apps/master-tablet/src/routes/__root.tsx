import { Body, Head, Html, Meta, Scripts } from '@tanstack/start';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { createRootRoute } from '@tanstack/react-router';
import styles from './__root.module.css';
import { Menu } from '@/features/layout/Menu';
import { MainContents } from '@/features/layout/MainContents';

export const Route = createRootRoute({
  meta: () => [
    {
      charSet: 'utf-8',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      title: 'TanStack Start Starter',
    },
  ],
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Html>
        <Head>
          <Meta />
        </Head>
        <Body>
          <section className={styles.container}>
            <Menu />
            <MainContents />
          </section>
          <Scripts />
        </Body>
      </Html>
      <TanStackRouterDevtools />
    </>
  );
}
