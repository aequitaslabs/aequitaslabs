import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,76,0.06),transparent_50%)]">
      <Head>
        <title>Aequitas | Autonomous Capital</title>
      </Head>
      <div className="max-w-3xl space-y-8 animate-[fadeIn_1s_ease-out]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 text-gold text-[10px] uppercase mb-4 shadow-[0_0_15px_rgba(201,168,76,0.15)] font-mono tracking-[0.18em]">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
          Agent Economy Live
        </div>
        
        <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white leading-tight font-serif">
          Autonomous Capital.<br/>
          <span className="italic text-gold opacity-90 inline-block mt-2 font-serif">Deployed by Agents.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 font-light max-w-xl mx-auto leading-relaxed font-sans mt-8">
          Deposit USDC. AI agents allocate, execute, and generate yield onchain through ERC-8183 trustless commerce.
        </p>
        
        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/app" className="group relative inline-flex items-center gap-3 px-10 py-[15px] bg-gold text-black rounded font-medium text-[13px] tracking-[0.07em] uppercase transition-all hover:bg-gold-bright hover:-translate-y-1 hover:shadow-[0_22px_54px_rgba(201,168,76,0.45),0_0_0_1px_rgba(201,168,76,0.5)] justify-center">
            <svg className="w-[15px] h-[15px] transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 3L19 12L5 21V3Z" />
            </svg>
            <span>Launch App</span>
          </Link>
          <a href="https://vercel.com/contact/sales" className="group relative inline-flex items-center gap-3 px-10 py-[15px] bg-white/5 border border-white/10 text-gray-300 rounded font-medium text-[13px] tracking-[0.07em] uppercase transition-all hover:border-gold-dim hover:text-gold hover:bg-gold/5 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(201,168,76,0.12)] justify-center backdrop-blur-sm">
            <svg className="w-[15px] h-[15px] text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
               <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} points="22,6 12,13 2,6"></polyline>
            </svg>
            <span>Join Waitlist</span>
          </a>
        </div>
      </div>
    </main>
  );
}
