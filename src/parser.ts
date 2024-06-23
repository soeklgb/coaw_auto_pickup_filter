interface PickupFilterRule {
  prefix: Prefix;
  value: string;
}

type Prefix = "#" | "-" | number;

function parse(data: string): PickupFilterRule[] {
  const rules = [];

  const lines = data.split("\n");
  for (const line of lines) {
    const rule = parseLine(line);
    if (rule === undefined) continue;
    rules.push(rule);
  }

  return rules;
}

function parseLine(line: string): PickupFilterRule | undefined {
  const prefix = (() => {
    const result = /^\s*([#|\-]|\d+)/.exec(line);
    if (result === null) return null;
    line = line.slice(result[0].length);
    const n = parseInt(result[1]);
    if (!isNaN(n)) {
      return n as Prefix;
    } else {
      return result[1] as Prefix;
    }
  })();

  if (prefix === null) return undefined;

  const value = line.trim();

  if (value === "") return undefined;

  return { prefix, value };
}

export { parse, parseLine };
export type { PickupFilterRule, Prefix };
