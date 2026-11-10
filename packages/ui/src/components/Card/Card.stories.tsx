import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../Badge/Badge";
import { Button } from "../Button/Button";
import { Card, CardBody, CardFooter, CardMedia } from "./Card";

const meta = { title: "Components/Card", component: Card } satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OfferTile: Story = {
    render: () => (
        <Card className="max-w-sm">
            <CardMedia>
                <img
                    className="size-full object-cover"
                    src="https://picsum.photos/seed/dertour/800/600"
                    alt="Hotel pool"
                />
            </CardMedia>
            <CardBody>
                <Badge>Half board</Badge>
                <h3 className="text-lg font-semibold">Hotel Playa Azul</h3>
                <p className="text-text-muted text-sm">Mallorca, Spain · 7 nights</p>
            </CardBody>
            <CardFooter>
                <strong className="text-brand text-xl">from 1.299 €</strong>
                <Button size="sm">Details</Button>
            </CardFooter>
        </Card>
    ),
};
