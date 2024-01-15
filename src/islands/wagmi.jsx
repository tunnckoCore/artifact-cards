import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { WagmiConfig } from "wagmi";
import { goerli, mainnet } from "viem/chains";

const projectId = "";

const metadata = {
  name: "WGW Launchpad",
  description: "Wiggle Ethscribor",
  url: "https://wgw.lol",
  icons: ["https://avatars.githubusercontent.com/u/5038030"],
};

const chains = [mainnet, goerli];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createWeb3Modal({ wagmiConfig, projectId, chains });

export default function App({ children }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}
