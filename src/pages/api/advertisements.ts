import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { db } from "@/db/db";
import { advertisementTable, advertiserTable, credentialsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session!.user.role !== "advertiser") {
    return res.status(403).json({ msg: "unauthorized" });
  }
  const advertisement = await db
    .select({ id: credentialsTable.id })
    .from(advertisementTable)
    .where(eq(advertisementTable.id, req.body.id))
    .innerJoin(
      advertiserTable,
      eq(advertisementTable.advertiserId, advertiserTable.id)
    )
    .innerJoin(
      credentialsTable,
      eq(advertiserTable.credentialsId, credentialsTable.id)
    )
    .limit(1);
  if (advertisement.length === 0) {
    return res.status(404).json({ msg: "Advertisement not found" });
  }
  if (advertisement[0].id != parseInt(session!.user.id)) {
    return res.status(403).json({ msg: "unauthorized" });
  }
  await db.update(advertisementTable).set({
    content: req.body.content,
  }).where(eq(advertisementTable.id, req.body.id));
  return res.status(200).json({
    msg: "Successfull"
  })
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session!.user.role !== "advertiser") {
    return res.status(403).json({ msg: "unauthorized" });
  }
  const advertisement = await db
    .select({ id: credentialsTable.id })
    .from(advertisementTable)
    .where(eq(advertisementTable.id, req.body.id))
    .innerJoin(
      advertiserTable,
      eq(advertisementTable.advertiserId, advertiserTable.id)
    )
    .innerJoin(
      credentialsTable,
      eq(advertiserTable.credentialsId, credentialsTable.id)
    )
    .limit(1);
  if (advertisement.length === 0) {
    return res.status(404).json({ msg: "Advertisement not found" });
  }
  if (advertisement[0].id != parseInt(session!.user.id)) {
    return res.status(403).json({ msg: "unauthorized" });
  }
  await db.delete(advertisementTable).where(eq(advertisementTable.id, req.body.id));
  return res.status(200).json({
    msg: "Successfull"
  })
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session!.user.role !== "advertiser") {
    return res.status(403).json({ msg: "unauthorized" });
  }
  const advertiser = await db.select({ id: advertiserTable.id }).from(advertiserTable).where(eq(advertiserTable.credentialsId, parseInt(session!.user.id))).limit(1);
  if (advertiser.length === 0) {
    return res.status(400).json({ msg: "bad request" });
  }
  await db.insert(advertisementTable).values({
    advertiserId: advertiser[0].id,
    content: req.body.content,
  });
  return res.status(200).json({
    msg: "Successfull"
  })
}
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  switch (method) {
    case 'PUT': {
      return handlePutRequest(req, res);
    }
    case 'DELETE': {
      return handleDeleteRequest(req, res);
    }
    case 'POST': {
      return handlePostRequest(req, res);
    }
    default: {
      return res.status(404).json({
        msg: "Route not found"
      })
    }
  }
}