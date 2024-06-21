async function copyAssets(modPath: string) {
  await Deno.copyFile("./README.md", `${modPath}/README.md`);
}

export { copyAssets };
