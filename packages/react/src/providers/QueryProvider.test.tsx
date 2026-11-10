import { useQueryClient } from "@tanstack/react-query";
import { screen } from "@dertour/testing";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getQueryClient, makeQueryClient, QueryProvider } from "./QueryProvider";

function StaleTime() {
    return <p>{String(useQueryClient().getDefaultOptions().queries?.staleTime)}</p>;
}

describe("QueryProvider", () => {
    it("provides the shared browser client", () => {
        render(
            <QueryProvider>
                <StaleTime />
            </QueryProvider>,
        );
        expect(screen.getByText("60000")).toBeInTheDocument();
    });

    it("reuses one client in the browser", () => {
        expect(getQueryClient()).toBe(getQueryClient());
        expect(makeQueryClient()).not.toBe(makeQueryClient());
    });
});
