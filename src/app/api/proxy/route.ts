import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'Missing target URL' }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const res = await fetch(targetUrl, { 
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });
    clearTimeout(timeoutId);
    console.log('[Proxy GET] Status:', res.status);
    console.log('[Proxy GET] Final URL:', res.url);

    // Check for Google Auth Redirect (User didn't set permission to "Anyone")
    if (res.url.includes('accounts.google.com') || res.url.includes('script.google.com/home')) {
        return NextResponse.json({ 
            error: 'Deployment Access Error. Please ensure "Who has access" is set to "Anyone" in your Apps Script deployment.' 
        }, { status: 400 });
    }
    
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch (e) {
      console.error('[Proxy GET] JSON Parse Error. Raw text:', text.substring(0, 500)); 
      
      // If HTML received, it's likely an error page or auth page
      if (text.trim().startsWith('<')) {
          return NextResponse.json({ 
              error: 'Invalid Response (HTML). Likely permission issue or script error.',
              raw: text.substring(0, 200) 
          }, { status: 502 });
      }

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
