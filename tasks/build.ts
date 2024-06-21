import { denoPlugins } from "@luca/esbuild-deno-loader";
import * as fs from "@std/fs";
import * as path from "@std/path";
import * as esbuild from "esbuild";
import { compress } from "zip";
import config from "./mod_config.json" with { type: "json" };
import { copyAssets } from "./copy_assets.ts";

const tempPath = await Deno.makeTempDir();
const modPath = `${tempPath}/${config.name}`;
const zipPath = `./dist/${config.name}-${config.version}.zip`;

await fs.emptyDir("./dist");

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
await esbuild.stop();

await copyAssets(modPath);

await compress(modPath, zipPath);

await Deno.remove(tempPath, { recursive: true });
