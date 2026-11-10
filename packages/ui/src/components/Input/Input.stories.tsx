import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./Input";

const meta = {
    title: "Components/Input",
    component: Input,
    args: { label: "Destination", placeholder: "e.g. Mallorca" },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithHint: Story = { args: { hint: "City, region or hotel" } };
export const WithError: Story = { args: { error: "Required" } };
export const Date: Story = { args: { label: "Departure", type: "date" } };
