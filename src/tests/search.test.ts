import { getSearchResult } from "@/controllers/search";
import { describe, expect, test } from "@jest/globals";

describe("search module", () => {
  test("test case sensitive search", async () => {
    const { searchResult } = await getSearchResult(
      ["ut", "dallas"],
      "or",
      1,
      "alphabet",
    );
    expect(searchResult.length).toBe(1);
    const { searchResult: searchResultDiffCase } = await getSearchResult(
      ["Ut", "DaLLaS"],
      "or",
      1,
      "alphabet",
    );
    expect(searchResultDiffCase.length).toBe(0);
  });
  test("test AND search", async () => {
    const { searchResult } = await getSearchResult(
      ["google"],
      "and",
      1,
      "alphabet",
    );
    expect(searchResult.length).toBe(1);
  });
  test("test OR search", async () => {
    const { searchResult } = await getSearchResult(
      ["google", "dallas"],
      "or",
      1,
      "alphabet",
    );
    expect(searchResult.length).toBe(2);
  });
  test("test NOT search", async () => {
    const { searchResult } = await getSearchResult(
      ["google", "dallas"],
      "not",
      1,
      "alphabet",
    );
    expect(searchResult.length).toBe(1);
  });
});
