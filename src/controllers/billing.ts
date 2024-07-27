import { db } from "@/db/db";
import { advertiserTable, billingAccountTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function updateBillingAccount(
  advertiserId: number,
  accountId: number,
  creditCardNumber: string,
) {
  const billingAccount = await db
    .select({ id: billingAccountTable.id })
    .from(billingAccountTable)
    .innerJoin(
      advertiserTable,
      eq(billingAccountTable.advertiserId, advertiserTable.id),
    )
    .where(
      and(
        eq(billingAccountTable.id, accountId),
        eq(advertiserTable.credentialsId, advertiserId),
      ),
    )
    .limit(1);
  if (billingAccount.length === 0) {
    return { statusCode: 404, msg: "Billing account not found" };
  }
  await db
    .update(billingAccountTable)
    .set({
      creditCardNumber,
    })
    .where(eq(billingAccountTable.id, accountId));
  return { statusCode: 200, msg: "Successful" };
}

export async function deleteBillingAccount(
  advertiserId: number,
  accountId: number,
) {
  const billingAccount = await db
    .select({ id: billingAccountTable.id })
    .from(billingAccountTable)
    .innerJoin(
      advertiserTable,
      eq(billingAccountTable.advertiserId, advertiserTable.id),
    )
    .where(
      and(
        eq(billingAccountTable.id, accountId),
        eq(advertiserTable.id, advertiserId),
      ),
    )
    .limit(1);
  if (billingAccount.length === 0) {
    return { statusCode: 404, msg: "Billing Account not found" };
  }
  await db
    .delete(billingAccountTable)
    .where(eq(billingAccountTable.id, accountId));
  return { statusCode: 200, msg: "Successful" };
}

export async function createBillingAccount(
  advertiserId: number,
  creditCardNumber: string,
) {
  const advertiser = await db
    .select({ id: advertiserTable.id })
    .from(advertiserTable)
    .where(eq(advertiserTable.credentialsId, advertiserId))
    .limit(1);
  if (advertiser.length === 0) {
    return { statusCode: 400, msg: "Bad request" };
  }
  await db.insert(billingAccountTable).values({
    creditCardNumber: creditCardNumber,
    advertiserId: advertiser[0].id,
  });
  return { statusCode: 200, msg: "Successful" };
}
