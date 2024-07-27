import { NextApiRequest, NextApiResponse } from "next";
import { incrementNumAccessOfPage } from "@/controllers/webpages";

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const { statusCode, msg } = await incrementNumAccessOfPage(req.body.pageId);
  return res.status(statusCode).json({ msg });
}

export default function handle(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  switch (method) {
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
