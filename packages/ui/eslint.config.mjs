import { reactConfig } from "@dertour/eslint-config/react";
import { layerRules } from "@dertour/eslint-config/boundaries";

export default [...reactConfig({ ignores: ["!.storybook"] }), { files: ["src/**"], rules: layerRules("ui") }];
