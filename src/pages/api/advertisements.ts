import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import {
  createNewAdvertisement,
  deleteAdvertisement,
  updateAdvertisementContent,
} from "@/controllers/advertisements";

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session!.user.role !== "advertiser") {
    return res.status(403).json({ msg: "unauthorized" });
  }
  const { statusCode, msg } = await updateAdvertisementContent(
    parseInt(session!.user.id),
    req.body.id,
    req.body.content,
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
  const { statusCode, msg } = await deleteAdvertisement(
    parseInt(session!.user.id),
    req.body.id,
  );
  return res.status(statusCode).json({ msg });
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session!.user.role !== "advertiser") {
    return res.status(403).json({ msg: "unauthorized" });
  }
  const { statusCode, msg } = await createNewAdvertisement(
    parseInt(session!.user.id),
    req.body.content,
    req.body.tierInfo,
    req.body.cardInfo,
  );
  return res.status(statusCode).json({ msg });
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
