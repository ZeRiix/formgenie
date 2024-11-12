import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolver from "@rollup/plugin-node-resolve";

export default defineConfig({
	input: "scripts/index.ts",
	output: [
		{
			file: ".build/index.cjs",
			format: "cjs",
		},
		{
			file: ".build/index.mjs",
			format: "esm",
		},
	],
	plugins: [
		peerDepsExternal(),
		resolver(),
		typescript({
			tsconfig: "tsconfig.json",
			include: /\.[jt]sx?$/,
			exclude: /node_modules/,
		}),
	],
	external: ["zod", "react", "react/jsx-runtime"],
});
