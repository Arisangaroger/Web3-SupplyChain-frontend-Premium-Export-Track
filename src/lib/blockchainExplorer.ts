const DEFAULT_EXPLORER = "https://amoy.polygonscan.com";

export function buildExplorerTxUrl(txHash: string): string {
  const base = (process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL ?? DEFAULT_EXPLORER).replace(/\/$/, "");
  return `${base}/tx/${txHash}`;
}

export function truncateTxHash(txHash: string, head = 10, tail = 8): string {
  if (txHash.length <= head + tail + 3) return txHash;
  return `${txHash.slice(0, head)}…${txHash.slice(-tail)}`;
}
