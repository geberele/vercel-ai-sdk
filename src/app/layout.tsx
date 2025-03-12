import type { Metadata } from 'next';
import { Provider } from '@/components/Provider';

export const metadata: Metadata = {
  title: 'Vercel AI SDK Demo',
  description: 'Vercel AI SDK demo',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
