export { matchers } from './client-matchers.js';

export const components = [
	() => import("../../src/routes/__layout.svelte"),
	() => import("../runtime/components/error.svelte"),
	() => import("../../src/routes/__layout-reset.svelte"),
	() => import("../../src/routes/index.svelte"),
	() => import("../../src/routes/view/[view]@reset.svelte"),
	() => import("../../src/routes/widget-instructions.svelte"),
	() => import("../../src/routes/widget.html.svelte")
];

export const dictionary = {
	"": [[0, 3], [1]],
	"widget-instructions": [[0, 5], [1]],
	"widget.html": [[0, 6], [1]],
	"view/[view]@reset": [[2, 4], [1]]
};