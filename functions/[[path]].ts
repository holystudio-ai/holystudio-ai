export const onRequest: PagesFunction = async (context) => {
    const { pathname } = new URL(context.request.url);

    const isStaticAssetRequest =
        pathname === '/promts_intensive' ||
        pathname === '/promts_intensive/' ||
        pathname.startsWith('/assets/') ||
        pathname.startsWith('/fonts/') ||
        /\.[^/]+$/.test(pathname);

    if (isStaticAssetRequest) {
        return context.next();
    }

    const assetUrl = new URL('/', context.request.url);
    return context.env.ASSETS.fetch(new Request(assetUrl, context.request));
};