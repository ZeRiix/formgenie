import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	test: {
		watch: false,
		globals: true,
		environment:  "jsdom",
		include: [
			"scripts/**/*.test.tsx", 
		],
		coverage: {
			provider: "istanbul",
			reporter: ["text", "json", "html", "json-summary"],
			reportsDirectory: "coverage",
			exclude: [
				".build", 
				"coverage",
				"*.js",
				"**/*.test.tsx"
			],
		},
	},
	plugins: [tsconfigPaths()],
});