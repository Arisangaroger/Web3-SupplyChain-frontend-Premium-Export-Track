export interface Operator {
  id: string;
  email: string;
  role: string;
  washingStationId?: string | null;
}

export interface AuthResponse {
  accessToken: string;
  operator: Operator;
}

const TOKEN_KEY = "sc_access_token";
const OPERATOR_KEY = "sc_operator";

export function saveSession(auth: AuthResponse) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, auth.accessToken);
  localStorage.setItem(OPERATOR_KEY, JSON.stringify(auth.operator));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(OPERATOR_KEY);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getOperator(): Operator | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(OPERATOR_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Operator;
  } catch {
    return null;
  }
}

export { roleDashboardPath } from "@/lib/roles";
