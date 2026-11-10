"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select } from "@dertour/ui";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "@/i18n/navigation";
import { useDestinationOptions } from "../queries";
import type { OfferSearch } from "../types/search";
import { toOfferSearchQuery } from "../utils";
import {
    offerFilterSchema,
    toFilterValues,
    toSearch,
    type FilterErrorKey,
    type OfferFilterValues,
} from "./OfferFilter.form";

const BOARD_TYPES = ["RO", "BB", "HB", "FB", "AI"] as const;
const SORTS = ["recommended", "priceAsc", "priceDesc"] as const;

/**
 * Search filter. The URL is the state: submitting navigates to `/offers?…` and the server
 * renders the new results, so filtered pages are shareable and work without JavaScript state.
 */
export function OfferFilter({ search }: { search: OfferSearch }) {
    const t = useTranslations("offers.filter");
    const tCommon = useTranslations("common");
    const tErrors = useTranslations("errors");
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const destinations = useDestinationOptions();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<OfferFilterValues>({ resolver: zodResolver(offerFilterSchema), defaultValues: toFilterValues(search) });

    const error = (key?: string) => (key ? tErrors(key as FilterErrorKey) : undefined);

    const navigate = (values: OfferFilterValues) => {
        const query = toOfferSearchQuery(toSearch(values));
        startTransition(() => router.push(query ? `/offers?${query}` : "/offers"));
    };

    return (
        <form
            aria-label={t("label")}
            noValidate
            onSubmit={handleSubmit(navigate)}
            className="bg-surface-muted grid gap-4 rounded-lg p-4 sm:grid-cols-2 lg:grid-cols-6 lg:items-end"
        >
            <Select
                label={t("destination")}
                placeholder={destinations.isPending ? t("loadingDestinations") : t("anyDestination")}
                options={destinations.data ?? []}
                disabled={destinations.isPending}
                className="lg:col-span-2"
                {...register("destination")}
            />
            <Input
                type="date"
                label={t("dateFrom")}
                error={error(errors.dateFrom?.message)}
                {...register("dateFrom")}
            />
            <Input type="date" label={t("dateTo")} error={error(errors.dateTo?.message)} {...register("dateTo")} />
            <Input
                type="number"
                inputMode="numeric"
                min={1}
                label={t("adults")}
                error={error(errors.adults?.message)}
                {...register("adults", { valueAsNumber: true })}
            />
            <Select
                label={t("board")}
                placeholder={t("anyBoard")}
                options={BOARD_TYPES.map((board) => ({ value: board, label: tCommon(`board.${board}`) }))}
                {...register("board")}
            />
            <Select
                label={t("sort")}
                options={SORTS.map((sort) => ({ value: sort, label: t(`sortOptions.${sort}`) }))}
                className="lg:col-span-2"
                {...register("sort")}
            />
            <div className="flex gap-2 sm:col-span-2 lg:col-span-4 lg:justify-end">
                <Button
                    variant="ghost"
                    onClick={() => {
                        reset(toFilterValues({ adults: 2, sort: "recommended", page: 1 }));
                        startTransition(() => router.push("/offers"));
                    }}
                >
                    {tCommon("actions.reset")}
                </Button>
                <Button type="submit" variant="accent" loading={pending}>
                    {tCommon("actions.search")}
                </Button>
            </div>
        </form>
    );
}
