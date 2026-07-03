import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = (process.env.BACKEND_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const healthUrl = `${backendUrl}/health`;

  try {
    const started = Date.now();
    const res = await fetch(healthUrl, {
      method: "GET",
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(120_000),
    });
    const body = await res.json().catch(() => null);
    const elapsedMs = Date.now() - started;

    return NextResponse.json(
      {
        ok: res.ok,
        status: res.status,
        healthUrl,
        elapsedMs,
        backend: body,
      },
      { status: res.ok ? 200 : 502 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Keep-alive ping failed";
    return NextResponse.json(
      { ok: false, healthUrl, error: message },
      { status: 502 },
    );
  }
}
