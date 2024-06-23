import { language } from "./language.ts";

function isSkillBookNameWithoutLevel(name: string): boolean {
  switch (language()) {
    case "ja":
      return /.+のスキル書$/.test(name);
    case "krai":
      return /.+Skill Book$/.test(name);
    default:
      return false;
  }
}

function removeLevelFromSkillBookName(name: string): string | undefined {
  switch (language()) {
    case "ja": {
      const result = /(.+のスキル書)\(Lv\d+(\.\d)?\)$/.exec(name);
      if (result === null) return undefined;
      return result[1];
    }
    case "krai": {
      const result = /(.+Skill Book) \(Lv\d+(\.\d)?\)$/.exec(name);
      if (result === null) return undefined;
      return result[1];
    }
    default: {
      return undefined;
    }
  }
}

export { isSkillBookNameWithoutLevel, removeLevelFromSkillBookName };
