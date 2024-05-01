import React from 'react';
import logo from './logo.svg';
import './App.css';
import { FC, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletConnectWalletAdapter } from "@solana/wallet-adapter-walletconnect";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useState } from 'react';

const PublicKey: FC = () => {
  const { publicKey } = useWallet();

  return (
    <p>{publicKey ? `Public Key: ${publicKey.toBase58()}` : `Not Connected`}</p>
  );
};

const SignMessage: FC = () => {
  const wallet = useWallet();
  const [signedMessage, setSignedMessage] = useState('');
  
  const signMessage = async () => {
    try {
      const message: string | null = prompt('Enter a message to sign:');
      if (message && wallet?.signMessage) {
        const encodedMessage = new TextEncoder().encode(message);
        const signature = await wallet.signMessage(encodedMessage);
        const signatureBase58 = signature.toString();
        setSignedMessage(`Signed Message: ${signatureBase58}`);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to sign message.');
    }
  };

  return (
    <div>
      <button onClick={signMessage} disabled={!wallet.connected}>Sign Message</button>
      {signedMessage && <p>{signedMessage}</p>}
    </div>
  );
};

function App() {
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new WalletConnectWalletAdapter({
        network,
        options: {
          projectId: "2a2a5978a58aad734d13a2d194ec469a",
        },
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div
            style={{
              display: "flex",
              gap: "2rem",
            }}
          >
            <WalletMultiButton />
            <WalletDisconnectButton />
          </div>
          <PublicKey />
          <SignMessage/>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );

}

export default App;
