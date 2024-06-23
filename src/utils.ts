function isSkillBookNameWithoutLevel(name: string): boolean {
  return /.+のスキル書$/.test(name);
}

function removeLevelFromSkillBookName(name: string): string | undefined {
  const result = /(.+のスキル書)\(Lv\d+(\.\d)?\)$/.exec(name);
  if (result === null) return undefined;
  return result[1];
}

export { isSkillBookNameWithoutLevel, removeLevelFromSkillBookName };
