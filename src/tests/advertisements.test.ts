import { updateAdvertisementContent } from "@/controllers/advertisements";
import { db } from "@/db/db";
import { advertisementTable } from "@/db/schema";
import { describe, expect, test } from "@jest/globals";
import { eq } from "drizzle-orm";

const ADVERTISER_ID = 2;

describe("advertisement module", () => {
  test("advertiser updating advertisement content", async () => {
    const mockAdvertisementID = 4;
    const [originalAdvertisement] = await db
      .select({ content: advertisementTable.content })
      .from(advertisementTable)
      .where(eq(advertisementTable.id, mockAdvertisementID))
      .limit(1);
    const { statusCode, msg } = await updateAdvertisementContent(
      ADVERTISER_ID,
      mockAdvertisementID,
      "hello world",
    );
    expect(statusCode).toBe(200);
    expect(msg).toBe("Successful");
    await db
      .update(advertisementTable)
      .set({
        content: originalAdvertisement.content,
      })
      .where(eq(advertisementTable.id, mockAdvertisementID));
  });
});
