import { useEffect, useState } from 'react';

const LOG_MESSAGES = [
  "Agent master initialized on Base network...",
  "Routing [AMOUNT] USDC payload into vault...",
  "Scanning RWA opportunities for optimal yield...",
  "Agent acquired property share (Bali Villa).",
  "ERC-8183 job created for yield routing.",
  "Pricing agent hired. 1.5 USDC fee escrowed.",
  "Yield parameters optimized and locked.",
  "+12.42 USDC earned. Settlement confirmed."
];

export default function AgentStatus({ amount }: { amount: string }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  
  useEffect(() => {
    if (currentStep >= LOG_MESSAGES.length) return;

    const delay = currentStep === 0 ? 800 : Math.random() * 1500 + 1000;
    const stepMessage = LOG_MESSAGES[currentStep].replace('[AMOUNT]', Number(amount).toLocaleString());

    const timer = setTimeout(() => {
      setLogs((prev) => [...prev, stepMessage]);
      setCurrentStep((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentStep, amount]);

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 font-mono text-sm shadow-xl min-h-[350px] flex flex-col relative overflow-hidden text-left">
       <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-[60px] -z-10 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>

       <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
         <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
         </div>
         <span className="text-xs text-gray-500 tracking-wider font-mono">aequitas-terminal</span>
       </div>
       
       <div className="flex-1 space-y-4">
         {logs.map((log, index) => {
           const isDone = index === LOG_MESSAGES.length - 1;
           return (
             <div 
               key={index} 
               className={`animate-[fadeIn_0.3s_ease-out] flex gap-3 items-center ${isDone ? 'text-[#6ddbb0]' : 'text-[#9c9480]'}`}
             >
               <span className="text-gold shrink-0 opacity-80">{`>`}</span>
               <span className="leading-relaxed whitespace-pre-wrap">{log}</span>
               {isDone && (
                 <span className="ml-1 inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-[#6ddbb0]/10 border border-[#6ddbb0]/40 shadow-[0_0_12px_rgba(109,219,176,0.25)]">
                   <svg className="w-2.5 h-2.5 text-[#6ddbb0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                   </svg>
                 </span>
               )}
             </div>
           );
         })}
         {currentStep < LOG_MESSAGES.length && (
            <div className="animate-pulse flex gap-3 text-gold">
              <span className="shrink-0">{`>`}</span>
              <span className="w-2 h-4 bg-gold inline-block mt-0.5"></span>
            </div>
         )}
       </div>
    </div>
  );
}
