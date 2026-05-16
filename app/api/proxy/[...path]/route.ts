import { type NextRequest, NextResponse } from "next/server";

const UPSTREAM_ORIGIN = "https://api-test.krifth.com";
const BODY_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

async function proxyHandler(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const upstreamUrl = buildUpstreamUrl(path, request.nextUrl.search);

  try {
    const headers = new Headers({
      "Accept": request.headers.get("Accept") ?? "application/json",
    });

    const contentType = request.headers.get("Content-Type");
    const authHeader = request.headers.get("Authorization");

    if (contentType) headers.set("Content-Type", contentType);
    if (authHeader) headers.set("Authorization", authHeader);

    const body = BODY_METHODS.has(request.method) ? await request.text() : undefined;
    const upstreamResponse = await fetch(upstreamUrl, {
      method: request.method,
      headers,
      body: body || undefined,
      cache: "no-store",
    });

    const responseText = await upstreamResponse.text();
    const responseContentType = upstreamResponse.headers.get("Content-Type") ?? "application/json";

    if (responseContentType.includes("application/json")) {
      return jsonResponse(responseText, upstreamResponse.status, responseContentType);
    }

    return new Response(responseText, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: { "Content-Type": responseContentType },
    });
  } catch (error) {
    console.error("Proxy Fetch Error:", error);
    return NextResponse.json(
      { error: "Failed to proxy request" },
      { status: 502 }
    );
  }
}

function buildUpstreamUrl(path: string[], search: string) {
  const upstreamPath = (`/api/${path.join("/")}`.replace(/\/{2,}/g, "/").replace(/\/+$/, "") + "/");
  const upstreamUrl = new URL(upstreamPath, UPSTREAM_ORIGIN);
  upstreamUrl.search = search;
  return upstreamUrl;
}

function jsonResponse(responseText: string, status: number, contentType: string) {
  if (!responseText) {
    return new Response(null, { status });
  }

  try {
    return NextResponse.json(JSON.parse(responseText), {
      status,
      headers: { "Content-Type": contentType },
    });
  } catch {
    return NextResponse.json(
      { message: responseText },
      { status, headers: { "Content-Type": "application/json" } }
    );
  }
}

export const GET = proxyHandler;
export const POST = proxyHandler;
export const PUT = proxyHandler;
export const PATCH = proxyHandler;
export const DELETE = proxyHandler;
export const OPTIONS = proxyHandler;
