import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Wallet() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} type="button" className="bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-xl px-6 py-2.5 rounded-xl font-mono text-sm tracking-widest uppercase transition-all shadow-[0_4px_24px_rgba(0,0,0,0.2)] text-white">
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button" className="bg-red-500/10 text-red-400 border border-red-500/20 backdrop-blur-xl px-6 py-2.5 rounded-xl font-mono text-sm tracking-widest uppercase transition-all shadow-[0_4px_24px_rgba(239,68,68,0.1)]">
                    Wrong network
                  </button>
                );
              }

              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={openChainModal}
                    style={{ display: 'flex', alignItems: 'center' }}
                    type="button"
                    className="bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-xl px-4 py-2.5 rounded-xl font-mono text-sm tracking-widest transition-all hidden sm:flex text-white"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 20,
                          height: 20,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 8,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 20, height: 20 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>

                  <button onClick={openAccountModal} type="button" className="bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-xl px-6 py-2.5 rounded-xl font-mono text-sm tracking-widest transition-all font-medium text-gold flex items-center gap-2 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
                    {account.displayName}
                    <span className="hidden sm:inline">
                       ({account.displayBalance})
                    </span>
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
