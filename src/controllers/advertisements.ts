import { db } from "@/db/db";
import {
  advertisementTable,
  advertiserTable,
  billingAccountTable,
  credentialsTable,
  transactionTable,
} from "@/db/schema";
import { eq } from "drizzle-orm";

export async function updateAdvertisementContent(
  userId: number,
  advertisementId: number,
  content: string,
) {
  const advertisement = await db
    .select({ id: credentialsTable.id })
    .from(advertisementTable)
    .where(eq(advertisementTable.id, advertisementId))
    .innerJoin(
      advertiserTable,
      eq(advertisementTable.advertiserId, advertiserTable.id),
    )
    .innerJoin(
      credentialsTable,
      eq(advertiserTable.credentialsId, credentialsTable.id),
    )
    .limit(1);
  if (advertisement.length === 0) {
    return { statusCode: 404, msg: "Advertisement not found" };
  }
  if (advertisement[0].id != userId) {
    return { statusCode: 403, msg: "unauthorized" };
  }
  await db
    .update(advertisementTable)
    .set({ content })
    .where(eq(advertisementTable.id, advertisementId));
  return { statusCode: 200, msg: "Successful" };
}

export async function deleteAdvertisement(
  userId: number,
  advertisementId: number,
) {
  const advertisement = await db
    .select({ id: credentialsTable.id })
    .from(advertisementTable)
    .where(eq(advertisementTable.id, advertisementId))
    .innerJoin(
      advertiserTable,
      eq(advertisementTable.advertiserId, advertiserTable.id),
    )
    .innerJoin(
      credentialsTable,
      eq(advertiserTable.credentialsId, credentialsTable.id),
    )
    .limit(1);
  if (advertisement.length === 0) {
    return { statusCode: 404, msg: "Advertisement not found" };
  }
  if (advertisement[0].id != userId) {
    return { statusCode: 403, msg: "unauthorized" };
  }
  await db
    .delete(advertisementTable)
    .where(eq(advertisementTable.id, advertisementId));
  return { statusCode: 200, msg: "Successful" };
}

export async function createNewAdvertisement(
  userId: number,
  advertisementContent: string,
  tierInfo: { id: number; tierName: string; tierPrice: number },
  cardInfo: { id: number; creditCardNumber: string },
) {
  const advertiser = await db
    .select({ id: advertiserTable.id })
    .from(advertiserTable)
    .where(eq(advertiserTable.credentialsId, userId))
    .limit(1);
  if (advertiser.length === 0) {
    return { statusCode: 400, msg: "bad request" };
  }
  // get billing account info
  const billingAccount = await db
    .select()
    .from(billingAccountTable)
    .where(eq(billingAccountTable.id, cardInfo.id))
    .limit(1);
  if (billingAccount.length === 0) {
    return { statusCode: 400, msg: "bad request" };
  }
  // create new advertisement
  const advertisementAddResult = await db
    .insert(advertisementTable)
    .values({
      advertiserId: advertiser[0].id,
      content: advertisementContent,
      advertisementTierId: tierInfo.id,
    })
    .returning({ insertedId: advertisementTable.id });
  // create transaction entry
  await db.insert(transactionTable).values({
    advertisementId: advertisementAddResult[0].insertedId,
    billingAccountId: billingAccount[0].id,
  });
  return { statusCode: 200, msg: "Successful" };
}
