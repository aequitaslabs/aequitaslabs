import { useState } from 'react';
import AgentStatus from './AgentStatus';

export default function Deposit() {
  const [amount, setAmount] = useState<string>('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);

  const MOCK_BALANCE = 1250.00;

  const handleMax = () => {
    setAmount(MOCK_BALANCE.toString());
  };

  const handleDeploy = () => {
    if (!amount || parseFloat(amount) <= 0 || parseFloat(amount) > MOCK_BALANCE) return;
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setIsDeployed(true);
    }, 2000); // Wait 2s to simulate transaction loading
  };

  if (isDeployed) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-6 animate-[fadeIn_0.5s_ease-out]">
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-4 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
             <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
             </svg>
             <span className="font-medium tracking-wide">Agent successfully deployed on Base.</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
               <div className="flex justify-between items-center mb-8">
                 <h2 className="text-xl font-medium text-white">Active Deployment</h2>
                 <span className="text-green-400 text-xs px-3 py-1 bg-green-400/10 rounded-full font-mono font-medium">Agent Live</span>
               </div>
               
               <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                 <div className="space-y-2">
                   <div className="text-xs text-gray-400 tracking-wider">Deposited</div>
                   <div className="text-3xl font-mono text-white">{parseFloat(amount).toLocaleString()}</div>
                 </div>
                 <div className="space-y-2">
                   <div className="text-xs text-gray-400 tracking-wider">Est. APY</div>
                   <div className="text-3xl font-mono text-white">
                      8-12<span className="text-xl text-gray-500">%</span>
                   </div>
                 </div>
                 <div className="space-y-2">
                   <div className="text-xs text-gray-400 tracking-wider">Est. Earnings</div>
                   <div className="text-3xl font-mono text-gold">+12.42</div>
                 </div>
               </div>

               <div className="pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2 group relative inline-flex cursor-default">
                    <span className="text-sm text-gray-400 font-medium">✨ Powered by ERC-8183 Agent Commerce</span>
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="absolute bottom-full left-0 mb-3 w-64 p-3 bg-black border border-border text-xs text-gray-300 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                      Agents create jobs, hire other agents, and settle payments onchain natively without intermediaries.
                    </div>
                  </div>
               </div>
            </div>

            <AgentStatus amount={amount} />
          </div>
          
           <div className="space-y-6">
              <div className="bg-surface border border-border rounded-2xl p-6 shadow-xl">
                <h3 className="text-xs font-semibold text-gray-400 mb-6 uppercase tracking-wider">Strategy Parameters</h3>
                <div className="space-y-6">
                  <div>
                    <div className="text-xs text-gray-500 uppercase">Asset Class</div>
                    <div className="text-base text-white mt-1">Real-World Assets (RWA)</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase">Target</div>
                    <div className="text-base text-white mt-1">Fractional Real Estate</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase">Settlement Network</div>
                    <div className="text-base text-white mt-1">Base (L2)</div>
                  </div>
                </div>
                <button
                  onClick={() => setIsDeployed(false)}
                  className="w-full mt-10 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm rounded-xl transition-all"
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
    <div className="w-full max-w-md mx-auto bg-surface border border-border rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden animate-[fadeIn_0.5s_ease-out]">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[80px] -z-10 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
        <h2 className="text-xl font-medium tracking-wide text-white">Deposit Capital</h2>
        <span className="text-gold tracking-widest text-xs uppercase px-2 py-1 bg-gold/10 rounded-md">ERC-8183 Vault</span>
      </div>

      <div className="space-y-6">
        <div className="space-y-2 text-left">
          <div className="flex justify-between text-sm text-gray-400">
            <label>Amount (USDC)</label>
            <span className="cursor-pointer hover:text-white transition-colors" onClick={handleMax}>
               Balance: <span className="font-mono text-white">{MOCK_BALANCE.toFixed(2)}</span>
            </span>
          </div>
          <div className="relative group">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-black/50 border border-white/10 rounded-xl py-4 flex-1 px-4 pr-20 text-3xl font-mono text-white placeholder-gray-600 focus:outline-none focus:border-gold/50 transition-colors"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
               <button 
                 onClick={handleMax}
                 className="text-xs font-bold tracking-wider text-gold hover:text-white transition-colors uppercase bg-gold/10 px-3 py-1.5 rounded"
               >
                 Max
               </button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Network Strategy</span>
            <span className="text-white text-right font-medium">Base RWA</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Estimated APY</span>
            <span className="text-green-400 font-mono">8% - 12%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Agent Fee</span>
            <span className="text-white font-mono">0.0 USDC</span>
          </div>
        </div>

        <button
          onClick={handleDeploy}
          disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > MOCK_BALANCE || isDeploying}
          className="w-full py-4 mt-2 bg-gold text-background rounded-xl font-bold tracking-widest uppercase hover:bg-gold-bright hover:shadow-[0_0_20px_rgba(212,181,96,0.2)] transition-all disabled:opacity-50 disabled:pointer-events-none relative"
        >
          {isDeploying ? (
             <div className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5 text-background" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deploying...
             </div>
          ) : (
             "Deploy Agent"
          )}
        </button>
      </div>
    </div>
  );
}
