import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const path = (await params).path.join('/');
  const upstreamPath = (`/api/${path}`.replace(/\/{2,}/g, '/').replace(/\/+$/, '') + '/');
  const upstreamUrl = new URL(upstreamPath, 'https://api-test.krifth.com');
  upstreamUrl.search = request.nextUrl.search;
  
  let body = null;
  try {
    body = await request.json();
    console.log('Proxy Body:', body);
  } catch (e) {
    // No body or invalid JSON
  }
  const authHeader = request.headers.get('Authorization');

  try {
    console.log(`Proxying to: ${upstreamUrl.toString()}`);
    const response = await fetch(upstreamUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { 'Authorization': authHeader } : {}),
        'Host': 'api-test.krifth.com',
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const responseText = await response.text();
    let data;
    try {
        data = JSON.parse(responseText);
    } catch (e) {
        data = { message: responseText };
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Proxy Fetch Error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request', message: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
