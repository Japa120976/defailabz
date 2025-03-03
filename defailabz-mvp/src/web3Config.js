import { createConfig, configureChains } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { createPublicClient, http } from 'viem';

const projectId = 'SEU_PROJECT_ID'; // Substitua pelo seu Project ID do WalletConnect

const { chains, publicClient } = configureChains(
  [mainnet],
  [publicProvider()]
);

const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
});

const ethereumClient = createPublicClient({
  chain: mainnet,
  transport: http()
});

export { wagmiConfig, chains, projectId, ethereumClient };