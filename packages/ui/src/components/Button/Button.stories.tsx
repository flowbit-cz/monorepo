import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta = {
    title: "Components/Button",
    component: Button,
    args: { children: "Search holidays" },
    argTypes: {
        variant: { control: "select", options: ["primary", "accent", "secondary", "ghost", "danger"] },
        size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Accent: Story = { args: { variant: "accent" } };
export const Secondary: Story = { args: { variant: "secondary" } };
export const Ghost: Story = { args: { variant: "ghost" } };
export const Loading: Story = { args: { loading: true, children: "Saving" } };
export const FullWidth: Story = { args: { fullWidth: true } };
