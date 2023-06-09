/*
	On recommendation from @valentine195.
	Config based on @jdanielmourao's Sanctum theme esbuild setup.
	(https://github.com/jdanielmourao/obsidian-sanctum)
	Further based on https://github.com/damiankorcz/Prism-Theme/blob/main/esbuild.config.mjs
	Updated to Esbuild 17 by @Sigrunixia
*/

import * as esbuild from "esbuild";
import { config } from "dotenv";
import { sassPlugin } from "esbuild-sass-plugin";
import time from 'esbuild-plugin-time';

config();

const prod = process.argv[2] === "production";
const dir = "./";

/** Paths for final file */
/** PF2E */
const pf2efileProd = `${dir}/Basic-Pathfinder-2e-Layout.css`;
const pf2efileDev = `${dir}/Basic-Pathfinder-2e-Layout-DEV.css`;

const buildPF2E = async () => {
	const context = await esbuild.build({
		/** Entry point should be where everything is imported into. */
		entryPoints: ["pf2e-index.scss"],
		logLevel: "info",
		outfile: prod ? pf2efileProd : pf2efileDev,
		// minify: true,
		plugins: [
			sassPlugin({
				cache: true,
				charset: false,
				alertColor: true,
				alertAscii: true,
			}),
			time()
		]
	});

	// Enable watch mode
	if (!prod) {
		await context.rebuild();
		await context.watch();
	}
};

/** BNB Bestiary */
const bnbfileProd = `${dir}/BnB-Layout.css`;
const bnbfileDev = `${dir}/BnB-Layout-DEV.css`;

const buildBNB = async () => {
	const context = await esbuild.build({
		/** Entry point should be where everything is imported into. */
		entryPoints: ["bnb-index.scss"],
		logLevel: "info",
		outfile: prod ? bnbfileProd : bnbfileDev,
		minify: true,
		plugins: [
			sassPlugin({
				cache: true,
				charset: false,
				alertColor: true,
				alertAscii: true,
			}),
			time()
		]
	});

	// Enable watch mode
	if (!prod) {
		await context.rebuild();
		await context.watch();
	}
};

// Call the build functions
buildPF2E().catch(() => process.exit(1));
buildBNB().catch(() => process.exit(1));
