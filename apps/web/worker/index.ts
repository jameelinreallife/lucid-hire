import { env } from "cloudflare:workers";

// Only /api/* reaches this Worker (assets.runWorkerFirst); everything else is served as static assets.
export default {
	fetch(request) {
		const { pathname } = new URL(request.url);
		if (pathname.startsWith("/api/")) return env.API.fetch(request);
		return env.ASSETS.fetch(request);
	},
} satisfies ExportedHandler;
