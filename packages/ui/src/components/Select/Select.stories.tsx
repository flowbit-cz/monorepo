import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "./Select";

const meta = {
    title: "Components/Select",
    component: Select,
    args: {
        label: "Destination",
        placeholder: "Any destination",
        options: [
            { value: "PMI", label: "Mallorca" },
            { value: "HER", label: "Crete" },
            { value: "AYT", label: "Antalya" },
        ],
    },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithError: Story = { args: { error: "Please choose a destination" } };
