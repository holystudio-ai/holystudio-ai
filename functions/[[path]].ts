export const onRequest: PagesFunction = async (context) => {
    const { pathname } = new URL(context.request.url);

    const isStaticAssetRequest =
        pathname === '/promts_intensive' ||
        pathname === '/promts_intensive/' ||
        pathname.startsWith('/assets/') ||
        pathname.startsWith('/fonts/') ||
        /\.[^/]+$/.test(pathname);

    if (isStaticAssetRequest) {
        const response = await context.next();

        // Pages' SPA fallback serves index.html (200) for missing files. For
        // hashed assets that's fatal: the browser gets HTML where it expects a
        // JS module ("Failed to load module script… MIME type of text/html").
        // Return a real 404 so stale clients fail fast and recover by reload.
        if (
            (pathname.startsWith('/assets/') || pathname.startsWith('/fonts/')) &&
            response.headers.get('content-type')?.includes('text/html')
        ) {
            return new Response('Not found', { status: 404 });
        }

        return response;
    }

    const assetUrl = new URL('/', context.request.url);
    return context.env.ASSETS.fetch(new Request(assetUrl, context.request));
};