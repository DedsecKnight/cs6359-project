import { db } from "@/db/db";
import { credentialsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function updateUserCredentials(
  userId: number,
  username: string,
  password: string,
) {
  await db
    .update(credentialsTable)
    .set({
      username,
      password,
    })
    .where(eq(credentialsTable.id, userId));
  return { statusCode: 200, msg: "Successful" };
}

export async function deleteUserCredentials(userId: number) {
  await db.delete(credentialsTable).where(eq(credentialsTable.id, userId));
  return {
    statusCode: 200,
    msg: "Successful",
  };
}

export async function addUserCredentials(username: string, password: string) {
  await db.insert(credentialsTable).values({
    username,
    password,
  });
  return { statusCode: 200, msg: "Successful" };
}
