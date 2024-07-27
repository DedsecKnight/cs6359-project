import { getPageTags } from "@/controllers/webpages";
import { NextApiRequest, NextApiResponse } from "next";

async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  const tagList = await getPageTags();
  return res.json({
    autofillKeywords: tagList,
  });
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  switch (method) {
    case "GET": {
      return handleGetRequest(req, res);
    }
    default: {
      return res.status(404).json({
        msg: "Route not found",
      });
    }
  }
}
