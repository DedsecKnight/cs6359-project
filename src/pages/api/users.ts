import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { db } from "@/db/db";
import { credentialsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session!.user.role !== "admin") {
    return res.status(403).json({ msg: "unauthorized" });
  }
  await db.update(credentialsTable).set({
    id: req.body.id,
    username: req.body.username,
    password: req.body.password,
  }).where(eq(credentialsTable.id, req.body.id));
  return res.status(200).json({
    msg: "Successfull"
  })
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session!.user.role !== "admin") {
    return res.status(403).json({ msg: "unauthorized" });
  }
  await db.delete(credentialsTable).where(eq(credentialsTable.id, req.body.id));
  return res.status(200).json({
    msg: "Successfull"
  })
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session!.user.role !== "admin") {
    return res.status(403).json({ msg: "unauthorized" });
  }
  await db.insert(credentialsTable).values({
    username: req.body.username,
    password: req.body.password,
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