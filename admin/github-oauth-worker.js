/**
 * GitHub OAuth Token Exchange Worker
 * ====================================
 * Deploy this as a Cloudflare Worker to handle the OAuth token exchange.
 * GitHub requires the client_secret to exchange the code for a token,
 * which cannot be done client-side.
 *
 * Setup:
 * 1. Create a Cloudflare account at https://workers.cloudflare.com
 * 2. Create a new Worker
 * 3. Paste this code
 * 4. Add environment variables:
 *    - GITHUB_CLIENT_ID: Your OAuth App Client ID
 *    - GITHUB_CLIENT_SECRET: Your OAuth App Client Secret
 * 5. Deploy and use the worker URL in your admin dashboard
 *
 * Or deploy to Vercel/Netlify as a serverless function.
 */

export default {
    async fetch(request, env) {
        // CORS headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': 'https://aashmabidari.com.np',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        // Handle preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        const url = new URL(request.url);

        // Token exchange endpoint
        if (url.pathname === '/token' && request.method === 'POST') {
            try {
                const body = await request.json();
                const { code, client_id } = body;

                if (!code) {
                    return new Response(
                        JSON.stringify({ error: 'Missing code parameter' }),
                        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                    );
                }

                // Exchange code for token with GitHub
                const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        client_id: env.GITHUB_CLIENT_ID || client_id,
                        client_secret: env.GITHUB_CLIENT_SECRET,
                        code: code,
                    }),
                });

                const tokenData = await tokenResponse.json();

                return new Response(
                    JSON.stringify(tokenData),
                    {
                        headers: {
                            ...corsHeaders,
                            'Content-Type': 'application/json',
                        },
                    }
                );
            } catch (err) {
                return new Response(
                    JSON.stringify({ error: 'Token exchange failed', message: err.message }),
                    { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                );
            }
        }

        return new Response('GitHub OAuth Proxy - Aashma Bidari Admin', {
            headers: corsHeaders,
        });
    },
};
