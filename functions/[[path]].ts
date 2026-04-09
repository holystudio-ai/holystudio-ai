export const onRequest: PagesFunction = async (context) => {
    const url = new URL(context.request.url);
    const path = url.pathname;

    if (
        path.startsWith('/assets/') ||
        path.startsWith('/fonts/') ||
        path.match(/\.(html|js|css|png|jpg|jpeg|webp|gif|svg|ico|woff2?|mp4|txt|xml|json|map)$/)
    ) {
        return context.env.ASSETS.fetch(context.request);
    }

    const assetUrl = new URL('/', context.request.url);
    return context.env.ASSETS.fetch(new Request(assetUrl, context.request));
};