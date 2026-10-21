import { defineConfig } from "cf/config";
import * as entrypoint from "./src/index.ts" with { type: "cf-worker" };

// One API Worker per mode: `--mode staging` deploys lucid-hire-api-staging, builds default to production.
// The API has no public URL; the web Worker reaches it through a service binding.
export default defineConfig(({ mode }) => {
	const staging = mode === "staging";
	return {
		worker: {
			name: staging ? "lucid-hire-api-staging" : "lucid-hire-api",
			compatibilityDate: "2026-10-19",
			entrypoint,
			observability: { enabled: true },
			workersDev: false,
			previewUrls: false,
		},
	};
});
