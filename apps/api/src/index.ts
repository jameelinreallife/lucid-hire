// Placeholder until the Hono app lands.
export default {
	fetch(request) {
		const { pathname } = new URL(request.url);
		if (pathname === "/api/health") return Response.json({ ok: true, service: "api" });
		return Response.json({ error: "not_found" }, { status: 404 });
	},
} satisfies ExportedHandler;
