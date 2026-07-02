import { ExternalLink, Link2 } from "lucide-react";
import { buildExplorerTxUrl, truncateTxHash } from "@/lib/blockchainExplorer";
import { BodyText, DataValue, TypeLabel } from "@/components/ui/typography";

interface Props {
  txHash?: string | null;
  anchoredAt?: string | null;
  compact?: boolean;
}

export function BlockchainProofPanel({ txHash, anchoredAt, compact = false }: Props) {
  if (!txHash && !anchoredAt) return null;

  return (
    <div className={`blockchain-accent surface-inset ring-1 ring-amber/10 ${compact ? "p-3" : "p-4"}`}>
      <div className="flex items-center gap-2">
        <Link2 className="h-4 w-4 text-amber-700" aria-hidden />
        <BodyText className="font-medium text-amber-900">On-chain proof</BodyText>
      </div>
      <dl className={`type-body mt-3 space-y-2 text-slate-700 ${compact ? "" : "sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0"}`}>
        {anchoredAt ? (
          <div>
            <dt className="eyebrow text-slate-400">Anchored</dt>
            <dd className="mt-0.5">
              <DataValue size="xs">{new Date(anchoredAt).toLocaleString()}</DataValue>
            </dd>
          </div>
        ) : null}
        {txHash ? (
          <div className={anchoredAt ? "sm:col-span-2" : ""}>
            <dt className="eyebrow text-slate-400">Transaction</dt>
            <dd className="mt-0.5">
              <a
                href={buildExplorerTxUrl(txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-data text-xs text-amber-800 hover:underline"
              >
                {truncateTxHash(txHash)}
                <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
                <span className="sr-only">View on block explorer</span>
              </a>
            </dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}
