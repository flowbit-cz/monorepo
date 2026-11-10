"use client";

import { useListDestinations } from "@dertour/api/offers/query";
import type { SelectOption } from "@dertour/ui";

/** Destinations as select options, loaded client-side with TanStack Query (cached for 1 hour). */
export function useDestinationOptions() {
    return useListDestinations<SelectOption[]>({
        query: {
            staleTime: 60 * 60 * 1000,
            select: (destinations) =>
                destinations.map((destination) => ({
                    value: destination.code,
                    label: `${destination.name} (${destination.country})`,
                })),
        },
    });
}
