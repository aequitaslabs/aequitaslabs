import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Wallet() {
  return (
    <ConnectButton 
      showBalance={true}
      chainStatus="full"
      accountStatus={{
        smallScreen: 'avatar',
        largeScreen: 'full',
      }}
    />
  );
}
