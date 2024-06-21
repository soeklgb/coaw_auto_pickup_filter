import { denoPlugins } from "@luca/esbuild-deno-loader";
import * as fs from "@std/fs";
import * as path from "@std/path";
import * as esbuild from "esbuild";
import config from "./mod_config.json" with { type: "json" };
import { copyAssets } from "./copy_assets.ts";

const steamPath = "C:/Program Files (x86)/Steam";
const gamePath = `${steamPath}/steamapps/common/isekainosouzousha`;
const modsPath = `${gamePath}/game/js/mod/mods`;
const modPath = `${modsPath}/${config.name}`;

if (!await fs.exists(gamePath)) {
  console.error(`Game path not found: ${gamePath}`);
  Deno.exit(1);
}

await fs.emptyDir(modPath);

await esbuild.build({
  plugins: [...denoPlugins({
    configPath: path.resolve("./deno.jsonc"),
  })],
  entryPoints: ["./src/mod.ts"],
  bundle: true,
  minify: true,
  sourcemap: true,
  outfile: `${modPath}/init.js`,
});

await copyAssets(modPath);

await esbuild.stop();
