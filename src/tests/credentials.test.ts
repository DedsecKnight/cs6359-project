import { updateUserCredentials } from "@/controllers/users";
import { db } from "@/db/db";
import { credentialsTable } from "@/db/schema";
import { describe, expect, test } from "@jest/globals";
import { eq } from "drizzle-orm";

describe("credentials module", () => {
  test("test admin updating username", async () => {
    const mockUserID = 1;
    const [mockUser] = await db
      .select()
      .from(credentialsTable)
      .where(eq(credentialsTable.id, mockUserID));
    const { statusCode, msg } = await updateUserCredentials(
      mockUserID,
      "randomusername",
      mockUser.password,
    );
    expect(statusCode).toBe(200);
    expect(msg).toBe("Successful");
    const [updatedUser] = await db
      .select({ username: credentialsTable.username })
      .from(credentialsTable)
      .where(eq(credentialsTable.id, mockUserID));
    expect(updatedUser.username).toBe("randomusername");
    await db
      .update(credentialsTable)
      .set({
        username: mockUser.username,
      })
      .where(eq(credentialsTable.id, mockUserID));
  });

  test("test admin updating password", async () => {
    const mockUserID = 1;
    const [mockUser] = await db
      .select()
      .from(credentialsTable)
      .where(eq(credentialsTable.id, mockUserID));
    const { statusCode, msg } = await updateUserCredentials(
      mockUserID,
      mockUser.username,
      "randompassword",
    );
    expect(statusCode).toBe(200);
    expect(msg).toBe("Successful");
    const [updatedUser] = await db
      .select({ password: credentialsTable.password })
      .from(credentialsTable)
      .where(eq(credentialsTable.id, mockUserID));
    expect(updatedUser.password).toBe("randompassword");
    await db
      .update(credentialsTable)
      .set({
        password: mockUser.password,
      })
      .where(eq(credentialsTable.id, mockUserID));
  });
});
