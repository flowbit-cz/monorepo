import { handlers } from "@dertour/api/mocks";
import { screen, waitFor } from "@dertour/testing";
import { setupMswServer } from "@dertour/testing/msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderApp } from "@/test/render";
import { OfferFilter } from "./OfferFilter";

const push = vi.fn();
vi.mock("@/i18n/navigation", () => ({ useRouter: () => ({ push }) }));

setupMswServer(handlers);
beforeEach(() => push.mockReset());

const search = { adults: 2, sort: "recommended", page: 1 } as const;

describe("OfferFilter", () => {
    it("loads destinations from the API", async () => {
        renderApp(<OfferFilter search={search} />);
        const destination = screen.getByLabelText("Reiseziel");
        expect(destination).toBeDisabled();
        await waitFor(() => expect(destination).toBeEnabled());
        expect(screen.getByRole("option", { name: "Mallorca (Spain)" })).toBeInTheDocument();
    });

    it("navigates to the filtered URL on submit", async () => {
        const { user } = renderApp(<OfferFilter search={search} />);
        await waitFor(() => expect(screen.getByLabelText("Reiseziel")).toBeEnabled());
        await user.selectOptions(screen.getByLabelText("Reiseziel"), "PMI");
        await user.selectOptions(screen.getByLabelText("Verpflegung"), "All inclusive");
        await user.click(screen.getByRole("button", { name: "Suchen" }));
        await waitFor(() => expect(push).toHaveBeenCalledWith("/offers?board=AI&destination=PMI"));
    });

    it("shows translated validation errors and doesn't navigate", async () => {
        const { user } = renderApp(<OfferFilter search={{ ...search, dateFrom: "2027-07-08" }} />);
        await user.type(screen.getByLabelText("Rückreise bis"), "2027-07-01");
        await user.click(screen.getByRole("button", { name: "Suchen" }));
        expect(await screen.findByText("Das Rückreisedatum muss nach dem Hinreisedatum liegen")).toBeInTheDocument();
        expect(screen.getByLabelText("Rückreise bis")).toBeInvalid();
        expect(push).not.toHaveBeenCalled();
    });

    it("resets to the unfiltered listing", async () => {
        const { user } = renderApp(<OfferFilter search={{ ...search, board: "HB" }} />);
        expect(screen.getByLabelText("Verpflegung")).toHaveValue("HB");
        await user.click(screen.getByRole("button", { name: "Zurücksetzen" }));
        expect(push).toHaveBeenCalledWith("/offers");
        expect(screen.getByLabelText("Verpflegung")).toHaveValue("");
    });
});
