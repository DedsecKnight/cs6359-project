import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { db } from "@/db/db";
import {
  advertisementTable,
  advertiserTable,
  billingAccountTable,
  credentialsTable,
  transactionTable,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session!.user.role !== "advertiser") {
    return res.status(403).json({ msg: "unauthorized" });
  }
  const billingAccount = await db
    .select({ id: billingAccountTable.id })
    .from(billingAccountTable)
    .innerJoin(
      advertiserTable,
      eq(billingAccountTable.advertiserId, advertiserTable.id),
    )
    .where(
      and(
        eq(billingAccountTable.id, req.body.id),
        eq(advertiserTable.credentialsId, parseInt(session!.user.id)),
      ),
    )
    .limit(1);
  if (billingAccount.length === 0) {
    return res.status(404).json({ msg: "Billing account not found" });
  }
  await db
    .update(billingAccountTable)
    .set({
      creditCardNumber: req.body.creditCardNumber,
    })
    .where(eq(billingAccountTable.id, req.body.id));
  return res.status(200).json({
    msg: "Successfull",
  });
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session!.user.role !== "advertiser") {
    return res.status(403).json({ msg: "unauthorized" });
  }
  const billingAccount = await db
    .select({ id: billingAccountTable.id })
    .from(billingAccountTable)
    .innerJoin(
      advertiserTable,
      eq(billingAccountTable.advertiserId, advertiserTable.id),
    )
    .where(
      and(
        eq(billingAccountTable.id, req.body.id),
        eq(advertiserTable.id, parseInt(session!.user.id)),
      ),
    )
    .limit(1);
  if (billingAccount.length === 0) {
    return res.status(404).json({ msg: "Billing Account not found" });
  }
  await db
    .delete(billingAccountTable)
    .where(eq(billingAccountTable.id, req.body.id));
  return res.status(200).json({
    msg: "Successfull",
  });
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session!.user.role !== "advertiser") {
    return res.status(403).json({ msg: "unauthorized" });
  }
  const advertiser = await db
    .select({ id: advertiserTable.id })
    .from(advertiserTable)
    .where(eq(advertiserTable.credentialsId, parseInt(session!.user.id)))
    .limit(1);
  if (advertiser.length === 0) {
    return res.status(400).json({ msg: "bad request" });
  }
  await db.insert(billingAccountTable).values({
    creditCardNumber: req.body.creditCardNumber,
    advertiserId: advertiser[0].id,
  });
  return res.status(200).json({
    msg: "Successfull",
  });
}
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  switch (method) {
    case "PUT": {
      return handlePutRequest(req, res);
    }
    case "DELETE": {
      return handleDeleteRequest(req, res);
    }
    case "POST": {
      return handlePostRequest(req, res);
    }
    default: {
      return res.status(404).json({
        msg: "Route not found",
      });
    }
  }
}
