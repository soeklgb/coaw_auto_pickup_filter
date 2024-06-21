async function copyAssets(modPath: string) {
  await Deno.copyFile("./assets/README.md", `${modPath}/README.md`);
}

export { copyAssets };
