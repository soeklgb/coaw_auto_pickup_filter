type SkillNameToIdMap = Map<string, string[]>;

function createSkillNameToIdMap(): SkillNameToIdMap | undefined {
  if (tWgm.version === undefined) return undefined;

  const map = new Map<string, string[]>();
  const askills = tWgm.tGameSkillAction.askillData.askills;

  for (const skillId in askills) {
    const skill = askills[skillId];
    const pickupIds = map.get(skill[0]) ?? [];
    pickupIds.push("140001:" + skillId);
    map.set(skill[0], pickupIds);
  }

  return map;
}

export { createSkillNameToIdMap };
export type { SkillNameToIdMap };
