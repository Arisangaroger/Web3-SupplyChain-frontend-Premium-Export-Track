import Dexie, { type EntityTable } from "dexie";
import type { DeliveryPayload } from "./api";

export interface PendingDelivery extends DeliveryPayload {
  id?: number;
  createdAt: string;
  syncStatus: "pending" | "synced" | "failed";
  errorMessage?: string;
}

class OfflineDatabase extends Dexie {
  pendingDeliveries!: EntityTable<PendingDelivery, "id">;

  constructor() {
    super("SupplyChainOffline");
    this.version(1).stores({
      pendingDeliveries: "++id, syncStatus, createdAt",
    });
  }
}

export const offlineDb = new OfflineDatabase();

export async function queueOfflineDelivery(payload: DeliveryPayload) {
  return offlineDb.pendingDeliveries.add({
    ...payload,
    createdAt: new Date().toISOString(),
    syncStatus: "pending",
  });
}

export async function getPendingDeliveries() {
  return offlineDb.pendingDeliveries
    .where("syncStatus")
    .equals("pending")
    .toArray();
}

export async function markDeliverySynced(id: number) {
  await offlineDb.pendingDeliveries.update(id, { syncStatus: "synced" });
}

export async function markDeliveryFailed(id: number, errorMessage: string) {
  await offlineDb.pendingDeliveries.update(id, {
    syncStatus: "failed",
    errorMessage,
  });
}

export async function countPendingDeliveries() {
  return offlineDb.pendingDeliveries.where("syncStatus").equals("pending").count();
}

export async function countFailedDeliveries() {
  return offlineDb.pendingDeliveries.where("syncStatus").equals("failed").count();
}

export async function getFailedDeliveries() {
  return offlineDb.pendingDeliveries.where("syncStatus").equals("failed").toArray();
}

export async function markDeliveryPending(id: number) {
  await offlineDb.pendingDeliveries.update(id, {
    syncStatus: "pending",
    errorMessage: undefined,
  });
}
