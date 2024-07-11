/*
	On recommendation from @valentine195.
	Config based on @jdanielmourao's Sanctum theme esbuild setup.
	(https://github.com/jdanielmourao/obsidian-sanctum)
	Further based on https://github.com/damiankorcz/Prism-Theme/blob/main/esbuild.config.mjs
	Updated to Esbuild 17 by @Sigrunixia

	Usage:

	Dev build
	$ node esbuild.config.mjs

	Prod build
	$ node esbuild.config.mjs production

	Dev build for one system only (pf2e or bnb):
	$ node esbuild.config.mjs <system>

	Dev build for one system only (pf2e or bnb), output to outfile:
	$ node esbuild.config.mjs <system> <outfile>
*/

import * as esbuild from "esbuild";
import { config } from "dotenv";
import { sassPlugin } from "esbuild-sass-plugin";
import time from 'esbuild-plugin-time';

config();

const dir = "./";

const isProd = process.argv[2] === "production";
// The systems that will be built. By default and in prod, build all. The values here correspond to the
// keys of the systemConfig object below.
const systems = (isProd || !process.argv[2]) ? ["pf2e", "bnb"] : [process.argv[2]];
// The output file. Ignored in production.
const devFile = process.argv[3];

// The specific system config set here will overwrite the default config entries
// set below.
const systemConfig = {
	// PF2E
	pf2e: {
		// Entry point should be where everything is imported into.
		entryPoints: ["pf2e-index.scss"],
		// Path for final file
		outfile: isProd ? `${dir}/Basic-Pathfinder-2e-Layout.css` : (devFile || `${dir}/Basic-Pathfinder-2e-Layout-DEV.css`),
	},
	// BNB Bestiary
	bnb: {
		minify: true,
		// Entry point should be where everything is imported into.
		entryPoints: ["bnb-index.scss"],
		// Path for final file
		outfile: isProd ? `${dir}/BnB-Layout.css` : (devFile || `${dir}/BnB-Layout-DEV.css`),
	}
}

async function build(systemConfig) {
	const config = {
		logLevel: "info",
		plugins: [
			sassPlugin({
				cache: true,
				charset: false,
				alertColor: true,
				alertAscii: true,
			}),
			time()
		],
		...systemConfig
	};

	if (isProd) {
		await esbuild.build(config);
	} else {
		const context = await esbuild.context(config)
		await context.rebuild();
		await context.watch();
	}
}

// Build the files
for (var system of systems) {
	build(systemConfig[system]).catch(() => process.exit(1))
}