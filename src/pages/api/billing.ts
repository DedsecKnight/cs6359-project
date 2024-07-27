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
import {
  createBillingAccount,
  deleteBillingAccount,
  updateBillingAccount,
} from "@/controllers/billing";

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session!.user.role !== "advertiser") {
    return res.status(403).json({ msg: "unauthorized" });
  }
  const { statusCode, msg } = await updateBillingAccount(
    parseInt(session!.user.id),
    req.body.id,
    req.body.creditCardNumber,
  );
  return res.status(statusCode).json({
    msg,
  });
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session!.user.role !== "advertiser") {
    return res.status(403).json({ msg: "unauthorized" });
  }
  const { statusCode, msg } = await deleteBillingAccount(
    parseInt(session!.user.id),
    req.body.id,
  );
  return res.status(statusCode).json({
    msg,
  });
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session!.user.role !== "advertiser") {
    return res.status(403).json({ msg: "unauthorized" });
  }
  const { statusCode, msg } = await createBillingAccount(
    parseInt(session!.user.id),
    req.body.creditCardNumber,
  );
  return res.status(statusCode).json({
    msg,
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
