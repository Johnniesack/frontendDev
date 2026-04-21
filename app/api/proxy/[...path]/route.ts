import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const path = (await params).path.join('/');
  const targetUrl = `https://api-test.krifth.com/api/${path}/`;
  
  let body = null;
  try {
    body = await request.json();
    console.log('Proxy Body:', body);
  } catch (e) {
    // No body or invalid JSON
  }
  const authHeader = request.headers.get('Authorization');

  try {
    console.log(`Proxying to: ${targetUrl}`);
    const response = await fetch(targetUrl, {
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
