import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';

import { config } from '../lib/wallet';
import CustomCursor from '../components/CustomCursor';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          locale="en-US"
          theme={darkTheme({
            accentColor: '#C9A84C',      /* Brand Gold */
            accentColorForeground: '#06050a', /* Brand Black */
            borderRadius: 'medium',
            fontStack: 'system', /* We'll let CSS override or system font since it's hard to inject custom fonts strictly here without breaking layout */
            overlayBlur: 'small',
          })}
        >
          <CustomCursor />
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
