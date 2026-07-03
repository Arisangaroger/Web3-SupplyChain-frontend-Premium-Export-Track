"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SurfaceInset } from "@/components/ui/SurfaceInset";
import { BodyText, DataValue, TypeLabel } from "@/components/ui/typography";
import {
  getApiErrorMessage,
  listIntakeFarmers,
  registerIntakeFarmer,
  type FarmerSummary,
} from "@/services/api";

const PAGE_SIZE = 10;

interface Props {
  isReady: boolean;
  isBoundToStation: boolean;
  washingStationId: string;
  onFarmersChanged?: () => void;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function FarmersPanel({
  isReady,
  isBoundToStation,
  washingStationId,
  onFarmersChanged,
}: Props) {
  const [fullName, setFullName] = useState("");
  const [kycReference, setKycReference] = useState("");
  const [registering, setRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [farmers, setFarmers] = useState<FarmerSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const stationParam = isBoundToStation ? undefined : washingStationId;

  const loadFarmers = useCallback(
    async (pageOverride?: number) => {
      if (!isReady) {
        setFarmers([]);
        setTotal(0);
        setTotalPages(0);
        return;
      }

      const activePage = pageOverride ?? page;
      setLoading(true);
      setError(null);
      try {
        const data = await listIntakeFarmers({
          washingStationId: stationParam,
          page: activePage,
          limit: PAGE_SIZE,
        });
        setFarmers(data.farmers);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        if (pageOverride !== undefined) {
          setPage(pageOverride);
        }
      } catch (err) {
        setError(getApiErrorMessage(err, "Failed to load farmers"));
      } finally {
        setLoading(false);
      }
    },
    [isReady, page, stationParam],
  );

  useEffect(() => {
    void loadFarmers();
  }, [loadFarmers]);

  useEffect(() => {
    setPage(1);
  }, [washingStationId, isReady]);

  const onRegister = async (event: FormEvent) => {
    event.preventDefault();
    if (!fullName.trim() || !isReady) return;

    setRegistering(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await registerIntakeFarmer(
        { fullName: fullName.trim(), kycReference: kycReference.trim() || undefined },
        stationParam,
      );
      setFullName("");
      setKycReference("");
      setSuccess(`Registered farmer #${result.farmer.id} — ${result.farmer.fullName}`);
      await loadFarmers(1);
      onFarmersChanged?.();
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to register farmer"));
    } finally {
      setRegistering(false);
    }
  };

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  return (
    <>
      <Card title="Register farmer" weight="secondary">
        <SurfaceInset className="p-4">
          <BodyText muted className="mb-3">
            Add cooperative members to this washing station. Each farmer receives a numeric ID for cherry intake.
          </BodyText>
          <form onSubmit={onRegister} className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Farmer full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Jean Mukamana"
              required
            />
            <Input
              label="KYC reference (optional)"
              mono
              value={kycReference}
              onChange={(e) => setKycReference(e.target.value)}
              placeholder="e.g. KYC-2026-0042"
            />
            <div className="sm:col-span-2">
              <Button type="submit" disabled={registering || !isReady}>
                {registering ? "Registering..." : "Register farmer"}
              </Button>
            </div>
          </form>
          {success ? (
            <TypeLabel className="mt-3 text-forest">{success}</TypeLabel>
          ) : null}
          {error ? (
            <TypeLabel className="mt-3 text-red-700">{error}</TypeLabel>
          ) : null}
        </SurfaceInset>
      </Card>

      <Card title="Farmer records" weight="tertiary" className="mt-6">
        <SurfaceInset className="p-4">
          {!isReady ? (
            <BodyText muted>Set a washing station ID to view farmer records.</BodyText>
          ) : loading ? (
            <BodyText muted>Loading farmers...</BodyText>
          ) : farmers.length === 0 ? (
            <BodyText muted>No farmers registered for this station yet.</BodyText>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[36rem] text-left text-sm">
                  <thead>
                    <tr className="border-b border-forest/10 text-xs uppercase tracking-wide text-slate-500">
                      <th className="py-2 pr-4 font-medium">ID</th>
                      <th className="py-2 pr-4 font-medium">Name</th>
                      <th className="py-2 pr-4 font-medium">KYC</th>
                      <th className="py-2 pr-4 font-medium">Registered</th>
                      <th className="py-2 pr-4 font-medium">Deliveries</th>
                      <th className="py-2 font-medium">Total kg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {farmers.map((farmer) => (
                      <tr key={farmer.id} className="border-b border-forest/5">
                        <td className="py-3 pr-4 font-data font-semibold text-forest">
                          #{farmer.id}
                        </td>
                        <td className="py-3 pr-4">{farmer.fullName}</td>
                        <td className="py-3 pr-4 font-data text-slate-600">
                          {farmer.kycReference ?? "—"}
                        </td>
                        <td className="py-3 pr-4 font-data text-slate-600">
                          {farmer.createdAt ? formatDate(farmer.createdAt) : "—"}
                        </td>
                        <td className="py-3 pr-4 font-data">{farmer.deliveryCount ?? 0}</td>
                        <td className="py-3 font-data">
                          {(farmer.totalWeightKg ?? 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <TypeLabel className="text-slate-600">
                  Showing{" "}
                  <DataValue>
                    {rangeStart}–{rangeEnd}
                  </DataValue>{" "}
                  of <DataValue>{total}</DataValue>
                </TypeLabel>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={page <= 1 || loading}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                  >
                    Previous
                  </Button>
                  <TypeLabel className="font-data tabular-nums">
                    Page {page} of {Math.max(totalPages, 1)}
                  </TypeLabel>
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={page >= totalPages || loading}
                    onClick={() => setPage((current) => current + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </SurfaceInset>
      </Card>
    </>
  );
}
