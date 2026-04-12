import Head from 'next/head';
import Wallet from '../components/Wallet';
import Deposit from '../components/Deposit';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col pt-32 pb-16 items-center bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,76,0.06),transparent_50%)] relative min-h-screen">
      <Head>
        <title>Base | Autonomous Capital on Base</title>
        <meta name="description" content="Deposit USDC. Let autonomous AI agents allocate capital into tokenized real estate on Base, hire specialized agents via Base Agent Kit (BAK-1), and distribute real yield."/>
        
        <meta property="og:type" content="website"/>
        <meta property="og:url" content="https://app.base.xyz/"/>
        <meta property="og:title" content="Base" />
        <meta property="og:description" content="Autonomous capital deployed by AI agents. Deposit USDC. Earn real yield. All onchain." />
        <meta property="og:image" content="https://base.xyz/assets/base-base-banner.png"/>
        <meta property="og:site_name" content="Base" />

        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:site" content="@base"/>
        <meta name="twitter:title" content="Base | Terminal"/>
        <meta name="twitter:description" content="Deposit USDC. Let autonomous AI agents allocate capital into tokenized real estate on Base, hire specialized agents via Base Agent Kit (BAK-1), and distribute real yield."/>
        <meta name="twitter:image" content="https://base.xyz/assets/base-base-banner.png"/>
      </Head>
      
      <header className="w-full flex justify-between items-center px-6 sm:px-12 py-8 absolute top-0 left-0 right-0 z-50">
        <a href="https://base.xyz" className="flex items-center gap-3 text-white transition-opacity hover:opacity-80" style={{ fontFamily: '"Coinbase Display", serif', fontSize: '26px', letterSpacing: '-0.02em' }}>
          
          Base
        </a>
        <Wallet />
      </header>

      <div className="flex-1 flex flex-col items-center justify-start p-8 w-full mt-4">
        <div className="w-full max-w-4xl mx-auto space-y-4 mb-10 animate-[fadeIn_0.5s_ease-out] text-center">
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-white mb-4 font-serif">
            Network Execution Terminal
          </h1>
          <p className="text-[#9c9480] font-light text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-sans">
            Deploy USDC payloads via master agent smart contracts. Real-time autonomous routing into onchain real-world yields.
          </p>
        </div>

        <Deposit />
      </div>
    </div>
  );
}
