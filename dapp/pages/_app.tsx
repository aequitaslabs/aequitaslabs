import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';

import { config } from '../lib/wallet';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
          accentColor: '#d4b560',
          accentColorForeground: '#07060A',
          overlayBlur: 'small'
        })}>
          <div className="min-h-screen flex flex-col font-sans">
            <nav className="w-full flex items-center justify-between px-8 py-5 border-b border-border bg-black/50 backdrop-blur-md">
              <div className="text-xl font-light tracking-widest text-gold cursor-default uppercase">
                Aequitas<span className="opacity-50 text-xs ml-2 tracking-widest">Labs</span>
              </div>
            </nav>
            <Component {...pageProps} />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
