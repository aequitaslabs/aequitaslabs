import { useState, useEffect } from 'react';
import AgentStatus, { AgentState } from './AgentStatus';

type DepositState = 'CONNECT' | 'INPUT' | 'CONFIRMING' | 'PENDING' | 'SUCCESS';

export default function Deposit() {
  const [state, setState] = useState<DepositState>('CONNECT');
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  // Fake blocks/time
  const [blocks, setBlocks] = useState(0);
  const [txHash, setTxHash] = useState('');
  
  const MOCK_BALANCE = 1250.00;
  const APY = "10.4";

  const handleMax = () => {
    setAmount(MOCK_BALANCE.toString());
    setError('');
  };

  const handleConnect = () => {
    setState('INPUT');
  };

  const handleDeposit = () => {
    setError('');
    const amt = parseFloat(amount);
    if (!amount || isNaN(amt) || amt <= 0) {
      setError('Invalid amount entered');
      return;
    }
    if (amt > MOCK_BALANCE) {
      setError('INSUFFICIENT_BALANCE: Cannot exceed available USDC');
      return;
    }

    setState('CONFIRMING');
    
    // Simulate wallet approve/sign
    setTimeout(() => {
      setState('PENDING');
      setTxHash('0x' + Math.random().toString(16).slice(2, 6) + '...' + Math.random().toString(16).slice(-4));
      setBlocks(1);
    }, 1500);
  };

  useEffect(() => {
    if (state === 'PENDING') {
      const interval = setInterval(() => {
        setBlocks(b => {
          if (b >= 3) {
            clearInterval(interval);
            setState('SUCCESS');
            return b;
          }
          return b + 1;
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [state]);

  // Post-deposit Success Animation
  const [postDeployMsg, setPostDeployMsg] = useState('');
  const [agentStatus, setAgentStatus] = useState<AgentState>('REGISTERED');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    if (state === 'SUCCESS') {
      let i = 0;
      const msg1 = "Master agent deploying capital...";
      // TYPEWRITER effect
      const typew = setInterval(() => {
        setPostDeployMsg(msg1.slice(0, i));
        i++;
        if (i > msg1.length) {
          clearInterval(typew);
          setTimeout(() => {
            setPostDeployMsg("ERC-8183 agent hired for optimization");
            setAgentStatus('CLAIMED');
            setLastUpdated(new Date());
            setTimeout(() => {
              setAgentStatus('EXECUTING');
              setLastUpdated(new Date());
              setTimeout(() => {
                setAgentStatus('SETTLED');
                setLastUpdated(new Date());
              }, 4000);
            }, 2000);
          }, 1500);
        }
      }, 50);
      return () => clearInterval(typew);
    }
  }, [state]);

  const renderInputState = () => (
    <div className="flex flex-col items-center w-full animate-[fadeIn_0.5s_ease-out]">
      <div className="w-full flex justify-between items-center mb-2">
        <label className="font-serif italic text-gray-400 text-sm">Deposit Amount</label>
        <span className="text-gray-500 font-mono text-xs">
          Available: {MOCK_BALANCE.toFixed(2)} USDC
        </span>
      </div>
      
      <div className="relative w-full mb-3">
        <input
          type="number"
          value={amount}
          onChange={(e) => { setAmount(e.target.value); setError(''); }}
          placeholder="0.00"
          className="w-full bg-[#0F0E13] border border-white/[0.08] rounded-xl py-6 px-6 text-center text-4xl font-mono text-white placeholder-gray-800 focus:outline-none focus:border-gold/50 transition-colors"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <span className="text-gray-500 font-mono text-sm tracking-widest font-bold">USDC</span>
          <button 
            onClick={handleMax}
            className="text-[10px] font-bold tracking-widest text-gold uppercase bg-gold/10 border border-gold/20 px-2 py-1 rounded hover:bg-gold/20 transition-colors"
          >
            MAX
          </button>
        </div>
      </div>

      {error && <div className="text-red-500 text-xs font-mono w-full text-left mb-3">{error}</div>}

      <div className="w-full flex justify-between tracking-wide text-xs font-mono text-gray-500 mb-6">
        <span className="text-green-400/80">~{APY}% APY · USDC settled monthly</span>
        <span className="text-[10px]">Gas: ~0.0001 ETH</span>
      </div>

      <button
        onClick={handleDeposit}
        disabled={!amount}
        className="w-full py-4 bg-white hover:bg-gray-200 text-black rounded-xl text-sm font-bold tracking-widest uppercase transition-all disabled:opacity-50 disabled:pointer-events-none"
      >
        Deposit USDC
      </button>
    </div>
  );

  return (
    <div className="bg-[#0F0E13] border border-white/[0.08] p-8 rounded-2xl w-full max-w-md mx-auto relative overflow-hidden flex flex-col items-center shadow-2xl backdrop-blur-3xl min-h-[400px] justify-center">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[80px] -z-10 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
      
      {state === 'CONNECT' && (
        <div className="flex flex-col items-center py-6 animate-[fadeIn_0.5s_ease-out]">
          <h2 className="text-2xl font-serif text-white mb-2">Initialize Terminal</h2>
          <p className="text-gray-500 text-sm font-mono text-center mb-8">Establish secure connection to Base Sepolia <br/>to deploy autonomous capital.</p>
          <button
            onClick={handleConnect}
            className="px-8 py-3 bg-white text-black font-mono text-sm font-bold tracking-widest uppercase rounded-xl hover:bg-gray-200 transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      )}

      {state === 'INPUT' && renderInputState()}

      {state === 'CONFIRMING' && (
        <div className="flex flex-col items-center py-10 w-full animate-[fadeIn_0.5s_ease-out]">
          <div className="w-12 h-12 border-2 border-white/10 border-t-gold rounded-full animate-spin mb-6"></div>
          <h2 className="text-xl font-serif text-white mb-2">Confirm in Wallet</h2>
          <p className="text-gray-500 font-mono text-xs tracking-wider">Waiting for signature...</p>
        </div>
      )}

      {state === 'PENDING' && (
        <div className="flex flex-col items-center py-10 w-full animate-[fadeIn_0.5s_ease-out]">
          <div className="w-12 h-12 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin mb-6"></div>
          <h2 className="text-xl font-serif text-white mb-2">Transaction Pending</h2>
          <p className="text-gray-500 font-mono text-xs mb-4 uppercase tracking-widest text-[#6ddbb0]">Transaction pending on Base...</p>
          <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
             <span>Block {blocks}/3</span>
             <a href="#" className="text-blue-400 hover:text-blue-300 underline decoration-blue-500/30 underline-offset-4 pointer-events-none">
               {txHash}
             </a>
          </div>
        </div>
      )}

      {state === 'SUCCESS' && (
        <div className="flex flex-col w-full animate-[fadeIn_0.5s_ease-out] text-left">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center text-green-400 text-lg">✓</div>
            <div>
              <h2 className="text-lg font-serif text-white leading-tight">Deposited {parseFloat(amount).toLocaleString()} USDC</h2>
              <a href="#" className="text-gray-500 hover:text-gray-400 font-mono text-[10px] underline decoration-gray-500/30 underline-offset-4 hover:-translate-y-px transition-transform pointer-events-none">
                Tx: {txHash}
              </a>
            </div>
          </div>
          
          <div className="bg-black/30 border border-white/5 rounded-xl p-4 mb-6 font-mono text-xs flex flex-col gap-2 relative">
            <div className="text-gold h-4 tracking-wide">{postDeployMsg} {agentStatus !== 'SETTLED' && <span className="animate-[pulse_0.8s_ease-in-out_infinite]">_</span>}</div>
            <p className="text-gray-500 italic font-serif text-sm">Your USDC is now managed on-chain. No further action required.</p>
          </div>

          <div className="border-t border-white/[0.08] pt-6 flex justify-center">
            <AgentStatus
              agentId="agt-8f3a39b2-11e4"
              walletAddress="0x7aB412d2A99c390a"
              reputationScore={94.2}
              status={agentStatus}
              currentTaskId={agentStatus !== 'REGISTERED' && agentStatus !== 'SETTLED' ? "job_49112" : undefined}
              lastUpdated={lastUpdated}
              framework="langchain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
