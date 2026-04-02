import { useState, useEffect } from 'react';

export type AgentState = 'REGISTERED' | 'CLAIMED' | 'EXECUTING' | 'SUBMITTED' | 'VERIFIED' | 'SETTLED' | 'TAMPER_DETECTED';

export interface AgentStatusProps {
  agentId: string;
  walletAddress: string;
  reputationScore: number;
  status: AgentState;
  currentTaskId?: string;
  lastUpdated: Date;
  framework: 'langchain' | 'autogpt' | 'crewai' | 'custom';
}

export default function AgentStatus({
  agentId,
  walletAddress,
  reputationScore,
  status,
  currentTaskId,
  lastUpdated,
  framework
}: AgentStatusProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'EXECUTING') {
      interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - lastUpdated.getTime()) / 1000));
      }, 1000);
    } else {
      setElapsed(0);
    }
    return () => clearInterval(interval);
  }, [status, lastUpdated]);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const formatTime = (time: Date) => `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;
  
  const truncate = (str: string, isHex = false) => {
    if (isHex && str.startsWith('0x')) return `${str.slice(0, 6)}...${str.slice(-4)}`;
    return `${str.slice(0, 8)}...${str.slice(-4)}`;
  };

  const getStatusVisuals = (s: AgentState) => {
    switch (s) {
      case 'REGISTERED': return { dot: 'bg-blue-500', anim: '', label: 'REGISTERED' };
      case 'CLAIMED': return { dot: 'bg-amber-500', anim: 'animate-[pulse_3s_ease-in-out_infinite]', label: 'CLAIMED' };
      case 'EXECUTING': return { dot: 'bg-amber-500', anim: 'animate-[pulse_1s_ease-in-out_infinite]', label: 'EXECUTING' };
      case 'SUBMITTED': return { dot: 'bg-blue-500', anim: '', label: 'SUBMITTED' };
      case 'VERIFIED': return { dot: 'bg-green-500', anim: 'animate-[ping_1s_ease-out_1]', label: 'VERIFIED' };
      case 'SETTLED': return { dot: 'bg-green-500', anim: '', label: 'SETTLED' };
      case 'TAMPER_DETECTED': return { dot: 'bg-red-500', anim: 'animate-[flash_0.5s_ease-in-out_infinite]', label: 'CRITICAL HALT' };
    }
  };

  const visuals = getStatusVisuals(status);

  return (
    <div className="bg-[#0F0E13] border border-white/[0.08] p-5 rounded-xl flex flex-col gap-4 max-w-sm h-fit shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-white/[0.08] pb-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${visuals.dot} ${visuals.anim}`}></div>
            <span className={`font-mono text-xs font-bold tracking-wider ${status === 'TAMPER_DETECTED' ? 'text-red-500' : 'text-white'}`}>
              {visuals.label}
              {status === 'EXECUTING' && <span className="inline-block w-1.5 h-3 ml-1 bg-amber-500 animate-[pulse_0.8s_ease-in-out_infinite]"></span>}
            </span>
          </div>
          <span className="font-serif italic text-gray-500 text-sm">Last Update: {formatTime(lastUpdated)}</span>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          {reputationScore >= 90 && <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest">PRIORITY</span>}
          {reputationScore < 50 && <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest">RESTRICTED</span>}
          <span className="font-mono text-gray-400 text-xs">Score: <span className="text-white">{reputationScore.toFixed(1)}</span></span>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
        <div className="flex flex-col gap-1">
          <span className="font-serif italic text-gray-500">Agent ID</span>
          <span className="font-mono text-gray-300 text-xs">{truncate(agentId)}</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="font-serif italic text-gray-500">Wallet Address</span>
          <span className="font-mono text-gray-300 text-xs">{truncate(walletAddress, true)}</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="font-serif italic text-gray-500">Framework</span>
          <span className="font-mono text-gray-300 text-xs uppercase">{framework}</span>
        </div>

        {currentTaskId && (
          <div className="flex flex-col gap-1">
            <span className="font-serif italic text-gray-500">Current Task</span>
            <span className="font-mono text-gold text-xs">{truncate(currentTaskId)}</span>
          </div>
        )}
      </div>

      {/* Execution Timer */}
      {status === 'EXECUTING' && (
        <div className="mt-2 pt-3 border-t border-white/[0.08] flex justify-between items-center">
          <span className="font-serif italic text-gray-500 text-sm">Elapsed Time</span>
          <span className="font-mono text-amber-500 text-xs">{elapsed}s</span>
        </div>
      )}
    </div>
  );
}
