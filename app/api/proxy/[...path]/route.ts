import { NextRequest, NextResponse } from 'next/server';

async function proxyHandler(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const path = (await params).path.join('/');
  const upstreamPath = (`/api/${path}`.replace(/\/{2,}/g, '/').replace(/\/+$/, '') + '/');
  const upstreamUrl = new URL(upstreamPath, 'https://api-test.krifth.com');
  upstreamUrl.search = request.nextUrl.search;
  
  let body = null;
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    try {
      body = await request.json();
    } catch (e) {
      // No body or invalid JSON
    }
  }

  const authHeader = request.headers.get('Authorization');

  try {
    console.log(`Proxying ${request.method} to: ${upstreamUrl.toString()}`);
    if (body) console.log('Request Body:', JSON.stringify(body, null, 2));
    
    const response = await fetch(upstreamUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(authHeader ? { 'Authorization': authHeader } : {}),
        'Host': 'api-test.krifth.com',
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    console.log(`Upstream Response Status: ${response.status}`);
    const responseText = await response.text();

    let data;
    try {
        data = JSON.parse(responseText);
        console.log('Response Data:', JSON.stringify(data, null, 2));
    } catch (e) {
        data = { message: responseText };
        console.log('Response Text (Non-JSON):', responseText);
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Proxy Fetch Error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request', message: error.message },
      { status: 500 }
    );
  }
}

export const GET = proxyHandler;
export const POST = proxyHandler;
export const PUT = proxyHandler;
export const DELETE = proxyHandler;
