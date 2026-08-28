const SITE_URL = 'https://holystudio.ai';

interface LinkPreview {
    image: string;
    title: string;
    description: string;
    /** Real pixel size of `image`. Omitted rather than guessed — a wrong value
     *  makes messengers reserve the wrong box and crop the preview. */
    width?: string;
    height?: string;
}

/**
 * Messengers and crawlers don't execute JavaScript, so the <Seo> component that
 * rewrites these tags in the browser is invisible to them: every link shared out
 * of the SPA shows whatever sits in the static index.html. Paths listed here get
 * their tags swapped in the HTML itself, on the way out.
 */
const APPLY_PREVIEW: LinkPreview = {
    // ?v is a cache-buster: messengers keep preview images keyed by URL, so
    // replacing the file in place leaves them showing the old one forever.
    // Bump the number whenever the file behind this name changes.
    image: `${SITE_URL}/new-link-img.PNG?v=2`,
    title: 'Анкета передзапису | HOLYSTUDIO',
    description:
        'Анкета передзапису на навчання з ШІ генерацій від HOLYSTUDIO. ' +
        'Навчись створювати рекламні відео кінематографічної якості.',
    width: '1774',
    height: '887',
};

const LINK_PREVIEWS: Record<string, LinkPreview> = {
    '/apply': APPLY_PREVIEW,
    // Short version of the same form; shared under the same preview.
    '/apply2': APPLY_PREVIEW,
};

class SetContent {
    constructor(private readonly value: string) {}

    element(element: Element) {
        element.setAttribute('content', this.value);
    }
}

class SetText {
    constructor(private readonly value: string) {}

    element(element: Element) {
        element.setInnerContent(this.value);
    }
}

class RemoveElement {
    element(element: Element) {
        element.remove();
    }
}

function applyLinkPreview(response: Response, preview: LinkPreview, canonicalUrl: string): Response {
    const size = (value?: string) => (value ? new SetContent(value) : new RemoveElement());

    return new HTMLRewriter()
        .on('title', new SetText(preview.title))
        .on('meta[name="description"]', new SetContent(preview.description))
        .on('meta[property="og:title"]', new SetContent(preview.title))
        .on('meta[property="og:description"]', new SetContent(preview.description))
        .on('meta[property="og:image"]', new SetContent(preview.image))
        .on('meta[property="og:image:width"]', size(preview.width))
        .on('meta[property="og:image:height"]', size(preview.height))
        .on('meta[property="og:url"]', new SetContent(canonicalUrl))
        .on('link[rel="canonical"]', {
            element(element) {
                element.setAttribute('href', canonicalUrl);
            },
        })
        .on('meta[name="twitter:title"]', new SetContent(preview.title))
        .on('meta[name="twitter:description"]', new SetContent(preview.description))
        .on('meta[name="twitter:image"]', new SetContent(preview.image))
        .transform(response);
}

export const onRequest: PagesFunction = async (context) => {
    const { pathname } = new URL(context.request.url);

    // Short URLs for the student guide. A React bounce would load the whole SPA
    // first, then jump to a 6.5MB HTML file — that looks like an infinite blink.
    // 302 here never touches the big file inside the Worker.
    const guideAliases = new Set([
        '/guide',
        '/guide/',
        '/holystudio-ai-director-guide',
        '/holystudio-ai-director-guide/',
    ]);
    if (guideAliases.has(pathname)) {
        return Response.redirect(new URL('/holystudio-ai-director-guide.html', context.request.url), 302);
    }

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
    const response = await context.env.ASSETS.fetch(new Request(assetUrl, context.request));

    const route = pathname.replace(/\/+$/, '') || '/';
    const preview = LINK_PREVIEWS[route];
    if (!preview) {
        return response;
    }

    return applyLinkPreview(response, preview, `${SITE_URL}${route}`);
};
