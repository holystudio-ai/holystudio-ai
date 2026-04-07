/**
 * SPA catch-all: serves index.html for any route that doesn't match
 * a static asset or an API function.
 * [[path]] is a Cloudflare Pages catch-all segment.
 */
export const onRequest: PagesFunction = async (context) => {
    // Serve the SPA index.html for all unmatched routes
    const url = new URL('/', context.request.url);
    return context.env.ASSETS.fetch(new Request(url, context.request));
};

