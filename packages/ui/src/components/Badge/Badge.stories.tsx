import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";

const meta = {
    title: "Components/Badge",
    component: Badge,
    args: { children: "All inclusive" },
    argTypes: { tone: { control: "select", options: ["neutral", "brand", "accent", "success", "warning"] } },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};
export const Accent: Story = { args: { tone: "accent", children: "Last minute" } };
