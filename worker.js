export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': 'https://sokokensetsu.github.io',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        }
      });
    }

    const url = new URL(request.url);
    const target = url.searchParams.get('url');

    if (!target) {
      return new Response('Missing url param', { status: 400 });
    }

    if (!target.startsWith('https://api.smaregi.jp/') &&
        !target.startsWith('https://id.smaregi.jp/')) {
      return new Response('Forbidden', { status: 403 });
    }

    const proxyReq = new Request(target, {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' ? request.body : undefined,
    });

    const response = await fetch(proxyReq);
    const body = await response.text();

    return new Response(body, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://sokokensetsu.github.io',
      }
    });
  }
};
