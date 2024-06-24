import { language } from "./language.ts";

function extractSkillNameFromSkillBookName(name: string): string | undefined {
  switch (language()) {
    case "ja":
      return extractSkillNameFromSkillBookName_ja(name);
    case "krai":
      return extractSkillNameFromSkillBookName_en(name);
    default:
      return undefined;
  }
}

function extractSkillNameFromSkillBookName_ja(
  name: string,
): string | undefined {
  const result = /(.+)のスキル書$/.exec(name);
  if (result === null) return undefined;
  return result[1];
}

function extractSkillNameFromSkillBookName_en(
  name: string,
): string | undefined {
  const result = /(.+) Skill Book$/.exec(name);
  if (result === null) return undefined;
  return result[1];
}

export {
  extractSkillNameFromSkillBookName,
  extractSkillNameFromSkillBookName_en,
  extractSkillNameFromSkillBookName_ja,
};
