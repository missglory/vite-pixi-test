import {defineConfig} from "vite";
import {resolve} from "path";

// vite.config.js
export default defineConfig({
	// config options
	resolve: {
		alias: {
			'@interwoff': resolve(__dirname, 'src/interwoff.fnt'),
		}
	}
});