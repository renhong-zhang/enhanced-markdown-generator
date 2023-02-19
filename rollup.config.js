import {config, distPath, srcPath} from "./rollup-default.config";

export default {
	...config,
	input: `${srcPath}/index.ts`,
	output: [
		{
			file: `${distPath}/index.cjs.js`,
			format: "cjs",
			sourcemap: true,
		},
		{
			file: `${distPath}/index.esm.js`,
			format: "esm",
			sourcemap: true,
		}
	]
};