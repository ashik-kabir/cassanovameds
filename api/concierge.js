/**
 * Lambda function for Casanova Medicals AI concierge.
 * Deploy behind API Gateway (HTTP API, ANY /concierge, POST).
 *
 * Environment variables:
 *   ANTHROPIC_API_KEY  — your Anthropic key
 *   ALLOWED_ORIGIN     — e.g. https://www.casanovamed.com (comma-sep for multiple)
 */

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';
const MODEL         = 'claude-haiku-4-5-20251001';  // fast + cheap for concierge
const MAX_TOKENS    = 400;

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGIN || 'https://www.casanovamed.com,https://casanovamed.com,http://127.0.0.1:8002')
  .split(',').map(s => s.trim());

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin':  allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
}

exports.handler = async (event) => {
  const origin = (event.headers || {})['origin'] || '';
  const headers = corsHeaders(origin);

  if (event.requestContext?.http?.method === 'OPTIONS' || event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { system, messages } = body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'messages required' }) };
  }

  // Safety: cap conversation length
  const trimmed = messages.slice(-20);

  try {
    const res = await fetch(ANTHROPIC_API, {
      method: 'POST',
      headers: {
        'Content-Type':       'application/json',
        'x-api-key':          process.env.ANTHROPIC_API_KEY,
        'anthropic-version':  '2023-06-01',
      },
      body: JSON.stringify({
        model:      MODEL,
        max_tokens: MAX_TOKENS,
        system:     system || '',
        messages:   trimmed,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Anthropic error', data);
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: 'Upstream error', detail: data }),
      };
    }

    return { statusCode: 200, headers, body: JSON.stringify(data) };
  } catch (err) {
    console.error('Handler error', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal error' }) };
  }
};
