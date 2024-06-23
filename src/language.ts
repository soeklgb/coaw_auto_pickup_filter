import ja from "./language/ja.json" with { type: "json" };
import en from "./language/en.json" with { type: "json" };

type Language = "ja" | "krai" | string;

function language(): Language | undefined {
  return tWgm?.tGameOption?.getDataValue("language");
}

function getText(id: string): string {
  let text = undefined;

  switch (language()) {
    case "ja":
      text = (ja as Record<string, string>)[id];
      break;
    case "krai":
      text = (en as Record<string, string>)[id];
      break;
    default:
      text = (en as Record<string, string>)[id];
      break;
  }

  if (text === undefined || text === "") {
    return id;
  } else {
    return text;
  }
}

export { getText, language };
