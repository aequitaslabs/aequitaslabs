import Head from 'next/head';
import Wallet from '../components/Wallet';
import Deposit from '../components/Deposit';

export default function AppDashboard() {
  return (
    <div className="flex-1 flex flex-col pt-12 text-center bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,76,0.06),transparent_50%)] relative">
      <Head>
        <title>AequitasLabs | Deploy Capital</title>
        <meta name="description" content="Deploy USDC via agent smart contracts."/>
        
        <meta property="og:type" content="website"/>
        <meta property="og:url" content="https://app.aequitaslabs.xyz/app"/>
        <meta property="og:title" content="AequitasLabs | Terminal"/>
        <meta property="og:description" content="Deploy USDC via agent smart contracts."/>
        <meta property="og:image" content="https://aequitaslabs.xyz/assets/aequitaslabs-banner-1500x500.png"/>
        <meta property="og:site_name" content="AequitasLabs"/>

        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:site" content="@aequitaslabs"/>
        <meta name="twitter:title" content="AequitasLabs | Terminal"/>
        <meta name="twitter:description" content="Deploy USDC via agent smart contracts."/>
        <meta name="twitter:image" content="https://aequitaslabs.xyz/assets/aequitaslabs-banner-1500x500.png"/>
      </Head>
      
      <div className="absolute top-6 right-8">
        <Wallet />
      </div>

      <div className="flex-1 flex flex-col items-center justify-start p-8 w-full mt-4">
        <div className="w-full max-w-3xl mx-auto space-y-4 mb-10 animate-[fadeIn_0.5s_ease-out]">
          <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white mb-2 font-serif">
            Base Agent Terminal
          </h1>
          <p className="text-[#9c9480] font-light text-base md:text-lg max-w-xl mx-auto leading-relaxed font-sans">
            Deploy USDC via smart contact payload. The master agent continuously autonomously routes capital into curated real-world yields.
          </p>
        </div>

        <Deposit />
      </div>
    </div>
  );
}
