/**
 * SPA catch-all: serves index.html for any route that doesn't match
 * a static asset or an API function.
 * [[path]] is a Cloudflare Pages catch-all segment.
 */
export const onRequest: PagesFunction = async (context) => {
    const url = new URL(context.request.url);

    // Let static assets pass through (should be handled by _routes.json exclude,
    // but double-check here just in case)
    const path = url.pathname;
    if (
        path.startsWith('/assets/') ||
        path.startsWith('/fonts/') ||
        path.match(/\.(js|css|png|jpg|jpeg|webp|gif|svg|ico|woff2?|mp4|txt|xml|json|map)$/)
    ) {
        return context.env.ASSETS.fetch(context.request);
    }

    // Serve index.html for all SPA routes
    const assetUrl = new URL('/', context.request.url);
    return context.env.ASSETS.fetch(new Request(assetUrl, context.request));
};

