import axios, { isAxiosError } from "axios";
import { clearSession, getToken } from "@/lib/auth";

export function resolveApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";
}

export function resolveHealthUrl(): string {
  const apiBase = resolveApiBaseUrl();
  if (apiBase.startsWith("/")) {
    return "/health";
  }
  return `${apiBase.replace(/\/api\/?$/, "")}/health`;
}

export function getApiErrorMessage(error: unknown, fallback = "Request failed"): string {
  if (isAxiosError(error)) {
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      return "The server did not respond in time. If you use Render free tier, open the backend /health URL in your browser first to wake it, then try again. Also confirm BACKEND_URL is set on Vercel.";
    }
    const data = error.response?.data as { message?: string | string[] } | undefined;
    if (Array.isArray(data?.message)) {
      return data.message.join(", ");
    }
    if (typeof data?.message === "string") {
      return data.message;
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

/** True when the client could not reach the API — safe to queue for later sync. */
export function isOfflineEligibleError(error: unknown): boolean {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return true;
  }
  if (isAxiosError(error)) {
    if (!error.response) {
      return true;
    }
    const status = error.response.status;
    return status === 408 || status === 502 || status === 503 || status === 504;
  }
  return false;
}

const baseURL = resolveApiBaseUrl();

export const api = axios.create({
  baseURL,
  timeout: 60_000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error) && error.response?.status === 401 && getToken()) {
      clearSession();
      if (typeof window !== "undefined" && window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  },
);

export async function checkBackendHealth() {
  const { data } = await axios.get<{ status: string; service: string }>(
    resolveHealthUrl(),
    { timeout: 5_000 },
  );
  return data;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface DeliveryPayload {
  farmerId: number;
  washingStationId?: string;
  deliveryDate: string;
  weightKg: number;
  basePricePerKg: number;
  eudrCoordinates: string;
  regionCode: string;
}

export interface FarmerSummary {
  id: number;
  fullName: string;
  kycReference?: string | null;
  createdAt?: string;
  deliveryCount?: number;
  totalWeightKg?: number;
}

export interface PaginatedFarmersResponse {
  washingStationId: string;
  farmers: FarmerSummary[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export async function login(payload: LoginPayload) {
  const { data } = await api.post("/auth/login", payload);
  return data;
}

export interface RegisterOperatorPayload {
  email: string;
  password: string;
  role: string;
  washingStationId?: string;
}

export async function registerOperator(payload: RegisterOperatorPayload) {
  const { data } = await api.post("/auth/register", payload);
  return data;
}

export async function getLifecycleStages() {
  const { data } = await api.get<Record<string, string>>("/lifecycle/stages");
  return data;
}

export async function submitDelivery(payload: DeliveryPayload) {
  const { data } = await api.post("/intake/deliveries", payload);
  return data;
}

export async function listIntakeFarmers(options?: {
  washingStationId?: string;
  page?: number;
  limit?: number;
}) {
  const { data } = await api.get<PaginatedFarmersResponse>("/intake/farmers", {
    params: options,
  });
  return data;
}

export async function registerIntakeFarmer(
  payload: { fullName: string; kycReference?: string },
  washingStationId?: string,
) {
  const { data } = await api.post<{ farmer: FarmerSummary; washingStationId: string }>(
    "/intake/farmers",
    payload,
    { params: washingStationId ? { washingStationId } : undefined },
  );
  return data;
}

export async function runRollup(
  washingStationId: string,
  targetPeriod: string,
  options?: { skipAnchor?: boolean },
) {
  const { data } = await api.post("/rollup/run", {
    washingStationId,
    targetPeriod,
    skipAnchor: options?.skipAnchor,
  });
  return data;
}

export async function getRollupJobStatus(jobId: string) {
  const { data } = await api.get(`/rollup/jobs/${jobId}`);
  return data;
}

export async function verifyFarmerForLender(farmerId: number) {
  const { data } = await api.get(`/passport/lenders/farmers/${farmerId}`);
  return data;
}

export async function getFarmerCreditScore(farmerId: number) {
  const { data } = await api.get(`/credit/farmers/${farmerId}/score`);
  return data;
}

export async function getFarmerCreditScoreHistory(farmerId: number) {
  const { data } = await api.get(`/credit/farmers/${farmerId}/score/history`);
  return data;
}

export async function verifyByPassportSlug(slug: string) {
  const { data } = await api.get(`/passport/buyers/passport/${encodeURIComponent(slug)}`);
  return data;
}

export async function verifyLotForBuyer(lotCode: string) {
  const { data } = await api.get(`/passport/buyers/lots/${encodeURIComponent(lotCode)}`);
  return data;
}

export async function splitLot(lotCode: string, allocations: { cooperativeBatchId: number; allocatedWeightKg: number }[]) {
  const { data } = await api.post("/lots/split", { lotCode, allocations });
  return data;
}

export async function mergeLots(targetLotCode: string, sourceLotCodes: string[]) {
  const { data } = await api.post("/lots/merge", { targetLotCode, sourceLotCodes });
  return data;
}

export async function validateLot(lotCode: string) {
  const { data } = await api.post("/lots/validate", { lotCode });
  return data;
}

export async function getLotTrace(lotCode: string) {
  const { data } = await api.get(`/lots/${encodeURIComponent(lotCode)}/trace`);
  return data;
}

export async function createCooperativeBatch(
  farmerId: number,
  washingStationId: string,
  targetPeriod: string,
) {
  const { data } = await api.post("/lots/batches", {
    farmerId,
    washingStationId,
    targetPeriod,
  });
  return data;
}

export async function getLifecycleTimeline(trackingCode: string) {
  const { data } = await api.get(`/lifecycle/${encodeURIComponent(trackingCode)}`);
  return data;
}

export async function registerPrePrintedTrackingQr(payload: {
  trackingCode: string;
  washingStationId: string;
  farmerId: number;
  sackWeightKg: number;
  gpsCoordinates: string;
  eudrCoordinates?: string;
}) {
  const { data } = await api.post("/lifecycle/register-tracking-qr", payload);
  return data;
}

export async function issueBuyerPassport(payload: {
  trackingCode: string;
  gpsCoordinates: string;
  finalizedWeightKg?: number;
}) {
  const { data } = await api.post("/lifecycle/issue-buyer-passport", payload);
  return data;
}

export async function advanceLifecycle(payload: {
  trackingCode: string;
  stage: string;
  gpsCoordinates: string;
}) {
  const { data } = await api.post("/lifecycle/advance", payload);
  return data;
}
