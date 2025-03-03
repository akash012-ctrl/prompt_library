import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

const geist = Geist({
  subsets: ["latin"],
});

const theme = createTheme({
  primaryColor: 'blue',
  colors: {
    blue: [
      '#E6F7FF',
      '#BAE7FF',
      '#91D5FF',
      '#69C0FF',
      '#40A9FF',
      '#1890FF',
      '#096DD9',
      '#0050B3',
      '#003A8C',
      '#002766',
    ],
  },
  fontFamily: geist.style.fontFamily,
  headings: {
    fontFamily: geist.style.fontFamily,
  },
  components: {
    Button: {
      defaultProps: {
        variant: 'light',
      },
    },
    Card: {
      defaultProps: {
        shadow: 'sm',
      },
    },
    Paper: {
      defaultProps: {
        shadow: 'sm',
      },
    },
  },
  other: {
    borderRadius: '8px',
  }
});

export const metadata: Metadata = {
  title: "Prompt Library",
  description: "A library for managing and sharing prompts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <MantineProvider theme={theme} defaultColorScheme="light">
          <Notifications position="top-right" />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
