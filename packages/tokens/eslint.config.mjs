import { baseConfig } from "@dertour/eslint-config/base";
import { layerRules } from "@dertour/eslint-config/boundaries";

export default [...baseConfig(), { files: ["src/**"], rules: layerRules("tokens") }];
