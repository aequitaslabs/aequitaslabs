import Head from 'next/head';
import Wallet from '../components/Wallet';
import Deposit from '../components/Deposit';

export default function AppDashboard() {
  return (
    <div className="flex-1 flex flex-col pt-12 text-center bg-[radial-gradient(ellipse_at_top_right,rgba(212,181,96,0.06),transparent_50%)] relative">
      <Head>
        <title>Aequitas | Deploy Capital</title>
      </Head>
      
      <div className="absolute top-6 right-8">
        <Wallet />
      </div>

      <div className="flex-1 flex flex-col items-center justify-start p-8 w-full mt-4">
        <div className="w-full max-w-3xl mx-auto space-y-4 mb-10 animate-[fadeIn_0.5s_ease-out]">
          <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white mb-2">
            Base Agent Terminal
          </h1>
          <p className="text-gray-400 font-light text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Deploy USDC via smart contact payload. The master agent continuously autonomously routes capital into curated real-world yields.
          </p>
        </div>

        <Deposit />
      </div>
    </div>
  );
}
