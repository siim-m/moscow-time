const c = [
	() => import("../../src/routes/__layout.svelte"),
	() => import("../runtime/components/error.svelte"),
	() => import("../../src/routes/index.svelte"),
	() => import("../../src/routes/widget-instructions.svelte"),
	() => import("../../src/routes/widget.html.svelte"),
	() => import("../../src/routes/view/__layout.reset.svelte"),
	() => import("../../src/routes/view/[view].svelte")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/index.svelte
	[/^\/$/, [c[0], c[2]], [c[1]]],

	// src/routes/widget-instructions.svelte
	[/^\/widget-instructions\/?$/, [c[0], c[3]], [c[1]]],

	// src/routes/widget.html.svelte
	[/^\/widget\.html\/?$/, [c[0], c[4]], [c[1]]],

	// src/routes/view/[view].svelte
	[/^\/view\/([^/]+?)\/?$/, [c[5], c[6]], [], (m) => ({ view: d(m[1])})]
];

// we import the root layout/error components eagerly, so that
// connectivity errors after initialisation don't nuke the app
export const fallback = [c[0](), c[1]()];