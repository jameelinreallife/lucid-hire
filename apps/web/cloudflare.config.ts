import { bindings, defineConfig } from "cf/config";
import * as entrypoint from "./worker/index.ts" with { type: "cf-worker" };

// One web Worker per mode: `--mode staging` deploys lucid-hire-web-staging on staging.lucidhire.io.
// Static assets are served without running Worker code; only /api/* reaches the Worker, which forwards it to the API.
export default defineConfig(({ mode }) => {
	const staging = mode === "staging";
	return {
		worker: {
			name: staging ? "lucid-hire-web-staging" : "lucid-hire-web",
			compatibilityDate: "2026-10-19",
			entrypoint,
			observability: { enabled: true },
			assets: {
				notFoundHandling: "single-page-application",
				runWorkerFirst: ["/api/*"],
			},
			env: {
				ASSETS: bindings.assets(),
				API: bindings.worker({ worker: staging ? "lucid-hire-api-staging" : "lucid-hire-api" }),
			},
			domains: staging ? ["staging.lucidhire.io"] : [],
			previewUrls: false,
		},
	};
});
