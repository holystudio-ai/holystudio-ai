export const onRequest: PagesFunction = async (context) => {
    const assetUrl = new URL("/promts_intensive", context.request.url);
    return context.env.ASSETS.fetch(new Request(assetUrl, context.request));
};
