import { getPageTags } from "@/controllers/webpages";
import { describe, expect, test } from "@jest/globals";

describe("autofill module", () => {
  test("test fetch tags", async () => {
    const tagList = await getPageTags();
    expect(tagList.length).toBe(4);
  });
});
