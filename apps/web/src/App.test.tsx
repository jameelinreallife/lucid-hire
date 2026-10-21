import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App.tsx";

describe("App placeholder page", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("the heading renders with both lines", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockReturnValue(new Promise(() => {})),
    );

    render(<App />);

    const heading = screen.getByTestId("hero-heading");
    expect(heading).toBeTruthy();
    expect(heading.tagName.toLowerCase()).toBe("h1");
    expect(heading.textContent).toContain("We read every CV.");
    expect(heading.textContent).toContain("You meet the best ones.");
  });

  it("the status becomes online when fetch resolves { ok: true } with status 200", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ ok: true }),
      }),
    );

    render(<App />);

    const status = screen.getByTestId("api-status");
    expect(status.getAttribute("data-state")).toBe("checking");
    expect(status.getAttribute("role")).toBe("status");

    await waitFor(() => {
      expect(status.getAttribute("data-state")).toBe("online");
    });

    expect(status.textContent).toContain("API online");
  });

  it("it becomes offline when fetch rejects", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network failed")),
    );

    render(<App />);

    const status = screen.getByTestId("api-status");
    expect(status.getAttribute("data-state")).toBe("checking");

    await waitFor(() => {
      expect(status.getAttribute("data-state")).toBe("offline");
    });

    expect(status.textContent).toContain("API unreachable");
  });

  it("it becomes offline on a 500", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ ok: false }),
      }),
    );

    render(<App />);

    const status = screen.getByTestId("api-status");
    expect(status.getAttribute("data-state")).toBe("checking");

    await waitFor(() => {
      expect(status.getAttribute("data-state")).toBe("offline");
    });

    expect(status.textContent).toContain("API unreachable");
  });
});
