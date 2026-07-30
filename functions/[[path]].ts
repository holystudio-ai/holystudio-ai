export const onRequest: PagesFunction = async (context) => {
    const { pathname } = new URL(context.request.url);

    const hasFileExtension = /\.[^/]+$/.test(pathname);
    const isStaticAssetRequest =
        pathname === '/promts_intensive' ||
        pathname === '/promts_intensive/' ||
        hasFileExtension;

    if (isStaticAssetRequest) {
        const response = await context.next();

        // Pages' SPA fallback serves index.html (200) for missing files, and
        // _headers then stamps it with a 1-year immutable Cache-Control when
        // the URL matches /assets/*. During a deploy that lets Cloudflare's
        // edge cache HTML under a .js URL for a year ("Failed to load module
        // script… MIME type of text/html" → black screen). Return a real,
        // uncacheable 404 instead so nothing poisonous ever enters the cache.
        if (
            hasFileExtension &&
            !pathname.endsWith('.html') &&
            response.headers.get('content-type')?.includes('text/html')
        ) {
            return new Response('Not found', {
                status: 404,
                headers: { 'cache-control': 'no-store' },
            });
        }

        return response;
    }

    const assetUrl = new URL('/', context.request.url);
    return context.env.ASSETS.fetch(new Request(assetUrl, context.request));
};