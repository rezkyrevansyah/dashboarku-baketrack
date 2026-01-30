import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'Missing target URL' }, { status: 400 });
  }

  try {
    console.log('[Proxy GET] Fetching:', targetUrl);
    const res = await fetch(targetUrl, { cache: 'no-store' });
    console.log('[Proxy GET] Status:', res.status);
    
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch (e) {
      console.error('[Proxy GET] JSON Parse Error. Raw text:', text.substring(0, 500)); // Log first 500 chars
      return NextResponse.json({ error: 'Failed to parse JSON from GAS', raw: text.substring(0, 200) }, { status: 500 });
    }
  } catch (error) {
    console.error('[Proxy GET] Network Error:', error);
    return NextResponse.json({ error: 'Failed to fetch data from Spreadsheet' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'Missing target URL' }, { status: 400 });
  }

  try {
    // Read the incoming form data
    const incomingData = await request.formData();
    
    // Convert to URLSearchParams for GAS compatibility (application/x-www-form-urlencoded)
    const outgoingParams = new URLSearchParams();
    incomingData.forEach((value, key) => {
      outgoingParams.append(key, value.toString());
    });

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: outgoingParams.toString(),
      redirect: 'follow', // Explicitly follow redirects
    });
    
    // Check if the response is actually OK
    if (!res.ok) {
      throw new Error(`GAS responded with status ${res.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Proxy POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send data to Spreadsheet' }, { status: 500 });
  }
}
