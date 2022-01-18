const c = [
	() => import("../../../src/routes/__layout.svelte"),
	() => import("../components/error.svelte"),
	() => import("../../../src/routes/index.svelte"),
	() => import("../../../src/routes/about.svelte"),
	() => import("../../../src/routes/posts/__layout.reset.svelte"),
	() => import("../../../src/routes/posts/index.svelte"),
	() => import("../../../src/routes/posts/about.svelte"),
	() => import("../../../src/routes/posts/[slug].svelte"),
	() => import("../../../src/routes/posts/[...rest].svelte")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/index.svelte
	[/^\/$/, [c[0], c[2]], [c[1]]],

	,

	// src/routes/about.svelte
	[/^\/about\/?$/, [c[0], c[3]], [c[1]]],

	// src/routes/posts/index.svelte
	[/^\/posts\/?$/, [c[4], c[5]], []],

	// src/routes/posts/about.svelte
	[/^\/posts\/about\/?$/, [c[4], c[6]], []],

	// src/routes/posts/[slug].svelte
	[/^\/posts\/([^/]+?)\/?$/, [c[4], c[7]], [], (m) => ({ slug: d(m[1])})],

	// src/routes/posts/[...rest].svelte
	[/^\/posts(?:\/(.*))?\/?$/, [c[4], c[8]], [], (m) => ({ rest: d(m[1] || '')})]
];

// we import the root layout/error components eagerly, so that
// connectivity errors after initialisation don't nuke the app
export const fallback = [c[0](), c[1]()];