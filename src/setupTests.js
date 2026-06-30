import { vi, beforeAll, afterAll, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { server } from "./test/msw/server";

beforeAll(() => {
    server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
    server.resetHandlers();
    cleanup();
    vi.useRealTimers();
});

afterAll(() => {
    server.close();
});
