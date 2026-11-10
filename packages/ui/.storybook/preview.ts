import type { Preview } from "@storybook/react-vite";
import "./preview.css";

const preview: Preview = {
    parameters: {
        layout: "padded",
        controls: { expanded: true },
        // Fail the a11y panel on violations (also used by the Storybook test runner).
        a11y: { test: "error" },
    },
};

export default preview;
