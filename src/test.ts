import { assertEquals } from "@std/assert";
import * as parser from "./parser.ts";
import {
  extractSkillNameFromSkillBookName_en,
  extractSkillNameFromSkillBookName_ja,
} from "./utils.ts";
import * as _maginai_game_types from "maginai-game-types";

Deno.test({
  name: "extractSkillNameFromSkillBookName_ja",
  fn: () => {
    // string
    assertEquals(
      extractSkillNameFromSkillBookName_ja("Aのスキル書"),
      "A",
    );
    assertEquals(
      extractSkillNameFromSkillBookName_ja("Abcのスキル書"),
      "Abc",
    );

    // undefined
    assertEquals(
      extractSkillNameFromSkillBookName_ja("Bのスキル書(Lv1.2)"),
      undefined,
    );
    assertEquals(
      extractSkillNameFromSkillBookName_ja("C"),
      undefined,
    );
    assertEquals(
      extractSkillNameFromSkillBookName_ja("のスキル書"),
      undefined,
    );
  },
});

Deno.test({
  name: "extractSkillNameFromSkillBookName_en",
  fn: () => {
    // string
    assertEquals(
      extractSkillNameFromSkillBookName_en("A Skill Book"),
      "A",
    );
    assertEquals(
      extractSkillNameFromSkillBookName_en("Abc Skill Book"),
      "Abc",
    );

    // undefined
    assertEquals(
      extractSkillNameFromSkillBookName_en("B Skill Book (Lv1.2)"),
      undefined,
    );
    assertEquals(
      extractSkillNameFromSkillBookName_en("C"),
      undefined,
    );
    assertEquals(
      extractSkillNameFromSkillBookName_en("Skill Book"),
      undefined,
    );
  },
});

Deno.test({
  name: "parser.parse",
  fn: () => {
    assertEquals(
      parser.parse(`
# CommentA
# CommentB
# CommentC
`),
      [
        { prefix: "#", value: "CommentA" },
        { prefix: "#", value: "CommentB" },
        { prefix: "#", value: "CommentC" },
      ],
    );
    assertEquals(
      parser.parse(`

# CommentA

# CommentB

# CommentC

`),
      [
        { prefix: "#", value: "CommentA" },
        { prefix: "#", value: "CommentB" },
        { prefix: "#", value: "CommentC" },
      ],
    );
    assertEquals(
      parser.parse(`
- ValueA
- ValueB
- ValueC
`),
      [
        { prefix: "-", value: "ValueA" },
        { prefix: "-", value: "ValueB" },
        { prefix: "-", value: "ValueC" },
      ],
    );
    assertEquals(
      parser.parse(`
0 ValueA
1 ValueB
123 ValueC
`),
      [
        { prefix: 0, value: "ValueA" },
        { prefix: 1, value: "ValueB" },
        { prefix: 123, value: "ValueC" },
      ],
    );
    assertEquals(
      parser.parse(`
# Comment
- ValueA
0 ValueB
`),
      [
        { prefix: "#", value: "Comment" },
        { prefix: "-", value: "ValueA" },
        { prefix: 0, value: "ValueB" },
      ],
    );
  },
});

Deno.test({
  name: "parser.parseLine - Comment",
  fn: () => {
    assertEquals(
      parser.parseLine("#    Comment"),
      { prefix: "#", value: "Comment" },
    );
    assertEquals(
      parser.parseLine("#Comment"),
      { prefix: "#", value: "Comment" },
    );
    assertEquals(
      parser.parseLine("    #Comment"),
      { prefix: "#", value: "Comment" },
    );
  },
});

Deno.test({
  name: "parser.parseLine - set",
  fn: () => {
    assertEquals(
      parser.parseLine("0    Item"),
      { prefix: 0, value: "Item" },
    );
    assertEquals(
      parser.parseLine("0Item"),
      { prefix: 0, value: "Item" },
    );
    assertEquals(
      parser.parseLine("    0Item"),
      { prefix: 0, value: "Item" },
    );
    assertEquals(
      parser.parseLine("123    Item"),
      { prefix: 123, value: "Item" },
    );
    assertEquals(
      parser.parseLine("123Item"),
      { prefix: 123, value: "Item" },
    );
    assertEquals(
      parser.parseLine("    123Item"),
      { prefix: 123, value: "Item" },
    );
  },
});

Deno.test({
  name: "parser.parseLine - reset",
  fn: () => {
    assertEquals(
      parser.parseLine("-    Item"),
      { prefix: "-", value: "Item" },
    );
    assertEquals(
      parser.parseLine("-Item"),
      { prefix: "-", value: "Item" },
    );
    assertEquals(
      parser.parseLine("    -Item"),
      { prefix: "-", value: "Item" },
    );
  },
});

Deno.test({
  name: "parser.parseLine - undefined",
  fn: () => {
    assertEquals(
      parser.parseLine("A # Comment"),
      undefined,
    );
    assertEquals(
      parser.parseLine("B - Item"),
      undefined,
    );
    assertEquals(
      parser.parseLine("C 0 Item"),
      undefined,
    );
    assertEquals(
      parser.parseLine("D123 Item"),
      undefined,
    );
  },
});
