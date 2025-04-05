import { createConfig, configureChains, mainnet } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { createWeb3Modal } from '@web3modal/wagmi/react'

const projectId = 'SEU_PROJECT_ID' // Substitua pelo seu Project ID do WalletConnect

const { chains, publicClient } = configureChains(
  [mainnet],
  [publicProvider()]
)

export const config = createConfig({
  autoConnect: true,
  publicClient,
  chains
})

// Initialize modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  chains,
  themeMode: 'light'
})