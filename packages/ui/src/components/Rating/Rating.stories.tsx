import type { Meta, StoryObj } from "@storybook/react-vite";
import { Rating } from "./Rating";

const meta = { title: "Components/Rating", component: Rating, args: { value: 4, label: "4 stars" } } satisfies Meta<
    typeof Rating
>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FourStars: Story = {};
export const FiveStars: Story = { args: { value: 5, label: "5 stars" } };
