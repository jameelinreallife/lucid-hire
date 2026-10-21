import { describe, expect, it, vi } from "vitest";
import { createApp } from "./app.ts";

const UUID_PATTERN =
	/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe("createApp", () => {
	it("serves the health check", async () => {
		const app = createApp();
		const res = await app.request("/api/health");

		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			ok: true,
			service: "lucid-hire-api",
		});
		expect(res.headers.get("cache-control")).toBe("no-store");
	});

	it("returns a not-found error naming the method and path", async () => {
		const app = createApp();
		const res = await app.request("/api/whatever");

		expect(res.status).toBe(404);
		expect(await res.json()).toEqual({
			error: {
				code: "not_found",
				message: "No route for GET /api/whatever",
			},
		});
	});

	it("hides unexpected errors behind a generic 500", async () => {
		const app = createApp();
		app.get("/boom", () => {
			throw new Error("secret detail");
		});
		const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		try {
			const res = await app.request("/api/boom", {
				headers: { "x-request-id": "boom-request-1" },
			});
			const body = await res.json();

			expect(res.status).toBe(500);
			expect(body).toEqual({
				error: { code: "internal_error", message: "Something went wrong" },
			});
			expect(JSON.stringify(body)).not.toContain("secret detail");
			expect(res.headers.get("x-request-id")).toBe("boom-request-1");
			expect(errorSpy).toHaveBeenCalledWith(
				expect.stringContaining("boom-request-1"),
				expect.any(Error),
			);
		} finally {
			errorSpy.mockRestore();
		}
	});

	it("echoes a valid incoming request id", async () => {
		const app = createApp();
		const res = await app.request("/api/health", {
			headers: { "x-request-id": "req-abc-123" },
		});

		expect(res.headers.get("x-request-id")).toBe("req-abc-123");
	});

	it.each(["a".repeat(200), "not a valid id"])(
		"replaces an invalid incoming request id (%s)",
		async (incoming) => {
			const app = createApp();
			const res = await app.request("/api/health", {
				headers: { "x-request-id": incoming },
			});

			expect(res.headers.get("x-request-id")).toMatch(UUID_PATTERN);
		},
	);

	it("uses the cf-ray header when no valid request id is sent", async () => {
		const app = createApp();
		const res = await app.request("/api/health", {
			headers: { "cf-ray": "8f2c9e3f1a2b3c4d-SJC" },
		});

		expect(res.headers.get("x-request-id")).toBe("8f2c9e3f1a2b3c4d-SJC");
	});

	it("generates a UUID when no id headers are sent", async () => {
		const app = createApp();
		const res = await app.request("/api/health");

		expect(res.headers.get("x-request-id")).toMatch(UUID_PATTERN);
	});
});
