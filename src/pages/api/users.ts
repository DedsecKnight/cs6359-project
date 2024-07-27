import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import {
  addUserCredentials,
  deleteUserCredentials,
  updateUserCredentials,
} from "@/controllers/users";

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session!.user.role !== "admin") {
    return res.status(403).json({ msg: "unauthorized" });
  }
  const { statusCode, msg } = await updateUserCredentials(
    req.body.id,
    req.body.username,
    req.body.password,
  );
  return res.status(statusCode).json({
    msg,
  });
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session!.user.role !== "admin") {
    return res.status(403).json({ msg: "unauthorized" });
  }
  const { statusCode, msg } = await deleteUserCredentials(req.body.id);
  return res.status(statusCode).json({
    msg,
  });
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session!.user.role !== "admin") {
    return res.status(403).json({ msg: "unauthorized" });
  }
  const { statusCode, msg } = await addUserCredentials(
    req.body.username,
    req.body.password,
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
