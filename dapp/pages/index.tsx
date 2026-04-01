import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(ellipse_at_top_right,rgba(212,181,96,0.06),transparent_50%)]">
      <Head>
        <title>Aequitas | Autonomous Capital</title>
      </Head>
      <div className="max-w-3xl space-y-8 animate-[fadeIn_1s_ease-out]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 text-gold text-xs tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(212,181,96,0.15)]">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
          Agent Economy Live
        </div>
        
        <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white leading-tight">
          Autonomous Capital.<br/>
          <span className="italic text-gold opacity-90 inline-block mt-2">Deployed by Agents.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 font-light max-w-xl mx-auto leading-relaxed">
          Deposit USDC. AI agents allocate, execute, and generate yield onchain through ERC-8183 trustless commerce.
        </p>
        
        <div className="pt-8">
          <Link href="/app" className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gold text-background rounded font-medium tracking-widest uppercase transition-all hover:bg-[#ebd083] hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(212,181,96,0.4)]">
            <span>Launch App</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
