import { configureApi } from "@dertour/api";
import { beforeEach } from "vitest";

// Every test talks to a fake backend host, answered by MSW (setupMswServer in the test file).
beforeEach(() => configureApi({ baseUrl: "https://api.test" }));
