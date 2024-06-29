import { db } from "@/db/db";
import { tagTable } from "@/db/schema";
import { NextApiRequest, NextApiResponse } from "next";

async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  const tags = await db.select().from(tagTable);
  const filteredTags = new Set(tags.map(({ tagName }) => tagName));
  return res.json({
    autofillKeywords: Array.from(filteredTags).map((tag, idx) => ({ id: idx, tag }))
  });
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  switch (method) {
    case 'GET': {
      return handleGetRequest(req, res);
    }
    default: {
      return res.status(404).json({
        msg: "Route not found"
      })
    }
  }
}