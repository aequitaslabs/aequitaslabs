import { useState, useEffect } from 'react';
import AgentStatus from './AgentStatus';

export default function Deposit() {
  const [amount, setAmount] = useState<string>('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);
  const [logs, setLogs] = useState<Array<{t: string, b: string, c: string, m: string}>>([]);
  const [strategy, setStrategy] = useState<string>('Yield Maximization via Real Estate Fraction');

  const MOCK_BALANCE = 1250.00;

  const handleMax = () => {
    setAmount(MOCK_BALANCE.toString());
  };

  const handleDeploy = () => {
    if (!amount || parseFloat(amount) <= 0 || parseFloat(amount) > MOCK_BALANCE) return;
    setIsDeploying(true);
    
    // Simulate Terminal output
    const mockLogs = [
      {t: '00:00', b: 'INIT', c: 'bg-gold/10 text-gold', m: `Compiling strategy: "${strategy}"`},
      {t: '00:01', b: 'TX', c: 'bg-blue-500/10 text-blue-400', m: `Broadcasting payload to Base Sepolia Testnet...`},
      {t: '00:03', b: 'AGENT', c: 'bg-purple-500/10 text-purple-400', m: `Master Agent [AGT-17] verified signature`},
      {t: '00:05', b: 'ESCROW', c: 'bg-green-500/10 text-green-400', m: `${amount} USDC locked in vault`},
      {t: '00:08', b: 'HIRE', c: 'bg-purple-500/10 text-purple-400', m: `ERC-8183 sub-agent hired for real-world validation`},
      {t: '00:10', b: 'EXEC', c: 'bg-gold/10 text-gold', m: `Yield parameters optimized. Settlement complete.`},
    ];

    let i = 0;
    setLogs([]);
    const interval = setInterval(() => {
      setLogs(prev => [...prev, mockLogs[i]]);
      i++;
      if (i >= mockLogs.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsDeploying(false);
          setIsDeployed(true);
        }, 1200);
      }
    }, 1200);
  };

  const pad = (n: number) => n.toString().padStart(2, '0');
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const now = new Date();
    setTimeStr(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
  }, []);

  if (isDeployed) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-8 animate-[fadeIn_0.5s_ease-out]">
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-8 py-5 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4 text-lg">
             <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
             </svg>
             <span className="font-medium tracking-wide">Capital Deployed successfully. Autonomous Agent is executing on Base Sepolia.</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 lg:p-10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
               <div className="flex justify-between items-center mb-10">
                 <h2 className="text-3xl font-serif font-medium text-white">Active Deployment</h2>
                 <span className="text-green-400 text-sm px-4 py-1.5 bg-green-400/10 border border-green-400/20 rounded-full font-mono font-medium tracking-wide flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                   Agent Live
                 </span>
               </div>
               
               <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                 <div className="space-y-3">
                   <div className="text-sm text-gray-400 tracking-wider uppercase font-mono">Deposited</div>
                   <div className="text-5xl font-mono text-white tracking-tight">{parseFloat(amount).toLocaleString()}</div>
                 </div>
                 <div className="space-y-3">
                   <div className="text-sm text-gray-400 tracking-wider uppercase font-mono">Est. APY</div>
                   <div className="text-5xl font-mono text-white tracking-tight">
                      8-12<span className="text-2xl text-gray-500">%</span>
                   </div>
                 </div>
                 <div className="space-y-3">
                   <div className="text-sm text-gray-400 tracking-wider uppercase font-mono">Est. Earnings</div>
                   <div className="text-5xl font-mono text-gold tracking-tight">+12.42</div>
                 </div>
               </div>

               <div className="pt-8 border-t border-white/5">
                  <div className="flex items-center gap-2 group relative inline-flex cursor-default">
                    <span className="text-base text-gray-400 font-medium">✨ Powered by ERC-8183 Agent Commerce</span>
                  </div>
               </div>
            </div>

            <AgentStatus amount={amount} />
          </div>
          
           <div className="space-y-8">
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl">
                <h3 className="text-sm font-semibold text-gray-400 mb-8 uppercase tracking-widest font-mono">Strategy Parameters</h3>
                <div className="space-y-8">
                  <div>
                    <div className="text-sm text-gray-500 uppercase font-mono mb-2">Asset Class</div>
                    <div className="text-xl text-white font-medium">Real-World Assets (RWA)</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 uppercase font-mono mb-2">Target</div>
                    <div className="text-xl text-white font-medium">Fractional Real Estate</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 uppercase font-mono mb-2">Settlement Network</div>
                    <div className="text-xl text-white font-medium">Base Sepolia (Testnet)</div>
                  </div>
                </div>
                <button
                  onClick={() => setIsDeployed(false)}
                  className="w-full mt-12 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-base rounded-xl transition-all uppercase tracking-widest font-bold font-mono"
                >
                  Withdraw / Reset
                </button>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto animate-[fadeIn_0.5s_ease-out]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Deposit Form */}
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] -z-10 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
            <h2 className="text-[28px] font-serif font-medium tracking-tight text-white">Deploy Autonomous Capital</h2>
            <span className="text-gold tracking-[0.15em] text-xs uppercase px-3 py-1.5 bg-gold/10 border border-gold/20 rounded-md font-mono">ERC-8183 Vault</span>
          </div>

          <div className="space-y-8">
            <div className="space-y-3 text-left">
              <label className="text-sm text-gray-400 font-mono uppercase tracking-widest">Select Strategy</label>
              <select 
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl py-4 px-5 text-lg text-white appearance-none focus:outline-none focus:border-gold/50 transition-colors cursor-pointer"
              >
                <option value="Yield Maximization via Real Estate Fraction">Yield Maximization via Real Estate Fraction</option>
                <option value="Agent Commerce Arbitrage">Agent Commerce Arbitrage</option>
                <option value="Stablecoin Liquidity Farming">Stablecoin Liquidity Farming</option>
              </select>
            </div>

            <div className="space-y-3 text-left">
              <div className="flex justify-between text-sm text-gray-400 font-mono uppercase tracking-widest">
                <label>Amount (USDC)</label>
                <span className="cursor-pointer hover:text-white transition-colors" onClick={handleMax}>
                   Balance: <span className="text-white">{MOCK_BALANCE.toFixed(2)}</span>
                </span>
              </div>
              <div className="relative group">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-6 px-6 pr-24 text-5xl font-mono text-white placeholder-gray-700 focus:outline-none focus:border-gold/50 transition-colors shadow-inner"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                   <button 
                     onClick={handleMax}
                     className="text-sm font-bold tracking-widest text-gold hover:text-white transition-colors uppercase bg-gold/10 border border-gold/20 px-4 py-2 rounded-lg"
                   >
                     Max
                   </button>
                </div>
              </div>
            </div>

            <div className="p-6 bg-black/30 rounded-xl border border-white/5 space-y-4">
              <div className="flex justify-between text-base">
                <span className="text-gray-400">Network Routing</span>
                <span className="text-white text-right font-medium">Base Sepolia</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-gray-400">Expected Yield</span>
                <span className="text-green-400 font-mono">8% - 12% APY</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-gray-400">Master Agent Fee</span>
                <span className="text-white font-mono">0.05%</span>
              </div>
            </div>

            <button
              onClick={handleDeploy}
              disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > MOCK_BALANCE || isDeploying}
              className="w-full py-5 mt-4 bg-gold text-ink rounded-xl text-lg font-bold tracking-[0.1em] uppercase hover:bg-gold-bright hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(212,181,96,0.3)] transition-all disabled:opacity-50 disabled:pointer-events-none disabled:transform-none relative"
            >
              {isDeploying ? (
                 <div className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-6 w-6 text-ink" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Executing Onchain...
                 </div>
              ) : (
                 "Execute Strategy"
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Terminal Feed */}
        <div className="bg-black/60 border border-white/5 rounded-3xl p-8 lg:p-10 shadow-2xl flex flex-col h-full min-h-[600px] backdrop-blur-2xl relative">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="text-xs text-gray-500 font-mono tracking-widest uppercase">aequitas-agent / terminal</div>
          </div>
          
          <div className="flex-1 bg-black/60 border border-white/5 rounded-xl p-6 font-mono text-sm overflow-hidden flex flex-col justify-end relative shadow-inner">
             {logs.length === 0 && !isDeploying && (
                <div className="text-gray-500 mb-4 animate-pulse">
                   {timeStr} root@aequitas ~ % awaiting payload...<br/>
                   <span className="text-xs text-gray-600 mt-2 block">System stands ready to allocate capital via ERC-8183.</span>
                </div>
             )}
             
             <div className="space-y-4">
               {logs.map((log, idx) => (
                 <div key={idx} className="flex gap-4 items-start animate-[fadeUp_0.4s_ease-out]">
                   <span className="text-gray-500 flex-shrink-0">{log.t}</span>
                   <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${log.c} flex-shrink-0`}>{log.b}</span>
                   <span className="text-gray-300 leading-relaxed">{log.m}</span>
                 </div>
               ))}
               
               {isDeploying && logs.length > 0 && logs.length < 6 && (
                 <div className="flex gap-4 items-center text-gray-500 mt-4 animate-pulse">
                   <span>...</span>
                   <span>Processing on Base Sepolia network</span>
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

