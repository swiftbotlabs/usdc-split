import { arcTestnet, type Chain } from 'viem/chains'
import { defineChain } from 'viem'

export const arcMainnet = defineChain({
  id: 5042,
  name: 'Arc',
  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.mainnet.arc.io'] } },
  blockExplorers: { default: { name: 'Arc Explorer', url: 'https://explorer.arc.io' } },
})

export type NetworkKey = 'testnet' | 'mainnet'

export interface NetworkConfig {
  chain: Chain
  address: `0x${string}` | null
  deploymentBlock: bigint | null
  /**
   * Block up to which `activityRanges` is known to contain every log the contract
   * emitted. History reads scan only those ranges plus the blocks after this one.
   * null = no snapshot: scan from `deploymentBlock`.
   */
  historySnapshotBlock: bigint | null
  /** Inclusive [from, to] block ranges holding every log up to `historySnapshotBlock`. */
  activityRanges: [bigint, bigint][]
}

export const NETWORKS: Record<NetworkKey, NetworkConfig> = {
  testnet: {
    chain: arcTestnet,
    address: '0xcea442379f266e888277e5f29bc721ad3bb3f9a2',
    deploymentBlock: 68114243n,
    historySnapshotBlock: null,
    activityRanges: [],
  },
  mainnet: {
    chain: arcMainnet,
    address: '0x1ddb12d50b11a97106821896d0e70852fa8902e1', // MAINNET_PLACEHOLDER
    deploymentBlock: 26879353n,
    // Verified by a full log scan of blocks 26879353..28663171: 29 logs, all in this range.
    historySnapshotBlock: 28663171n,
    activityRanges: [[26879450n, 26884750n]],
  },
}

export const DEFAULT_NETWORK: NetworkKey =
  NETWORKS.mainnet.address ? 'mainnet' : 'testnet'

export function getNetworkKey(raw: string | null | undefined): NetworkKey {
  if (raw === 'testnet' || raw === 'mainnet') return raw
  return DEFAULT_NETWORK
}

export function explorerTx(net: NetworkConfig, hash: string): string {
  const base = net.chain.blockExplorers?.default.url ?? ''
  return `${base}/tx/${hash}`
}

export function explorerAddr(net: NetworkConfig, addr: string): string {
  const base = net.chain.blockExplorers?.default.url ?? ''
  return `${base}/address/${addr}`
}
