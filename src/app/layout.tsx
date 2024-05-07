import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: {
    template: '%s | 遊戲機器人',
    default: '遊戲機器人'
  },
  description: '提供遊戲輔助功能的聊天軟件機器人',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { sizes: '32x32', url: '/favicon-32x32.png' },
      { sizes: '16x16', url: '/favicon-16x16.png' }
    ],
    apple: {
      sizes: '180x180',
      url: '/apple-touch-icon.png'
    }
  },
  keywords: ['Line聊天機器人', 'Line遊戲']
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content'
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="DGWASqUvaiJCxsTPT8lPX1a6-kj4yB6GNTSl2BpXREE" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
