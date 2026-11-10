import { Spinner } from "@dertour/ui";
import { Suspense } from "react";
import { FeaturedOffers } from "./FeaturedOffers";
import { Hero } from "./Hero";

/** Homepage. The hero is static, and the offers stream in once the backend answers. */
export function HomePage({ locale }: { locale: string }) {
    return (
        <div className="flex flex-col gap-12">
            <Hero />
            <Suspense fallback={<Spinner className="self-center" />}>
                <FeaturedOffers locale={locale} />
            </Suspense>
        </div>
    );
}
