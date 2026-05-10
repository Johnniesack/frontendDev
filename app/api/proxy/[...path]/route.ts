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
    console.log(`Proxying ${request.method} to: ${upstreamUrl.toString()}`);
    console.log('Proxy Headers:', JSON.stringify(Object.fromEntries(request.headers.entries())));
    
    const response = await fetch(upstreamUrl, {
      method: 'POST',
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
    console.log(`Upstream Response Body: ${responseText.substring(0, 500)}`);

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
      { error: 'Failed to proxy request', message: error.message },
      { status: 500 }
    );
  }
}
