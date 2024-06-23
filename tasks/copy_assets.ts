async function copyAssets(modPath: string) {
  await Deno.copyFile("./README.md", `${modPath}/README.md`);
  await Deno.copyFile("./README_en.md", `${modPath}/README_en.md`);
}

export { copyAssets };
